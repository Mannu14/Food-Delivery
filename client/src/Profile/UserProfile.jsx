import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { NavLink } from 'react-router-dom';
import DeliveryBoyForm from './DeliveryBoyForm';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SkeletonLoading } from '../Loading/SkeletonLoading';
import LoadingShow from '../Loading/Loading';

function UserProfile() {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [UserOrders, setUserOrder] = useState(null);
    const [user, setUser] = useState(null);
    const [restaurantUser_User, setrestaurantUser_User] = useState(null);
    const [restTime, setRestTime] = useState(null);
    const [upProfile, setupProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data from your API endpoint
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrlProcess}/user-profile`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies if necessary
                });

                const userData = await response.json();

                // Calculate totals
                const totalOrders = userData.userOrder?.orders?.length || 0;
                const totalDelivered = userData.userOrder?.orders?.filter(order => order.status === 'Delivered').length || 0;
                const totalCanceled = userData.userOrder?.orders?.filter(order => order.status === 'Canceled').length || 0;
                const totalAmountSpent = userData.userOrder?.orders?.reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0;

                // Process orders to extract orderTime, deliveryTime, and orderDate
                const processedOrders = userData.userOrder?.orders?.map(order => {
                    const orderDate = new Date(order.createdAt);
                    return {
                        ...order,
                        orderDate: orderDate.toLocaleDateString(),
                        orderTime: orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        deliveryTime: order.status === 'Delivered' ? `${new Date(order.deliveryTime).toLocaleDateString()} - ${new Date(order.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : null,
                    };
                }) || [];

                setUser(userData.user);
                setrestaurantUser_User(userData.restaurantUser);


                setUserOrder({
                    ...userData.userOrder,
                    totalOrders,
                    totalDelivered,
                    totalCanceled,
                    totalAmountSpent,
                    orders: processedOrders,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Ensure UserOrders is not null before accessing orders
    const sortedOrders = UserOrders?.orders ? [...UserOrders.orders].sort((a, b) => {
        if (a.status === 'In-Progress' && b.status !== 'In-Progress') {
            return -1;
        } else if (a.status !== 'In-Progress' && b.status === 'In-Progress') {
            return 1;
        } else {
            const dateA = new Date(`${a.orderDate} ${a.orderTime}`);
            const dateB = new Date(`${b.orderDate} ${b.orderTime}`);
            return dateB - dateA;
        }
    }) : [];

    const formatTimeTo12Hour = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
    };

    useEffect(() => {
        if (user?.deliveryBoy && user?.deliveryBoy[user.deliveryBoy.length - 1]?.dutyStartTime) {
            const currentDate = new Date();
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();
            const currentTime = currentHours * 60 + currentMinutes;

            const openingTimeStr = user?.deliveryBoy[user.deliveryBoy.length - 1]?.dutyStartTime;
            const closingTimeStr = user?.deliveryBoy[user.deliveryBoy.length - 1]?.dutyEndTime;

            const [openingHours, openingMinutes] = openingTimeStr.split(':').map(Number);
            const openingTime = openingHours * 60 + openingMinutes;

            const [closingHours, closingMinutes] = closingTimeStr.split(':').map(Number);
            const closingTime = closingHours * 60 + closingMinutes;

            if (currentTime <= openingTime && currentTime <= closingTime) {
                setRestTime(true)
            }
        }
    }, [user]);

    const heandelsetupProfile = () => {
        setupProfile(!upProfile)
    }

    const Loading = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                {loading ? (
                    <>
                        <LoadingShow stroke="#a49dc1" width="25px" height="25px" />
                        <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}>Loading...</p>
                    </>) : (
                    <NavLink style={{ padding: '1px 20px', borderRadius: '50px', border: '2px solid #ba9cff', marginLeft: '20px', color: '#555' }}
                        to='/auth?startwith=signIn&sendTo=UserProfile'>Login</NavLink>
                )}
            </div>
        );
    };
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setShowLoading(false);
        }
    }, [user]);

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 10,
    };

    const shadowStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    };

    return (
        <>
            <div style={{ position: 'relative' }}>
                {showLoading && (
                    <div style={overlayStyle}>
                        <div style={shadowStyle}></div>
                        <div>{Loading()}</div>
                    </div>
                )}
            </div>
            <div className="user-profile-container" style={{ opacity: showLoading ? 0.2 : 1 }}>
                {(!user || loading) ? <SkeletonLoading
                    MPadding='20px' Mwidth='100%' width1='120px' height1='120px' borderRadius1='50%' margin1='0 0 10px 0' width2='40%' height2='30px' borderRadius2='6px' margin2='0px 0 20px 30%'
                    width3='40%' height3='30px' borderRadius3='6px' margin3='0px 0 40px 30%'
                />
                    : <div className="user-header">
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                            <LazyLoadImage
                                src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${user.image}.jpg`} alt="Profile" className="user-profile-picture"
                                effect="opacity"
                                wrapperProps={{
                                    style: { transitionDelay: "1s" },
                                }}
                            />
                        </div>
                        <h2>{user.firstname} {user.lastname}</h2>
                        <p className="user-email">{user.email}</p>
                    </div>
                }

                {/* Delivery Boy Section */}

                {(!user || loading) ? <SkeletonLoading
                    MPadding='20px' Mwidth='100%' width1='100px' height1='70px' borderRadius1='10px' margin1='0px 0px 10px 20%'
                    width2='100px' height2='70px' borderRadius2='10px' margin2='-79px 0px 20px 60%' animation2={7}
                    background2='linear-gradient(to right, rgb(238, 238, 238) 7%, rgb(187, 187, 187) 38%, rgb(238, 238, 238) 7%, rgb(238, 238, 238) 38%)'
                    width3='60%' height3='30px' borderRadius3='6px' margin3='0px 0 25px 0'
                    width4='60%' height4='40px' borderRadius4='6px' margin4='0px 0 25px 0'
                    width5='60%' height5='50px' borderRadius5='6px' margin5='0px 0 25px 0'
                /> : <>
                    {user?.deliveryBoy[user.deliveryBoy.length - 1]?.admin === '1' && user.restaurant === '0' ? (
                        <div className="profile-container">
                            <h3 className='vhical-image'>Vehicle images (Front/Rear)</h3>
                            <div className="vehicle-images">
                                <div>
                                    <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                        <LazyLoadImage
                                            src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${user.deliveryBoy[user.deliveryBoy.length - 1].frontImage}.jpg`} alt="Vehicle Front" className="vehicle-image"
                                            effect="opacity"
                                            wrapperProps={{
                                                style: { transitionDelay: "1s" },
                                            }}
                                        />
                                    </div>
                                    <p>Vehicle Front</p>
                                </div>
                                <div>
                                    <div style={{ width: '100px', height: '70px', borderRadius: '10px', backgroundColor: '#c1affb' }}>
                                        <LazyLoadImage src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${user.deliveryBoy[user.deliveryBoy.length - 1].rearImage}.jpg`} alt="Vehicle Rear" className="vehicle-image"
                                            effect="opacity"
                                            wrapperProps={{
                                                style: { transitionDelay: "1s" },
                                            }}
                                        />
                                    </div>
                                    <p>Vehicle Rear</p>
                                </div>
                            </div>

                            <div className="profile-details">
                                <h3>Profile Details</h3>
                                <ul>
                                    <li><strong>Vehicle Number:</strong> {user.deliveryBoy[user.deliveryBoy.length - 1].vehicleNumber}</li>
                                    <li><strong>Phone No. : </strong>{user.phone}</li>
                                    <li><strong>Current Location:</strong> {user.deliveryBoy[user.deliveryBoy.length - 1].currentLocation}</li>
                                    <li><strong>dutyTime:</strong>
                                        {formatTimeTo12Hour(user.deliveryBoy[user.deliveryBoy.length - 1].dutyStartTime)}-
                                        {formatTimeTo12Hour(user.deliveryBoy[user.deliveryBoy.length - 1].dutyEndTime)}
                                    </li>
                                    <li><strong>Deliveries Completed:</strong> {user.deliveryBoy[user.deliveryBoy.length - 1].DeliveriesCompleted}</li>
                                    <li><strong>Rating:</strong> {(user.deliveryBoy[0].Ratings[0].Rating).toFixed(1)} / 5.0</li>

                                </ul>
                            </div>

                            <div className="profile-status">
                                <h3>Current Status</h3>
                                {restTime ? <p style={{ color: '#777' }}>off Duty</p> :
                                    <p>{user.deliveryBoy[user.deliveryBoy.length - 1].currentStatus}</p>}
                            </div>
                            <h3 className='vhical-image'>
                                <button className="order-button" onClick={() => heandelsetupProfile()}>Update Profile</button>
                            </h3>
                            {upProfile ? <DeliveryBoyForm updateProfile={'yes'} userEmail={user.email} setupProfile={heandelsetupProfile} /> : ''}
                        </div>
                    ) : (user.restaurant != '1') ?
                        <div className="profile-container">
                            <h3 className='vhical-image'>
                                <button className="order-button" onClick={() => setupProfile(!upProfile)}>Become Delivery boy</button>
                            </h3>
                            {upProfile ? <DeliveryBoyForm userEmail={user.email} /> : ''}
                        </div>
                        : ''}
                </>
                }

                {/* Restaurant Section */}
                {(!user || loading) ? <SkeletonLoading
                    MPadding='20px' Mwidth='100%' MDisplay='flex' width1='50px' height1='50px' borderRadius1='5px' margin1='0 0 10px 0' width2='40%' height2='30px' borderRadius2='6px' margin2='9px 0 0 20px'
                /> : <>
                    {user.restaurant === '1' && restaurantUser_User && (
                        Array.isArray(restaurantUser_User) ? (
                            restaurantUser_User.map((restaurant) => (
                                <div className="restaurant-container" key={restaurant.RestaurantId}>
                                    <div className="restaurant profile-restaurant">
                                        <NavLink to={`/restaurant/${restaurant.RestaurantId}`}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '5px', backgroundColor: '#c1affb', marginBottom: '10px' }}>
                                                <LazyLoadImage
                                                    src={restaurant.RestaurantImgage ? `https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${restaurant.RestaurantImgage}.jpg` : 'https://via.placeholder.com/50'} alt={restaurant.RestaurantName}
                                                    effect="opacity"
                                                    wrapperProps={{
                                                        style: { transitionDelay: "1s" },
                                                    }}
                                                    style={{ borderRadius: '5px' }}
                                                />
                                            </div>
                                            <h3>{restaurant.RestaurantName}</h3>
                                        </NavLink>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="restaurant-container">
                                <div className="restaurant profile-restaurant">
                                    <NavLink to={`/restaurant/${restaurantUser_User._id}`}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '5px', backgroundColor: '#c1affb' }}>
                                            <LazyLoadImage
                                                src={restaurantUser_User.RestaurantImgage ? `https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${restaurantUser_User.RestaurantImgage}.jpg` : 'https://via.placeholder.com/50'} alt={restaurantUser_User.RestaurantName}
                                                effect="opacity"
                                                wrapperProps={{
                                                    style: { transitionDelay: "1s" },
                                                }}
                                            />
                                        </div>
                                        <h3>{restaurantUser_User.RestaurantName}</h3>
                                    </NavLink>
                                </div>
                            </div>
                        )
                    )}
                </>
                }

                {(!user || !UserOrders || loading) ?
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                        <LoadingShow stroke="#a49dc1" width="25px" height="25px" />
                        <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}>Loading...</p>
                    </div>
                    :
                    <>
                        <div className="user-stats">
                            <h3>Order Statistics</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <h4>Total Orders</h4>
                                    <p>{UserOrders.totalOrders}</p>
                                </div>
                                <div className="stat-item">
                                    <h4>Total Delivered</h4>
                                    <p>{UserOrders.totalDelivered}</p>
                                </div>
                                <div className="stat-item">
                                    <h4>Total Canceled</h4>
                                    <p>{UserOrders.totalCanceled}</p>
                                </div>
                                <div className="stat-item">
                                    <h4>Total Amount Spent</h4>
                                    <p>₹{(UserOrders.totalAmountSpent).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="user-order-history">
                            <h3>Order History</h3>
                            <ul>
                                {sortedOrders && sortedOrders.length > 0 ? sortedOrders.map(order => (
                                    <li key={order.id} className={`order-item-profile ${order.status.toLowerCase()}`}>
                                        <div>
                                            <strong>Order Date:</strong> {order.orderDate} - {order.orderTime}
                                            {order.deliveryTime && (
                                                <>
                                                    <strong style={{ paddingLeft: '10px' }}> Delivered at:</strong> {order.deliveryTime}
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <strong>Items Ordered:</strong>
                                            <ul>
                                                {order.items.map((item, index) => (
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
                                                                <p>{item.itemName}  </p>
                                                            </div>
                                                            <p>Price: ₹{item.Price}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <strong>Status:</strong> {order.status}
                                            <strong style={{ paddingLeft: '10px' }}>Amount:</strong> ₹{order.amount}
                                        </div>
                                    </li>
                                )) :
                                    <p style={{ color: 'gray', textAlign: 'center', padding: '20px' }}>You have not placed any orders yet.</p>
                                }
                            </ul>
                        </div>
                    </>
                }
            </div>
        </>
    );
}

export default UserProfile;
