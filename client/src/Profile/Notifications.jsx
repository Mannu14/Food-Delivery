import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import './Notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell } from '@fortawesome/free-light-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import RestaurantCart from './RestaurantCart';
import Loading from '../Loading/LoadingP';
import { NavLink, useLocation } from "react-router-dom";
import LoadingShow from '../Loading/Loading';

import { LazyLoadImage } from 'react-lazy-load-image-component';

const apiUrlProcess_SOCKET = `${window.location.origin}`;
const socket = io(`${apiUrlProcess_SOCKET}`, {
    withCredentials: true,
});

const Notifications = () => {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [user, setuser] = useState(null);
  const [userData, setuserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [NotificationCount, setNotificationCount] = useState(0);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [deliveryBoyNotifications, setdeliveryBoyNotifications] = useState([]);
  const [RestaurantToDeliveryBoy, setRestaurantToDeliveryBoy] = useState([]);

  useEffect(() => {
    // Listen for 'newNotification' events from the server
    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });
    // Clean up socket connection when the component unmounts
    return () => {
      socket.off('newNotification');
    };
  }, [user]);

  useEffect(() => {
    socket.on('SentToDeliveryBoyAndUser', (deliveryBoyData) => {
      setRestaurantToDeliveryBoy((prevNotifications) => [deliveryBoyData, ...prevNotifications]);
    });
    return () => {
      socket.off('SentToDeliveryBoyAndUser');
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const calculateNotificationCount = (data) => {
    let count = 0;
    data?.forEach((notification) => {
      notification?.orderDetails?.deliveryBoys.forEach((deliveryBoy) => {
        if (notification.seen === false && (deliveryBoy.email === user || notification.orderDetails.restaurantUserEmail === user)) {
          count += 1;
        }
      });
    });
    setNotificationCount(count);
  };
  useEffect(() => {
    calculateNotificationCount(notifications);
  }, [notifications]);

  const calculateUnseenCount = (data) => {
    const currentUserEmail = user;
    let count = 0;

    data?.forEach((orderData) => {
      orderData.order.deliveryBoysEmails.forEach((emailStatus) => {
        if (emailStatus.email === currentUserEmail && emailStatus.seen === false) {
          count += 1;
        }
      });
    });
    setUnseenCount(count);
  };
  useEffect(() => {
    calculateUnseenCount(notificationsData);
  }, [notificationsData, user]);

  const handleMarkAsSeen = (orderId) => {
    const currentUserEmail = user;
    notifications.forEach((notification) => {
      if (notification.orderDetails.orderId === orderId && !notification.seen) {
        socket.emit('markAsRead', { orderId, email: currentUserEmail });
      }
    });

    notificationsData.forEach((notification) => {
      if (notification.order.id === orderId) {
        notification.order.deliveryBoysEmails.forEach((emailStatus) => {
          if (emailStatus.email === currentUserEmail && !emailStatus.seen) {
            socket.emit('markAsRead', { orderId, email: currentUserEmail });
          }
        })
      }
    });


    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.orderDetails.orderId === orderId
          ? { ...notification, seen: true }
          : notification
      )
    );

    setNotificationsData((prevData) =>
      prevData.map((data) => {
        if (data.order.id === orderId) {
          const updatedDeliveryBoysEmails = data.order.deliveryBoysEmails.map((emailStatus) =>
            emailStatus.email === currentUserEmail
              ? { ...emailStatus, seen: true }
              : emailStatus
          );
          return {
            ...data,
            order: {
              ...data.order,
              deliveryBoysEmails: updatedDeliveryBoysEmails,
            },
          };
        }
        return data;
      })
    );
    calculateNotificationCount(notifications);
    calculateUnseenCount(notificationsData);
    setExpandedNotificationId((prevId) => (prevId === orderId ? null : orderId));
  };

  const [loading, setLoading] = useState(false);
  const [UserLoading, setUserLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [NotificationDataPage, setNotificationDataPage] = useState(0);
  const observer = useRef();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    if (page === 1) {
      setUserLoading(true);
    }
    try {
      const response = await fetch(`${apiUrlProcess}/Get-delivery-Notification?page=${page}`, {
        method: 'GET',
        credentials: 'include',
      });

      const Data = await response.json();
      setuser(Data?.user);
      setuserData(Data?.userData);
      // -----------------------------
      const totalPages = Math.ceil(Data.TotalLength / 3);
      setNotificationDataPage(totalPages);

      if (Data.NotificationData.length === 0) {
        setHasMore(false); // Set hasMore to false if no more comments
      } else {
        setNotificationsData((NotificationData) => [...NotificationData, ...Data.NotificationData]);
      }
      // -----------------------------
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setUserLoading(false)
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const lastCommentRef = useCallback(
    (node) => {
      if (loading) return; // Do nothing if currently loading
      if (observer.current) observer.current.disconnect(); // Disconnect the previous observer
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (page <= NotificationDataPage) {
            setPage((prevPage) => prevPage + 1); // Increment page number when the last comment is visible
          }
          else {
            return;
          }
        }
      });
      if (node) observer.current.observe(node); // Observe the last comment
    },
    [loading, hasMore]
  );

  function calculateTimeDifference(postCreatedAt) {
    const postDate = new Date(postCreatedAt);
    const currentDate = new Date();
    const timeDifferenceMs = currentDate.getTime() - postDate.getTime();
    // Convert milliseconds to seconds, minutes, hours, days, months, years
    const secondsDifference = Math.floor(timeDifferenceMs / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30); // Approximate calculation
    const yearsDifference = currentDate.getFullYear() - postDate.getFullYear();
    // Format the calculated difference (optional)
    let formattedDifference;
    if (yearsDifference > 0) {
      formattedDifference = `${yearsDifference} years`;
    } else if (monthsDifference > 0) {
      formattedDifference = `${monthsDifference} months`;
    } else if (daysDifference > 0) {
      formattedDifference = `${daysDifference + 1} days`;
    } else if (hoursDifference > 0) {
      formattedDifference = `${hoursDifference} hours`;
    } else if (minutesDifference > 0) {
      formattedDifference = `${minutesDifference} minutes`;
    } else {
      formattedDifference = `${secondsDifference} seconds`;
    }

    return formattedDifference;
  }

  const handleAccept = (select, orderId, RestaurantName, selectedPaymentMethod) => {
    setSelectedOrder({ select: select, orderId: orderId, email: user, RestaurantName: RestaurantName, selectedPaymentMethod: selectedPaymentMethod });
    setShowModal(true);
  };
  const [loadingsent, setLoadingsent] = useState(false);

  const sentAcceptRequest = async () => {
    setLoadingsent(true);
    const { select, orderId, email } = selectedOrder;

    try {
      if (orderId && email) {
        const response = await fetch(`${apiUrlProcess}/deliveryboy/sent-AcceptRequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, email }),
        });

        if (response.ok) {
          const Data = await response.json();
          setNotificationsData((prevData) =>
            prevData.map((data) => {
              if (data.order.id === orderId) {
                const updatedDeliveryBoysEmails = data.order.deliveryBoysEmails.map((emailStatus) =>
                  emailStatus.email === email
                    ? {
                      ...emailStatus, Accept: 'Accept',
                      AcceptedOrRejectedTime: new Date(),
                    }
                    : emailStatus
                );
                return {
                  ...data,
                  order: {
                    ...data.order,
                    deliveryBoysEmails: updatedDeliveryBoysEmails,
                  },
                };
              }
              return data;
            })
          );
          setShowModal(false);
          socket.emit('sendNotificationToRestaurant', { orderId, email });
          if (select == 1) {
            window.location.reload();
          }
        } else {
          console.error('Failed to sent Accept Request');
        }
      }
    } catch (error) {
      console.error('Error sent Accept Request:', error);
    }
    finally {
      setLoadingsent(false);
      setExpandedNotificationId((prevId) => (prevId === orderId ? null : orderId));
    }
  };

  useEffect(() => {
    socket.on('receiveNotificationToRestaurant', (notification) => {

      setdeliveryBoyNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });
    return () => {
      socket.off('receiveNotificationToRestaurant');
    };
  }, []);

  useEffect(() => {
    const handleOrderUpdate = (OrderData) => {
      setNotificationsData((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.order.id === OrderData.orderId
            ? {
              ...notification,
              order: {
                ...notification.order,
                statusSteps_id: OrderData.orderStatus,
                currentTime: OrderData.currentTime,
              }
            }
            : notification
        )
      );
    };

    socket.on('SentordersUpdatedStatus', handleOrderUpdate);

    return () => {
      socket.off('SentordersUpdatedStatus', handleOrderUpdate);
    };
  }, []);

  const handleReload = () => {
    window.location.reload(); // Forces a page reload
  };

  const containerRef = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        toggleNotifications(); // Call onClose if clicked outside the container
      }
    },
    [toggleNotifications]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const location = useLocation();
  const IsNotifications = location.pathname === '/Notifications' | '/notifications';


  if (UserLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingShow stroke={'#a49dc1'} width={'25px'} height={'25px'} /></div>
  }

  return (
    <>
      <div className={`notification-container ${(userData?.deliveryBoy[0]?.admin === '1' || userData?.restaurant === '1') ? 'notification-container-extent' : ''}`}>
        {!IsNotifications && (
          <div className="notification-icon" onClick={toggleNotifications}>
            <ion-icon name="notifications-outline" style={{ fontSize: '35px' }}></ion-icon>
            {(notifications.length > 0 || NotificationCount > 0 || unseenCount > 0) && (
              (unseenCount + NotificationCount > 0) && (
                <span className="count">
                  {unseenCount > 0 ? unseenCount + NotificationCount : NotificationCount}
                </span>
              )
            )}
          </div>
        )}
        <div style={{ display: `${(showNotifications || IsNotifications) ? 'block' : 'none'}` }}>
          {(showNotifications || IsNotifications) && (
            <div className={`${!IsNotifications ? 'div-for-notification' : ''}`}>
              <div className={`${!IsNotifications ? 'notification-list-2' : ''} notification-list`} ref={containerRef}>
                {notifications.length > 0 ? notifications.map((notification, index) => (
                  (notification.orderDetails.deliveryBoys.some(deliveryBoy => deliveryBoy.email === userData.email) || notification.orderDetails.restaurantUserEmail === userData.email) && (
                    <div key={notification.orderDetails.orderId}>
                      <div
                        onClick={() => handleMarkAsSeen(notification.orderDetails.orderId)}
                        className={`notification-item ${notification.seen === false ? 'seen' : 'unseen'}`}
                      >
                        <div className="notification-content">
                          <div className="notification-header">
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                              <LazyLoadImage
                                alt={notification.orderDetails.restaurantName}
                                className="restaurant-image"
                                src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${notification.orderDetails.restaurantImage}.jpg`}
                                effect="blur"
                                wrapperProps={{
                                  style: { transitionDelay: "1s" },
                                }}
                              />
                            </div>
                            <div className="notification-title">
                              <h4 className="restaurant-name">{notification.orderDetails.restaurantName}</h4>
                              <p className="user-name">{notification.orderDetails.userName}</p>
                            </div>
                          </div>
                          <p className="notification-message">{notification.message}</p>
                          <div className="notification-details">
                            <p><strong>Phone:</strong> {notification.orderDetails.userPhone}</p>
                            <p><strong>Items:</strong> {notification.orderDetails.items.length}</p>
                          </div>
                          <div className="notification-details">
                            <p><strong>From: </strong>
                              {notification.orderDetails.restaurantAddress.pincode} -
                              {notification.orderDetails.restaurantAddress.area},
                              {notification.orderDetails.restaurantAddress.district} -
                              {notification.orderDetails.restaurantAddress.state}
                            </p>
                            <p><strong>To: </strong>
                              {notification.orderDetails.DeliveryAddress.pincode},
                              {notification.orderDetails.DeliveryAddress.Apartment} -
                              {notification.orderDetails.DeliveryAddress.Building} -
                              {notification.orderDetails.DeliveryAddress.Street} -
                              {notification.orderDetails.DeliveryAddress.area},
                              {notification.orderDetails.DeliveryAddress.district}
                            </p>
                          </div>
                        </div>
                        <div className='notification-time'>
                          <p>just now</p>
                        </div>
                      </div>
                      <div className={`accept-reject-div ${expandedNotificationId === notification.orderDetails.orderId ? 'extent-Div' : ''}`}>
                        {expandedNotificationId === notification.orderDetails.orderId && notification.orderDetails.restaurantUserEmail != userData.email ? (
                          <div className="notification-expanded">
                            <div className="notification-expanded-btn">
                              <button id={`accept-${notification.orderDetails.orderId}`} onClick={() => handleAccept(1, notification.orderDetails.orderId, notification.orderDetails.RestaurantName, notification.orderDetails.selectedPaymentMethod)}>Accept</button>
                              <button id={`reject-${notification.orderDetails.orderId}`}>Reject</button>
                            </div>
                          </div>
                        ) : (notification.orderDetails.restaurantUserEmail === userData.email) ?
                          <p style={{ display: 'flex', justifyContent: 'center', padding: '10px', fontSize: '14px' }}>New notifications have arrived. Please
                            <button style={{ color: 'blue', textDecoration: 'underline', paddingLeft: '10px' }} onClick={handleReload}> reload the page</button>.</p>
                          : ''
                        }
                      </div>
                    </div>
                  )
                )) : (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '14px' }}>All clear! No new notifications right now.</p>
                )}


                <hr style={{ padding: '1px' }} />
                <p style={{ textAlign: 'center', padding: '10px', color: '#555', fontSize: '14px' }}>Previously received message.</p>

                {notificationsData.length > 0 ? notificationsData
                  .sort((a, b) => new Date(b.order.createdAt) - new Date(a.order.createdAt)) // Sort by createdAt time, most recent first
                  .map((orderData, index) => (
                    <div key={index} ref={index === notificationsData.length - 1 ? lastCommentRef : null}>
                      <div
                        onClick={() => handleMarkAsSeen(orderData.order.id)}
                        className={`notification-item ${orderData.order.deliveryBoysEmails.some(
                          (emailStatus) => emailStatus.email === user && emailStatus.seen === false
                        )
                          ? 'seen'
                          : 'unseen'
                          }`}
                      >
                        <div className="notification-content">
                          <div className="notification-header">
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#c1affb', marginRight: '10px' }}>
                              <LazyLoadImage
                                src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${orderData.order.RestaurantImgSrc}.jpg`}
                                alt={orderData.order.RestaurantName}
                                className="restaurant-image"
                                effect="blur"
                                wrapperProps={{
                                  style: { transitionDelay: "1s" },
                                }}
                              />
                            </div>
                            <div className="notification-title">
                              <h4 className="restaurant-name">{orderData.order.RestaurantName}</h4>
                              <p className="user-name">{orderData.parentUserDetails.firstname} {orderData.parentUserDetails.lastname}</p>
                            </div>
                          </div>
                          <p className="notification-message">{orderData.message}</p>
                          <div className="notification-details">
                            <p><strong>Phone:</strong> {orderData.parentUserDetails.phone}</p>
                            <p><strong>Items:</strong> {orderData.order.items.length}</p>
                          </div>
                          <div className="notification-details">
                            <p><strong>from : </strong>
                              {orderData.parentUserDetails.restaurantAddress.pincode}-
                              {orderData.parentUserDetails.restaurantAddress.area},
                              {orderData.parentUserDetails.restaurantAddress.district}-
                              {orderData.parentUserDetails.restaurantAddress.state}
                            </p>
                            <p><strong>to : </strong>
                              {orderData.order.DeliveryAddress[0].pincode},
                              {orderData.order.DeliveryAddress[0].Apartment}-
                              {orderData.order.DeliveryAddress[0].Building}-
                              {orderData.order.DeliveryAddress[0].Street}-
                              {orderData.order.DeliveryAddress[0].area},
                              {orderData.order.DeliveryAddress[0].district}
                            </p>
                          </div>
                        </div>
                        <div className='notification-time'>
                          <p>{calculateTimeDifference(orderData.order.createdAt)} ago</p>
                        </div>
                      </div>
                      <div className={`accept-reject-div ${expandedNotificationId === orderData.order.id && (userData.restaurant === '1' || userData.deliveryBoy[0].admin === '1') ? 'extent-Div-1' : (expandedNotificationId === orderData.order.id) ? 'extent-Div' : ''}`}>
                        {expandedNotificationId === orderData.order.id && userData.restaurant === '1' ? (
                          <div className="notification-expanded">
                            <RestaurantCart orderData={orderData} Notifications={deliveryBoyNotifications?.filter(
                              (notification) => (notification.orderDetails.orderId === orderData.order.id && notification.orderDetails.restaurantUserEmail === user)
                            )} RestaurantToDeliveryBoy={RestaurantToDeliveryBoy} />
                          </div>
                        ) : (expandedNotificationId === orderData.order.id && userData.deliveryBoy[0].admin === '1') ?
                          <div className="notification-expanded">
                            <div className="notification-expanded-btn">
                              {orderData.order.deliveryBoysEmails.some(
                                (emailStatus) => emailStatus.email === user && emailStatus.Accept === 'Accept'
                              )
                                ? <span style={{ fontSize: '10px' }}>Accept {calculateTimeDifference(orderData.order.deliveryBoysEmails.find((emailStatus) => emailStatus.email === user).AcceptedOrRejectedTime)} ago</span>
                                :
                                <button style={{ fontSize: '17px' }} className="accept-button" id={`accept-${orderData.order.id}`} onClick={() => handleAccept(5, orderData.order.id, orderData.order.RestaurantName, orderData.order.selectedPaymentMethod)}>Accept</button>
                              }

                              <button style={{ fontSize: '17px' }} className="reject-button" id={`reject-${orderData.order.id}`}>Reject</button>
                            </div>
                            {RestaurantToDeliveryBoy?.some(
                              (notification) => (
                                notification?.orderId === orderData?.order.id && notification?.deliveryBoy.email === user
                              )
                            ) ? (
                              <RestaurantCart
                                orderData={orderData}
                                RestaurantToDeliveryBoy={RestaurantToDeliveryBoy} // If you need to remove this prop, simply delete this line
                              />
                            ) : (
                              (() => {
                                const isRestaurantAcceptOrReject = orderData.order.deliveryBoysEmails.some(
                                  (emailStatus) => emailStatus.RestaurantAcceptOrReject === 'RestaurantAccept'
                                );
                                return (
                                  orderData.order.deliveryBoysEmails.some(
                                    (emailStatus) => emailStatus.email === user && emailStatus.RestaurantAcceptOrReject === 'RestaurantAccept'
                                  ) && isRestaurantAcceptOrReject) ? (
                                  <RestaurantCart
                                    orderData={orderData}
                                  // RestaurantToDeliveryBoy={RestaurantToDeliveryBoy} // If you need to remove this prop, simply delete this line
                                  />
                                ) : isRestaurantAcceptOrReject ? (
                                  <p style={{ paddingLeft: '5px' }}>
                                    <strong>{userData.firstname} {userData.lastname} -</strong> You have not been selected for this order by <strong>{orderData ? orderData.order.RestaurantName : ''}.</strong>
                                  </p>
                                ) : (
                                  < p style={{ fontSize: '14px' }}> No matching orders found</p>
                                )
                              })()
                            )}

                          </div>
                          : ''}
                      </div>
                    </div>
                  )) :
                  <p style={{ textAlign: 'center', padding: '20px', color: '#555', fontSize: '14px' }}>No recent updates to display.</p>
                }
                {loading && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                  <LoadingShow stroke="#a49dc1" width="25px" height="25px" />
                  <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#777', fontSize: '17px' }}>Loading...</p>
                </div>}
                {!hasMore && !loading && <p style={{ fontSize: '18px', padding: '30px' }} className="no-more-comments">No more comments</p>}

              </div>
            </div>
          )
          }
        </div>
      </div >
      {
        showModal && selectedOrder !== null && (
          <div className="status-update-modal" style={{ zIndex: '1002' }}>
            <div className="status-update-modal-content" style={{ maxWidth: '450px', fontSize: '17px' }}>
              <h3 style={{ color: '#555', paddingBottom: '5px' }}>Accept Order</h3>
              <p style={{ color: '#666', paddingBottom: '5px' }}>Are you sure you want to accept the order from  <strong>{selectedOrder.RestaurantName}?</strong> </p>
              <p style={{ color: '#666', paddingBottom: '5px' }}>Payment Method : <strong>{selectedOrder.selectedPaymentMethod}</strong> </p>
              <div className="status-update-btn">
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={sentAcceptRequest}>
                  {loadingsent ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '20px' }}><LoadingShow width="20px" height="20px" /> please wait...</div> : 'OK'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </ >
  );
};

export default Notifications;
