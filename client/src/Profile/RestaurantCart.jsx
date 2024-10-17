import React, { useState } from 'react';
import './Cart.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faBoxOpen,
    faMotorcycle,
    faClock,
    faLocationArrow,
    faCheckCircle,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import Ratings from './Ratings';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const apiUrlProcess_SOCKET = `${window.location.origin}`;
const socket = io(`${apiUrlProcess_SOCKET}`, {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

function RestaurantCart({ orderData, Notifications, RestaurantToDeliveryBoy }) {
    const apiUrlProcess = `${window.location.origin}/apis`;
    
    const [orderStatus, setOrderStatus] = useState({});
    const [user, setUser] = useState('');
    const [backendError, setBackendError] = useState('');
    const [selectedStep, setSelectedStep] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    // const [Notifications, setNotifications] = useState([]);
    const [showRating, setShowRating] = useState(false);
    const [ErrorBoy, setErrorBoy] = useState('');


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrlProcess}/user-profile`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.status === 401) {
                    setBackendError('Unauthorized');
                    return;
                }
                const userData = await response.json();
                setUser(userData.user);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchUserData();
    }, []);
    useEffect(() => {
        const initialStatuses = {};
        initialStatuses[orderData?.order.id] = {
            orderStatus: orderData?.order?.statusSteps_id || 1,
            currentTime: orderData?.order?.currentTime || orderData?.order?.updatedAt || '',
        }; // default to 0 if not set
        setOrderStatus(initialStatuses);
    }, [])

    const statusSteps = [
        {
            id: 1,
            description: 'Pickup Location',
            detail: 'Restaurant Name, Location',
            icon: faMapMarkerAlt,
        },
        {
            id: 2,
            description: 'Order Packed',
            detail: 'Your order is packed',
            icon: faBoxOpen,
        },
        {
            id: 3,
            description: 'Handed to Delivery Boy',
            detail: 'Order given to delivery boy',
            icon: faMotorcycle,
        },
        {
            id: 4,
            description: 'Reaching in 20 mins',
            detail: 'Order will reach you in 20 minutes',
            icon: faClock,
        },
        {
            id: 5,
            description: 'Order Reached Your Location',
            detail: 'Order has reached your location',
            icon: faLocationArrow,
        },
        {
            id: 6,
            description: 'Order Delivered',
            detail: 'Order has been delivered to you',
            icon: faCheckCircle,
        },
    ];

    const handleStepClick = (order, email, stepIndex) => {
        setSelectedOrder({ order: order, email: email, stepIndex: stepIndex });
        setSelectedStep(stepIndex);
        setShowModal(true);
    };

    const updateOrderStatus = () => {
        const { order, stepIndex, email } = selectedOrder;
        const deliveryBoy = order.deliveryBoysEmails.find(
            (deliveryBoy) =>
                deliveryBoy.Accept === 'Accept' &&
                deliveryBoy.RestaurantAcceptOrReject === 'RestaurantAccept'
        );

        const orderId = order.id;
        const orderStatus = stepIndex + 1;
        if (orderId && stepIndex && email && deliveryBoy) {
            socket.emit('ordersUpdateStatus', { orderId, orderStatus, email, deliveryBoy_Email: deliveryBoy.email });
            setOrderStatus((prevStatuses) => ({
                ...prevStatuses,
                [orderId]: { orderStatus: orderStatus },
            }));
            setShowModal(false);
        } else {
            setErrorBoy(`The delivery boy could not be located. for orderId : ${orderId}`)

        }
    };

    useEffect(() => {
        socket.on('SentordersUpdatedStatus', (OrderData) => {
            setOrderStatus((prevStatuses) => ({
                ...prevStatuses,
                [OrderData.orderId]: {
                    orderStatus: OrderData.orderStatus,
                    currentTime: OrderData.currentTime,
                }
            }));
            if (OrderData?.orderStatus === 6) {
                setShowRating(true);
            }
        });
        return () => {
            socket.off('SentordersUpdatedStatus');
        };
    }, []);



    const [selectedBoy, setSelectedBoy] = useState(null);

    const handleViewClick = (deliveryBoy) => {
        if (selectedBoy && selectedBoy._id === deliveryBoy._id) {
            setSelectedBoy(null); // Deselect if the same button is clicked
        } else {
            setSelectedBoy(deliveryBoy); // Select the clicked delivery boy

        }
    };

    const [selectedBoyNotification, setSelectedBoyNotification] = useState(null);

    const handleViewClickNotifications = (deliveryBoy) => {
        if (selectedBoyNotification && selectedBoyNotification._id === deliveryBoy._id) {
            setSelectedBoyNotification(null); // Deselect if the same button is clicked
        } else {
            setSelectedBoyNotification(deliveryBoy); // Select the clicked delivery boy

        }
    };

    function calculateTimeDifference(select, postCreatedAt) {
        if (!postCreatedAt && select == 2) {
            return ',but another person was selected for this order.'
        }

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

        return `${formattedDifference} ago`;
    }

    const RestaurantAcceptDeliveryBoy = async (deliveryBoy, orderId) => {
        socket.emit('RestaurantAcceptDeliveryBoyOrNot', { deliveryBoy: deliveryBoy, orderId: orderId });
    }
    const [RestaurantAccept, setRestaurantAccept] = useState(false);

    useEffect(() => {
        if (orderData && orderData.order.deliveryBoysEmails) {
            const isAccepted = orderData.order.deliveryBoysEmails.some(deliveryBoy =>
                deliveryBoy.RestaurantAcceptOrReject === 'RestaurantAccept'
            );
            setRestaurantAccept(isAccepted);
        }
    }, [orderData]);

    const handleReload = () => {
        window.location.reload(); // Forces a page reload
    };

    return (
        <div className="cart-container">
            <div className="left-section">
                <div className="user-details">
                    {orderData && (
                        <>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                <LazyLoadImage src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${orderData.parentUserDetails.image}.jpg`} alt="Profile" className="user-profile-picture"
                                    effect="opacity"
                                    wrapperProps={{
                                        style: { transitionDelay: "1s" },
                                    }}
                                />
                            </div>
                            <p>{orderData.parentUserDetails.firstname} {orderData.parentUserDetails.lastname}</p>
                            <p>phone : {orderData.parentUserDetails.phone}</p>
                        </>
                    )}
                </div>
                {user && user.restaurant === '1' ?
                    <>
                        <div className="user-details user-details-notification">
                            {Notifications && Notifications[0]?.orderDetails ?
                                <h3 className="delivery-heading">We have new delivery boys available to accept your orders. </h3>
                                :
                                <h3 className="delivery-heading">No new delivery boys are available at the moment.</h3>
                            }
                            {Notifications?.map((orderDetails, index) => (
                                <div key={index}>
                                    <div className="delivery-boy-card">
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                            <LazyLoadImage src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${orderDetails.orderDetails.image}.jpg`} alt="Profile" className="user-profile-picture"
                                                effect="opacity"
                                                wrapperProps={{
                                                    style: { transitionDelay: "1s" },
                                                }}
                                            />
                                        </div>
                                        <div className="delivery-boy-info">
                                            <p className="delivery-boy-name">{orderDetails.orderDetails.firstname} {orderDetails.orderDetails.lastname}</p>
                                            <p className="delivery-boy-phone">Phone: {orderDetails.orderDetails.phone}</p>
                                        </div>
                                        <div className="button-group-notification">
                                            <button className="accept-button" onClick={handleReload}>Accept</button>
                                            <button className="reject-button">Reject</button>
                                            <button className="view-button" onClick={() => handleViewClickNotifications(orderDetails.orderDetails.deliveryBoy)}>View</button>
                                        </div>
                                    </div>
                                    <div className={`delivery-boy-details ${selectedBoyNotification && selectedBoyNotification._id === orderDetails.orderDetails.deliveryBoy._id ? 'delivery-boy-details-Extent' : ''}`}>
                                        {selectedBoyNotification && selectedBoyNotification._id === orderDetails.orderDetails.deliveryBoy._id && (
                                            <div className='delivery-boy-details-1'>
                                                <div>
                                                    <h4>Details:</h4>
                                                    <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                                        <LazyLoadImage
                                                            src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${orderDetails.orderDetails.deliveryBoy.frontImage}.jpg`} alt="Front" className="vehicle-image vehicle-image-restaurant"
                                                            effect="opacity"
                                                            wrapperProps={{
                                                                style: { transitionDelay: "1s" },
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                                        <LazyLoadImage
                                                            src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${orderDetails.orderDetails.deliveryBoy.rearImage}.jpg`} alt="Rear" className="vehicle-image vehicle-image-restaurant"
                                                            effect="opacity"
                                                            wrapperProps={{
                                                                style: { transitionDelay: "1s" },
                                                            }}
                                                        />
                                                    </div>
                                                    <p>Vehicle Number: {orderDetails.orderDetails.deliveryBoy.vehicleNumber}</p>
                                                    <p>Status: {orderDetails.orderDetails.deliveryBoy.currentStatus}</p>
                                                </div>
                                                <div className='delivery-boy-details-2'>
                                                    <p><strong>Deliveries Completed: </strong> {orderDetails.orderDetails.deliveryBoy.DeliveriesCompleted}</p>
                                                    <p><strong>Rating: </strong> {((orderDetails.orderDetails.deliveryBoy.Ratings[0].Rating) * 5 / orderDetails.orderDetails.deliveryBoy.Ratings[0].RatingCount).toFixed(1)}/5.0 </p>
                                                    <p><strong>RatingCount: </strong>  ({orderDetails.orderDetails.deliveryBoy.Ratings[0].RatingCount} reviews)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {Notifications && Notifications[0]?.orderDetails ?
                                <p style={{ display: 'flex', justifyContent: 'center', padding: '10px', fontSize: '14px' }}>New notifications have arrived. Please
                                    <button style={{ color: 'blue', textDecoration: 'underline', paddingLeft: '10px' }} onClick={handleReload}> reload the page</button>.</p>
                                : ''}
                        </div>

                        <div className="user-details user-details-notification">
                            <h3 className="delivery-heading">Delivery boy who can accept this order for delivery</h3>
                            {orderData && orderData.order.deliveryBoysEmails && orderData.order.deliveryBoysEmails.map((deliveryBoy, index) => (
                                <div key={index}>
                                    {deliveryBoy.Accept === 'Accept' ?
                                        <>
                                            <div className="delivery-boy-card">
                                                <div>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                                        <LazyLoadImage src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${deliveryBoy.image}.jpg`} alt="Profile" className="user-profile-picture"
                                                            effect="opacity"
                                                            wrapperProps={{
                                                                style: { transitionDelay: "1s" },
                                                            }}
                                                        />
                                                    </div>
                                                    <p style={{ fontSize: '8px' }}>{calculateTimeDifference(1, deliveryBoy.AcceptedOrRejectedTime)}</p>
                                                </div>
                                                <div className="delivery-boy-info">
                                                    <p className="delivery-boy-name">{deliveryBoy.firstname} {deliveryBoy.lastname}</p>
                                                    <p className="delivery-boy-phone">Phone: {deliveryBoy.phone}</p>
                                                </div>
                                                <div className="button-group-notification">
                                                    {(deliveryBoy.RestaurantAcceptOrReject === 'RestaurantAccept' || RestaurantAccept || RestaurantToDeliveryBoy?.find((data) => data.orderId === orderData.order.id)?.deliveryBoy?.RestaurantAcceptOrReject === 'RestaurantAccept') ?
                                                        <p style={{ fontSize: '8px' }}>Accepted {calculateTimeDifference(2, deliveryBoy.RestaurantAcceptOrRejectTime ? deliveryBoy.RestaurantAcceptOrRejectTime : RestaurantToDeliveryBoy?.find((data) => data.orderId === orderData.order.id)?.deliveryBoy?.RestaurantAcceptOrRejectTime)}</p>
                                                        :
                                                        <button className="accept-button" onClick={() => RestaurantAcceptDeliveryBoy(deliveryBoy, orderData.order.id)}>Accept</button>
                                                    }
                                                    <button className="reject-button">Reject</button>
                                                    <button className="view-button" onClick={() => handleViewClick(deliveryBoy)}>View</button>
                                                </div>
                                            </div>
                                            <div className={`delivery-boy-details ${selectedBoy && selectedBoy._id === deliveryBoy._id ? 'delivery-boy-details-Extent' : ''}`}>
                                                {selectedBoy && selectedBoy._id === deliveryBoy._id && (
                                                    <div className='delivery-boy-details-1'>
                                                        <div>
                                                            <h4>Details:</h4>
                                                            <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                                                <LazyLoadImage
                                                                    src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${selectedBoy.deliveryBoy.frontImage}.jpg`} alt="Front" className="vehicle-image vehicle-image-restaurant"
                                                                    effect="opacity"
                                                                    wrapperProps={{
                                                                        style: { transitionDelay: "1s" },
                                                                    }}
                                                                />
                                                            </div>
                                                            <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                                                <LazyLoadImage
                                                                    src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${selectedBoy.deliveryBoy.rearImage}.jpg`} alt="Rear" className="vehicle-image vehicle-image-restaurant"
                                                                    effect="opacity"
                                                                    wrapperProps={{
                                                                        style: { transitionDelay: "1s" },
                                                                    }}
                                                                />
                                                            </div>
                                                            <p>Vehicle Number: {selectedBoy.deliveryBoy.vehicleNumber}</p>
                                                            <p>Status: {selectedBoy.deliveryBoy.currentStatus}</p>
                                                        </div>
                                                        <div className='delivery-boy-details-2'>
                                                            <p><strong>Deliveries Completed: </strong> {selectedBoy.deliveryBoy.DeliveriesCompleted}</p>
                                                            <p><strong>Rating: </strong> {((selectedBoy.deliveryBoy.Ratings[0].Rating) * 5 / selectedBoy.deliveryBoy.Ratings[0].RatingCount).toFixed(1)}/5.0 </p>
                                                            <p> ({selectedBoy.deliveryBoy.Ratings[0].RatingCount} reviews)</p>                                    </div>
                                                    </div>
                                                )}
                                            </div>
                                            {showRating && deliveryBoy.RestaurantAcceptOrReject === 'RestaurantAccept' && (
                                                <Ratings
                                                    setShowRating={setShowRating}
                                                    user={user}
                                                    order={orderData?.order}
                                                    deliverBoy={deliveryBoy}
                                                    source="notification"
                                                />
                                            )}
                                        </>
                                        : ''}
                                </div>
                            ))}
                        </div>
                    </> : (user.deliveryBoy && user.deliveryBoy.length && user?.deliveryBoy[user.deliveryBoy.length - 1]?.admin === '1') ?
                        (
                            (() => {
                                const restaurantAcceptOrRejectTime = RestaurantToDeliveryBoy?.find((data) => data.orderId === orderData.order.id)?.deliveryBoy?.RestaurantAcceptOrRejectTime
                                    || orderData?.order?.deliveryBoysEmails.find((emailStatus) => emailStatus.email === user.email)?.RestaurantAcceptOrRejectTime;
                                return restaurantAcceptOrRejectTime ? (
                                    <>
                                        <p style={{ fontSize: '8px' }}>
                                            {calculateTimeDifference(3, restaurantAcceptOrRejectTime)}
                                        </p>
                                        <p style={{ paddingLeft: '5px' }}>
                                            <strong>{user.firstname} {user.lastname} -</strong> You have been selected for this order by <strong>{orderData ? orderData.order.RestaurantName : ''}.</strong>
                                        </p>
                                        {showRating && (
                                            <Ratings
                                                setShowRating={setShowRating}
                                                user={user}
                                                order={orderData?.order}
                                                source="notification"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p style={{ fontSize: '8px' }}>
                                            {calculateTimeDifference(3, restaurantAcceptOrRejectTime)}
                                        </p>
                                        <p style={{ paddingLeft: '5px' }}>
                                            <strong>{user.firstname} {user.lastname} -</strong> You have not been selected for this order by<strong>{orderData ? orderData.order.RestaurantName : ''}.</strong>
                                        </p>
                                    </>
                                );
                            })()
                        )
                        : ''}

                <div className="order-status">

                    <div className="user-order-history">
                        {backendError && <p className="error">{backendError}</p>}
                        <ul>
                            {orderData ? (
                                <li key={orderData.order.id} className={`order-item-profile ${orderData.order.status.toLowerCase()}`}>
                                    <div>
                                        <strong>Order Date:</strong> {new Date(orderData.order.createdAt).toLocaleDateString()} - {new Date(orderData.order.createdAt).toLocaleTimeString()}
                                    </div>
                                    <div>
                                        <strong>Items Ordered:</strong>
                                        <ul>
                                            {orderData.order.items.map((item, index) => (
                                                <li key={index} className="order-item-details">
                                                    <div style={{ width: '60px', height: '60px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                                        <LazyLoadImage
                                                            src={item.itemImage} alt={item.itemName} className="order-item-image"
                                                            effect="opacity"
                                                            wrapperProps={{
                                                                style: { transitionDelay: "1s" },
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="item-quantity-name">
                                                            <p>{item.Quantity}</p>
                                                            <strong className='strong-mul'>X</strong>
                                                            <p>{item.itemName}</p>
                                                        </div>
                                                        <p>Price: ₹{item.Price}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>Status:</strong> {orderData.order.status}
                                        <strong style={{ paddingLeft: '10px' }}>Amount:</strong> ₹{orderData.order.amount}
                                    </div>

                                    <h3>Order Status</h3>
                                    {orderData.order.status === 'In-Progress' ?
                                        <div className="status-line">
                                            {statusSteps.map((step, index) => (
                                                <div
                                                    key={step.id}
                                                    className={`status-step ${orderStatus[orderData.order.id]?.orderStatus >= step.id ? 'active' : ''}`}
                                                >
                                                    <div className="circle-container">
                                                        <div className="circle"></div>
                                                        {orderStatus[orderData.order.id]?.orderStatus >= step.id && (
                                                            <FontAwesomeIcon icon={faCheck} className="check-icon" />
                                                        )}
                                                    </div>
                                                    <div className="status-detail">
                                                        <FontAwesomeIcon
                                                            icon={step.icon}
                                                            className={`status-icon ${orderStatus[orderData.order.id]?.orderStatus >= step.id ? 'active' : ''}`}
                                                        />
                                                        <div className="text-container">
                                                            <p className="status-description">{step.description}</p>
                                                            <p className="status-info">{step.detail}</p>
                                                            {((user?.restaurant === '1' || (user.deliveryBoy && user.deliveryBoy.length && user?.deliveryBoy[user?.deliveryBoy?.length - 1]?.admin === '1')) && orderData.order.status === 'In-Progress') ? (
                                                                <p><button className='update-order-location' onClick={() => handleStepClick(orderData.order, orderData.parentUserDetails.email, index)}>set order Status</button></p>
                                                            ) : ''}
                                                        </div>
                                                        {orderStatus[orderData.order.id]?.orderStatus === step.id ?
                                                            <p style={{ color: 'blue', padding: '0 10px' }} className="status-info">{orderStatus[orderData.order.id]?.currentTime ? `Updated ${calculateTimeDifference(4, orderStatus[orderData.order.id].currentTime)}` : ''}</p>
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        : orderData.order.status === 'Delivered' ?
                                            <div style={{ color: 'green', textAlign: 'center', margin: '10px 0' }}>Order Delivered</div>
                                            : <div style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>Order Cancled</div>
                                    }
                                </li>
                            ) : ''}
                        </ul>
                    </div>
                </div>
                {/* Modal for status update confirmation */}
                {showModal && selectedStep !== null && (
                    <div className="status-update-modal">
                        <div className="status-update-modal-content">
                            <h3>Update Order Status</h3>
                            <p><strong>Description:</strong> {statusSteps[selectedStep].description}</p>
                            <p><strong>Step Details:</strong> {statusSteps[selectedStep].detail}</p>
                            {ErrorBoy && <p style={{ color: 'red', fontSize: '12px', paddingTop: '10px' }}>{ErrorBoy}</p>}
                            <div className="status-update-btn">
                                <button onClick={() => { setShowModal(false); setErrorBoy(''); }}>Cancel</button>
                                <button onClick={updateOrderStatus}>OK</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantCart;
