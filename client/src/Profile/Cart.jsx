import React, { useState } from 'react';
import './Cart.css';
import { useSelector, useDispatch } from 'react-redux';
import { REMOVE, UPDATE_ITEM_QUANTITY, ADD } from '../component/redux/action/action';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clearCart } from '../component/redux/action/action';
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
import CouponComponent from './CouponComponent';
import LoadingShow from '../Loading/Loading';
import { SkeletonLoading } from '../Loading/SkeletonLoading';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const apiUrlProcess_SOCKET = `${window.location.origin}`;
const socket = io(`${apiUrlProcess_SOCKET}`, {
    withCredentials: true,
    transports: ['websocket', 'polling']
});
 


function Cart() {
    const [orderStatus, setOrderStatus] = useState({});
    const [contactlessDelivery, setContactlessDelivery] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [coupon, setCoupon] = useState('');
    const [isCouponValid, setIsCouponValid] = useState(null);
    const [BackedError, setBackedError] = useState('');
    const [finalAmount, setFinalAmount] = useState(0);
    const [showOrHideAddress, setShowOrHideAddress] = useState(false);
    const [user, setUser] = useState('');
    const [sortedOrders, setSortedOrders] = useState([]);
    const [backendError, setBackendError] = useState('');

    const [selectedStep, setSelectedStep] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [errors, setErrors] = useState({});
    // ----- location ---
    const [CurrentLocationError, setCurrentLocationError] = useState(null);
    const [State, setState] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: '', lng: '' });
    const [restaurant_lat_lng, setrestaurant_lat_lng] = useState({ lat: '', lng: '' });
    const [distance, setDistance] = useState(null);
    const [isAddressSet, setIsAddressSet] = useState(false);

    const [RestaurantToDeliveryBoy, setRestaurantToDeliveryBoy] = useState([]);
    const [showRating, setShowRating] = useState(false);
    const [RestaurantMenuForCart, setRestaurantMenuForCart] = useState('');
    const [DiscountValueIS, setDiscountValue] = useState(0);
    const [isCoupon, setIsCoupon] = useState(null);
    // ___________loading____________
    const [orderStatusLoading, setorderStatusLoading] = useState(true);
    const [CartLoading, setCartLoading] = useState(true);
    const [User_ProfileLoading, setUser_ProfileLoading] = useState(true);

    useEffect(() => {
        socket.on('SentToDeliveryBoyAndUser', (deliveryBoyData) => {
            setRestaurantToDeliveryBoy((prevNotifications) => [deliveryBoyData, ...prevNotifications]);
        });
        return () => {
            socket.off('SentToDeliveryBoyAndUser');
        };
    }, []);

    const [address, setAddress] = useState({
        area: '',
        district: '',
        pincode: '',
        state: ''
    });
    const [addressABS, setaddressABS] = useState({
        Apartment: '',
        Building: '',
        Street: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setorderStatusLoading(true);
            try {
                const response = await fetch(`${apiUrlProcess}/Cart/orders/in-progress`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.status === 401) {
                    setBackedError('Unauthorized');
                    return;
                }
                const data = await response.json();
                setSortedOrders(data?.ordersData);

                const initialStatuses = {};
                data.ordersData?.forEach((order) => {
                    initialStatuses[order.id] = {
                        orderStatus: order.statusSteps_id || 1,
                        currentTime: order?.updatedAt || '',
                    };
                });
                setOrderStatus(initialStatuses);

                setBackendError(data.alertMsg)

            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setBackendError('Failed to fetch user data.');
            }
            finally {
                setorderStatusLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrlProcess}/Cart`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    console.log("Error to fetch data");
                }
                if (response.status === 401) {
                    setBackedError('Unauthorized');
                    return;
                }
                const data = await response.json();
                setRestaurantMenuForCart(data.RestaurantMenuForCart)

                const findLength = data?.ordersData?.orders?.length - 1;
                const deliveryAddress = data?.ordersData?.orders[findLength]?.DeliveryAddress[0];


                if (deliveryAddress) {
                    setaddressABS({
                        Apartment: deliveryAddress.Apartment,
                        Building: deliveryAddress.Building,
                        Street: deliveryAddress.Street
                    });
                    setAddress({
                        area: deliveryAddress.area,
                        district: deliveryAddress.district,
                        pincode: deliveryAddress.pincode,
                        state: deliveryAddress.state
                    });
                    setShowOrHideAddress(!showOrHideAddress);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        setUser_ProfileLoading(true);
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrlProcess}/user-profile`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const userData = await response.json();
                setUser(userData.user);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
            finally {
                setUser_ProfileLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cartreduser.carts);

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const calculateTotalPrice = () => {
            return cartItems.reduce((total, item) => {
                return total + parseFloat(item.price) * item.value;
            }, 0);
        };

        setCartLoading(true);
        const timeoutId = setTimeout(() => {
            setTotalPrice(calculateTotalPrice());
            setCartLoading(false);
        }, 2000); // Simulate loading delay

        return () => clearTimeout(timeoutId); // Cleanup on unmount
    }, [cartItems]);

    const billDetails = {
        itemTotal: totalPrice.toFixed(2),
        deliveryFee: 20 + parseFloat(calculateDeliveryFee(distance).toFixed(2)),
        discount: -25,
        platformFee: 7.006,
        gst: 10.08,
        toPay: finalAmount,
    };
    useEffect(() => {
        setFinalAmount((totalPrice + billDetails.deliveryFee + billDetails.discount + billDetails.platformFee + billDetails.gst).toFixed(2))
    }, [totalPrice, distance]);

    const applyCoupon = (inputCoupon) => {
        if (RestaurantMenuForCart) {
            const restaurant = RestaurantMenuForCart.find(r => r.RestaurantId === cartItems[0].RestaurantRestaurantId);
            if (restaurant) {
                const deal = restaurant.DealsByRestaurant.find(d => d.discount === inputCoupon);

                if (deal && finalAmount > parseInt(deal.Price) && isCouponValid !== true) {
                    const discountValue = parseInt(deal.discount.replace(/\D/g, ''), 10);
                    setDiscountValue(discountValue);

                    const discountAmount = (finalAmount * (discountValue / 100));
                    const newFinalAmount = (finalAmount - discountAmount).toFixed(2);
                    setFinalAmount(newFinalAmount);
                    setIsCouponValid(true);
                    setIsCoupon(true);
                }
                if (finalAmount <= parseInt(deal?.Price) || deal?.discount !== coupon) {
                    setIsCoupon(false);
                    setIsCouponValid(false);
                    resetFinalAmount();
                }
            }
        }
    };

    const resetFinalAmount = () => {
        setFinalAmount((totalPrice + billDetails.deliveryFee + billDetails.discount + billDetails.platformFee + billDetails.gst).toFixed(2));
    };

    const getInitialQuantity = (MenuId) => {
        const itemInCart = cartItems.find(item => item.DataId === MenuId);
        return itemInCart ? itemInCart.value : 0;
    };

    const QuantityChange = (MenuId, change) => {
        const newQuantity = getInitialQuantity(MenuId) + change;
        if (newQuantity > 0) {
            dispatch(UPDATE_ITEM_QUANTITY(MenuId, newQuantity));
        } else {
            dispatch(REMOVE(MenuId));
        }
    };

    const handleOrderButtonClick = async (e) => {
        e.preventDefault();
        if (!cartItems[0]) {
            setBackedError('*!Your cart is empty; kindly add items to proceed.');
            return;
        }

        if (Object.keys(errors).length != 0 || !isAddressSet) {
            if (!isAddressSet) { setBackedError('*Please set the address correctly before proceeding.') }
            if (errors.pincode) { setBackedError(errors.pincode) }
            else if (errors.village) { setBackedError(errors.village) }
            else if (errors.district) { setBackedError(errors.district) }
            else if (errors.state) { setBackedError(errors.state) }
        }
        else if (selectedPaymentMethod === 'COD' && isAddressSet &&
            (address.area && address.district && address.pincode && address.state) && (addressABS.Apartment || addressABS.Building || addressABS.Street)
        ) {
            try {
                // Prepare the payload
                const payload = {
                    email: user.email,
                    orders: [{
                        RestaurantId: cartItems[0].RestaurantRestaurantId,
                        RestaurantImgSrc: cartItems[0].RestaurantImgSrc,
                        RestaurantName: cartItems[0].RestaurantName,
                        DeliveryAddress: {
                            area: address.area,
                            district: address.district,
                            pincode: address.pincode,
                            state: address.state,
                            Apartment: addressABS.Apartment,
                            Building: addressABS.Building,
                            Street: addressABS.Street
                        },
                        amount: finalAmount,
                        selectedPaymentMethod: 'COD',
                        deliveryTime: '',
                        items: cartItems.map(item => ({
                            MenuId: item.DataId || null,
                            itemName: item.title,
                            itemImage: item.imgSrc,
                            Quantity: item.value,
                            Price: (item.value * item.price).toFixed(2),
                        }))
                    }]
                };

                socket.emit('registerDeliveryBoy', { payload });

                setBackedError('Order successfully placed!')
                setTimeout(() => {
                    alert('Order successfully placed!');
                    dispatch(clearCart());
                }, 1000);

            } catch (error) {
                console.error('There was an error submitting the order data!', error);
                setBackedError('Failed to submit order. Please try again.');
            }
        } else {
            if (selectedPaymentMethod !== 'COD') {
                setBackedError('*Please select a payment option before proceeding.')
            } else {
                setBackedError('*please fill all the address field currectly')
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value,
        })
    };

    const handleInputChangeaddressABS = (e) => {
        const { name, value } = e.target;
        setaddressABS({
            ...addressABS,
            [name]: value,
        })
    };

    // ----- location ---

    useEffect(() => {
        setrestaurant_lat_lng({
            lat: cartItems && cartItems[0] ? cartItems[0].lat : '', lng: cartItems && cartItems[0] ? cartItems[0].lng : ''
        })
    }, []);

    const [LoadingKeys, setLoadingKeys] = useState(true);
  const [Keys, setKeys] = useState({});
  useEffect(() => {
    // Fetch user data from your API endpoint
    const fetchKeyData = async () => {
      setLoadingKeys(true);
      try {
        const response = await fetch(`${apiUrlProcess}/keys`, {
          method: 'GET',
          credentials: 'include',
        });

        const KEYSData = await response.json();
        setKeys(KEYSData.KEYS);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchKeyData();
  }, []);


    const fetchLocationDataMap = async (query) => {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${Keys.FRONTEND_OPENCAGEDATA_GOOGLE_MAP_KEY}&language=en&pretty=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results.length > 0) {
                const location = data.results[0].geometry;
                const components = data.results[0].components;
                return { location, components }; // Return the location data
            } else {
                console.error('No location data found for the provided address.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            return null;
        }
    };

    const getLocation = async () => {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

            if (permissionStatus.state === 'denied') {
                setState('denied');
                alert('Please allow access to your location.');
                setCurrentLocationError('*Please allow access to your location.');
                return;
            }

            if (permissionStatus.state === 'granted') {
                setState('granted');
            }

            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;
                const result = await fetchLocationDataMap(`${latitude},${longitude}`);

                if (result) {
                    const { location, components } = result;
                    setMapCenter({ lat: location.lat, lng: location.lng });

                    // Set the address based on the fetched location
                    setAddress({
                        area: components.village || components.town || components.city || components._normalized_city || restaurantData.RestaurantLocation.area,
                        district: components.city || components.state_district || restaurantData.RestaurantLocation.district,
                        pincode: components.postcode || restaurantData.RestaurantLocation.pincode,
                        state: components.state || restaurantData.RestaurantLocation.state,
                    });

                    // Calculate the distance
                    const distance_km = haversine(restaurant_lat_lng.lat, restaurant_lat_lng.lng, latitude, longitude);
                    setDistance(distance_km.toFixed(2));
                } else {
                    console.error('Unable to set address from location data.');
                }
            } else {
                setCurrentLocationError('*Geolocation is not supported by this browser.');
            }
        } catch (err) {
            setCurrentLocationError('*Error getting location: ' + err.message);
        }
    };

    const UseCurrentLocation = () => {
        if (State === 'granted') {
            setCurrentLocationError('*You are already using your current location.');
        }
        if (State === 'denied') {
            setCurrentLocationError('*Please allow access to your location.');
            return;
        }
        getLocation();
    };

    const AddressOnclickEdit = async () => {
        setShowOrHideAddress(!showOrHideAddress);
    }
    const AddressOnclick = async () => {
        if (!showOrHideAddress) {
            const { pincode, area, district, state } = address;
            const query = `${area} ${district} ${pincode} ${state}`;
            let queryrequire = `${pincode || ''} ${area || ''} ${district || ''} ${state || ''}`.trim();
            if (!queryrequire) {
                setCurrentLocationError('*Please provide at least one address component to fetch location data.');
                return;
            }
            const result = await fetchLocationDataMap(query);

            if (result) {
                const { location, components } = result;
                setMapCenter({ lat: location.lat, lng: location.lng });
                const distance_km = haversine(restaurant_lat_lng.lat, restaurant_lat_lng.lng, location.lat, location.lng);
                if (validateLocationData(components)) {
                    setDistance(distance_km.toFixed(2));
                    // setFinalAmount(parseFloat(finalAmount)+parseFloat(calculateDeliveryFee(distance_km.toFixed(2)).toFixed(2)));
                    setShowOrHideAddress(!showOrHideAddress);
                    setIsAddressSet(true);
                }
            } else {
                setCurrentLocationError('*Unable to fetch location data for the provided address.');
                console.error('Unable to fetch location data for the provided address.');
            }
        }
    };

    const validateLocationData = (components) => {
        const errors = {};
        const { pincode, area, district, state } = address;
        setErrors({});
        const componentsPostcode = components.postcode;
        const pincodeLower = pincode;
        const areaLower = (area || "").toLowerCase();
        const componentsVillage = (components.village || "").toLowerCase();
        const componentsTown = (components.town || "").toLowerCase();
        const componentsCity = (components.city || "").toLowerCase();
        const componentsNormalizedCity = (components._normalized_city || "").toLowerCase();
        const componentsState = (components.state || "").toLowerCase();
        const stateLower = (state || "").toLowerCase();
        const componentsStateDistrict = (components.state_district || "").toLowerCase();
        const districtLower = (district || "").toLowerCase();

        if (componentsPostcode !== pincodeLower) {
            errors.pincode = 'Pincode does not match the selected location.';
        }
        let AreaComponent = '';
        if (componentsVillage) {
            AreaComponent = componentsVillage;
        } else if (componentsTown) {
            AreaComponent = componentsTown;
        } else if (componentsCity) {
            AreaComponent = componentsCity;
        } else if (componentsNormalizedCity) {
            AreaComponent = componentsNormalizedCity;
        } else { AreaComponent = "*Component is Not Present" }
        if (AreaComponent !== areaLower) {
            errors.village = '*Village or town does not match the selected location.';
        }
        if (componentsCity !== districtLower && componentsStateDistrict !== districtLower) {
            errors.district = '*District does not match the selected location.';
        }
        if (componentsState !== stateLower) {
            errors.state = '*State does not match the selected location.';
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        }

        return Object.keys(errors).length === 0;
    };

    const haversine = (lat1, lon1, lat2, lon2) => {
        setCurrentLocationError('')
        const R = 6371; // Radius of the Earth in kilometers
        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

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
        const orderId = order.id;
        const orderStatus = stepIndex + 1;
        if (orderId && stepIndex && email) {
            socket.emit('ordersUpdateStatus', { orderId, orderStatus, email });
            setOrderStatus((prevStatuses) => ({
                ...prevStatuses,
                [orderId]: { orderStatus: orderStatus, currentTime: new Date() || '' },
            }));
            setShowModal(false);
        } else {
            console.log(`Not founded ${orderId} ${stepIndex}  ${email}`);

        }
    };

    function calculateDeliveryFee(distance) {
        const baseDistance = 5;
        const additionalFeePerKm = 5;

        if (distance <= baseDistance) {
            return 0;
        } else {
            const additionalDistance = distance - baseDistance;
            return additionalDistance * additionalFeePerKm;
        }
    }

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
                // setOrderId(OrderData.orderId)
            }
        });
        return () => {
            socket.off('SentordersUpdatedStatus');
        };
    }, []);

    const [showCoupons, setShowCoupons] = useState(false);
    const [TrueFalse, setTrue] = useState(false);

    const toggleCoupons = () => {
        setShowCoupons(!showCoupons);
    };
    const toggleisCoupon = () => {
        setIsCoupon(false);
    };
    const setCouponFor = (e) => {
        setCoupon(e.target.value);
        setIsCouponValid(null);
        setIsCoupon(null);
        resetFinalAmount();
    };

    useEffect(() => {
        if (coupon && TrueFalse) {
            applyCoupon(coupon);
            setTrue(false);
        }
    }, [coupon, RestaurantMenuForCart, TrueFalse]);


    const Loading = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <LoadingShow stroke="#a49dc1" width="25px" height="25px" />
                <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}>Loading...</p>
            </div>
        );
    };

    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

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

    if (LoadingKeys) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <LoadingShow stroke="#a1a0f9" width="25px" height="25px" />
          <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}> Loading...</p>
        </div>;
      }

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
            <div className="cart-container" style={{ opacity: showLoading ? 0.5 : 1 }}>
                <div className="left-section">
                    <div className="user-details">
                        {User_ProfileLoading ? (<SkeletonLoading
                            MPadding='0' Mwidth='100%' width1='50px' height1='50px' borderRadius1='50%' margin1='0 0 10px 0' width2='40%' height2='20px' borderRadius2='6px' margin2='0 0 10px 0'
                            width3='90%' height3='20px' borderRadius3='6px' margin3='0'
                        />)
                            : user ? (
                                <>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                        <LazyLoadImage
                                            src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${user.image}.jpg`} alt="Profile" className="user-profile-picture"
                                            effect="opacity"
                                            wrapperProps={{
                                                style: { transitionDelay: "1s" },
                                            }}
                                        />
                                    </div>
                                    <p>{user.firstname} {user.lastname}</p>
                                    <p>phone : {user.phone}</p>
                                </>
                            ) : (
                                <>
                                    <p className='cart-login-signin'>
                                        Please <Link to="/auth?startwith=signIn&sendTo=Cart">Login</Link> or <Link to="/auth?startwith=signUp&sendTo=Cart">Sign Up</Link>
                                    </p>
                                </>
                            )}
                    </div>
                    {(User_ProfileLoading && orderStatusLoading) ? (<>{Loading()}</>) :
                        (
                            <div className="delivery-address">
                                <h3>Delivery Address</h3>
                                {showOrHideAddress ?
                                    <>
                                        <p>Apartment/Unit No:  {addressABS.Apartment}</p>
                                        <p> Building/House No: {addressABS.Building}</p>
                                        <p>Street/Gali: {addressABS.Street}</p>
                                        <p>{address.area}({address.pincode})-{address.district},{address.state} </p>
                                    </> : ''
                                }

                                {!showOrHideAddress ?
                                    <div className="address-box">
                                        <div className="input-group">
                                            <input type="text" id="Apartment" placeholder='' name="Apartment" value={addressABS.Apartment || ''} onChange={handleInputChangeaddressABS} required />
                                            <label htmlFor="Apartment">Apartment/Unit No</label>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" id="Building" placeholder=' ' name="Building" value={addressABS.Building || ''} onChange={handleInputChangeaddressABS} required />
                                            <label htmlFor="Building">Building/House No</label>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" id="Street" placeholder='' name="Street" value={addressABS.Street || ''} onChange={handleInputChangeaddressABS} required />
                                            <label htmlFor="Street">Street/Gali</label>
                                        </div>

                                        <div className="input-group">
                                            <input type="number" id="pincode" placeholder='' name="pincode" value={address.pincode || ''} onChange={handleInputChange} required />
                                            <label htmlFor="pincode">Pincode</label>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" id="area" name="area" placeholder='' value={address.area || ''} onChange={handleInputChange} required />
                                            <label htmlFor="area">Area</label>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" id="district" placeholder='' name="district" value={address.district || ''} onChange={handleInputChange} required />
                                            <label htmlFor="district">District</label>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" id="state" placeholder='' name="state" value={address.state || ''} onChange={handleInputChange} required />
                                            <label htmlFor="state">State</label>
                                        </div>
                                    </div>

                                    : ''}
                                {CurrentLocationError ? <p style={{ color: State === 'granted' ? 'green' : 'red', margin: '10px 0', textAlign: 'center' }}>{CurrentLocationError}</p> : ''}
                                {distance && <p style={{ color: '#6376e3', margin: '15px 0 2px 0', textAlign: 'center' }}>Your distance from {cartItems[0]?.RestaurantName} is {distance} Kms.| ₹{calculateDeliveryFee(distance).toFixed(2)} Delivery fee will apply</p>}
                                {Object.keys(errors).length > 0 && (
                                    <div style={{ margin: '2px 0 15px 0', textAlign: 'center' }} className="error allError">
                                        {errors.pincode && <p>{errors.pincode}</p>}
                                        {errors.village && <p>{errors.village}</p>}
                                        {errors.district && <p>{errors.district}</p>}
                                        {errors.state && <p>{errors.state}</p>}
                                    </div>
                                )}

                                <div style={{ display: 'flex' }}>
                                    <button className='Edit-Set-btn' onClick={UseCurrentLocation}>current location</button>
                                    {showOrHideAddress ?
                                        <button className='Edit-Set-btn' onClick={AddressOnclickEdit}>Edit</button>
                                        :
                                        <button className='Edit-Set-btn' onClick={AddressOnclick}>Set</button>
                                    }
                                </div>
                            </div>
                        )}
                    {(User_ProfileLoading && orderStatusLoading) ? (<>{Loading()}</>) : (
                        <div className="payment-methods">
                            <h3>Payment Methods</h3>
                            <div className="payment-options">
                                <button className={selectedPaymentMethod === 'COD' ? 'selected' : ''} onClick={() => handlePaymentMethodChange('COD')}>
                                    Cash on Delivery
                                </button>
                                <button className={selectedPaymentMethod === 'Paytm' ? 'selected' : ''} onClick={() => handlePaymentMethodChange('Paytm')}>
                                    Paytm
                                </button>
                                <button className={selectedPaymentMethod === 'PhonePe' ? 'selected' : ''} onClick={() => handlePaymentMethodChange('PhonePe')}>
                                    PhonePe
                                </button>
                                <button className={selectedPaymentMethod === 'GooglePay' ? 'selected' : ''} onClick={() => handlePaymentMethodChange('GooglePay')}>
                                    Google Pay
                                </button>
                            </div>
                            {BackedError == 'Order successfully placed!' ? <p style={{ color: 'green', margin: '15px 0', textAlign: 'center' }}> {BackedError} </p> :
                                BackedError ? <p style={{ color: 'red', margin: '15px 0', textAlign: 'center' }}> {BackedError} </p>
                                    : ''}
                            {BackedError == 'Unauthorized' ?
                                <button className="order-button"><NavLink to='/auth?startwith=signIn'>log-in</NavLink></button>
                                :
                                <button className="order-button" onClick={handleOrderButtonClick}>Place Order</button>
                            }
                        </div>
                    )}

                    <div className="order-status">
                        <div className="user-order-history">
                            {backendError && <p className="error">{backendError}</p>}
                            <ul>
                                {orderStatusLoading ? (
                                    <SkeletonLoading
                                        MPadding='0' Mwidth='100%' width1='30%' height1='50px' borderRadius1='6px' margin1='0 0 30px 0' width2='100%' height2='60px' borderRadius2='6px' margin2='0 0 20px 0'
                                        width3='100%' height3='60px' borderRadius3='6px' margin3='0 0 20px 0' width4='100%' height4='60px' borderRadius4='6px' margin4='0'
                                    />
                                )
                                    : sortedOrders?.map((order) => (
                                        <li key={order.id} className={`order-item-profile ${order.status.toLowerCase()}`}>
                                            <div style={{ color: 'green' }}>{order.RestaurantName}-</div>
                                            <div>
                                                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()} - {new Date(order.createdAt).toLocaleTimeString()}
                                            </div>
                                            <div>
                                                <strong>Items Ordered:</strong>
                                                <ul>
                                                    {order.items.map((item, index) => (
                                                        <li key={index} className="order-item-details">
                                                            <div style={{ backgroundColor: '#c1affb', borderRadius: '10px' }}>
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
                                                <strong>Status:</strong> {order.status}
                                                <strong style={{ paddingLeft: '10px' }}>Amount:</strong> ₹{order.amount}
                                            </div>
                                            {(() => {
                                                const deliveryBoy = RestaurantToDeliveryBoy?.find(
                                                    (data) => data.orderId === order.id
                                                )?.deliveryBoy;

                                                return deliveryBoy ? (
                                                    <div className="delivery-boy">
                                                        <h3>Delivery Boy</h3>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                                            <LazyLoadImage
                                                                src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${deliveryBoy.image}.jpg`} alt="Delivery Boy"
                                                                effect="opacity"
                                                                wrapperProps={{
                                                                    style: { transitionDelay: "1s" },
                                                                }}
                                                            />
                                                        </div>
                                                        <p>{deliveryBoy.firstname} {deliveryBoy.lastname}</p>
                                                        <p>{deliveryBoy.phone}</p>
                                                        <p>Vehicle: {deliveryBoy.deliveryBoy.vehicleNumber}</p>
                                                        <p>Estimated Time: {deliveryBoy.estimatedTime ? deliveryBoy.estimatedTime : '20min'}</p>
                                                    </div>
                                                ) : null;
                                            })()}

                                            {order.deliveryBoysEmails.map((deliveryBoyEmail, index) => (
                                                deliveryBoyEmail.details && deliveryBoyEmail.details.firstname ? (
                                                    <div key={index} className="delivery-boy">
                                                        <h3>Delivery Boy</h3>
                                                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                                            <LazyLoadImage
                                                                src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${deliveryBoyEmail.details.image}.jpg`} alt="Delivery Boy"
                                                                effect="opacity"
                                                                wrapperProps={{
                                                                    style: { transitionDelay: "1s" },
                                                                }}
                                                            />
                                                        </div>
                                                        <p>{deliveryBoyEmail.details.firstname} {deliveryBoyEmail.details.lastname}</p>
                                                        <p>{deliveryBoyEmail.details.phone}</p>
                                                        <p>Vehicle: {deliveryBoyEmail.details.deliveryBoy?.[deliveryBoyEmail.details.deliveryBoy.length - 1]?.vehicleNumber || 'N/A'}</p>
                                                        <p>Estimated Time: {deliveryBoyEmail.details.estimatedTime || '20min'}</p>
                                                        <>
                                                            {showRating && (
                                                                <Ratings
                                                                    setShowRating={setShowRating}
                                                                    user={user}
                                                                    deliverBoy={deliveryBoyEmail.details}
                                                                    order={order}
                                                                    source="cart" // Indicate that Ratings is shown from cart
                                                                />
                                                            )}
                                                        </>
                                                    </div>
                                                ) : null
                                            ))}

                                            <h3>Order Status</h3>
                                            <div className="status-line">
                                                {statusSteps.map((step, index) => (
                                                    <div
                                                        key={step.id}
                                                        className={`status-step ${orderStatus[order.id]?.orderStatus >= step.id ? 'active' : ''}`}
                                                    >
                                                        <div className="circle-container">
                                                            <div className="circle"></div>
                                                            {orderStatus[order.id]?.orderStatus >= step.id && (
                                                                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                                                            )}
                                                        </div>
                                                        <div className="status-detail">
                                                            <FontAwesomeIcon
                                                                icon={step.icon}
                                                                className={`status-icon ${orderStatus[order.id]?.orderStatus >= step.id ? 'active' : ''}`}
                                                            />
                                                            <div className="text-container">
                                                                <p className="status-description">{step.description}</p>
                                                                <p className="status-info">{step.detail}</p>
                                                                {user?.restaurant === '1' && user?.deliveryBoy[user.deliveryBoy.length - 1].admin === '1' && (
                                                                    <p><button className='update-order-location' onClick={() => handleStepClick(order, user.email, index)}>set order Status</button></p>
                                                                )}
                                                            </div>
                                                            {orderStatus[order.id]?.orderStatus === step.id ?
                                                                <p style={{ color: 'blue', padding: '0 10px' }} className="status-info">{orderStatus[order.id]?.currentTime ? `Updated ${calculateTimeDifference(orderStatus[order.id].currentTime)} ago` : ''}</p>
                                                                : ''
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
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
                                <div className="status-update-btn">
                                    <button onClick={() => setShowModal(false)}>Cancel</button>
                                    <button onClick={updateOrderStatus}>OK</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>


                <div className="right-section">
                    <div className="order-details">
                        {CartLoading ? (
                            <SkeletonLoading
                                MPadding='0' Mwidth='100%' width1='50px' height1='50px' borderRadius1='6px' margin1='0 0 30px 0'
                            />
                        )
                            : cartItems && cartItems[0] ?
                                <div className="restaurant">
                                    <NavLink to={`/restaurant/${cartItems[0].RestaurantRestaurantId}`}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#c1affb', marginBottom: '10px' }}>
                                            <LazyLoadImage
                                                style={{ borderRadius: '8px' }}
                                                src={`${cartItems[0].RestaurantImgSrc}`} alt=""
                                                effect="opacity"
                                                wrapperProps={{
                                                    style: { transitionDelay: "1s" },
                                                }}
                                            />
                                        </div>
                                        <h3> {cartItems[0].RestaurantName}</h3>
                                    </NavLink>
                                </div> : ''
                        }

                        <div className="order-items">
                            {CartLoading ? (
                                <SkeletonLoading
                                    MPadding='0' Mwidth='100%' width2='100%' height2='60px' borderRadius2='6px' margin2='0 0 20px 0'
                                    width3='100%' height3='60px' borderRadius3='6px' margin3='0 0 20px 0' width4='100%' height4='60px' borderRadius4='6px' margin4='0'
                                />
                            )
                                : cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <div key={item.DataId + index} className="order-item">
                                            <div style={{ width: '70px', height: '70px', borderRadius: '8px', backgroundColor: '#c1affb' }}>
                                                <LazyLoadImage src={item.imgSrc} alt={item.title}
                                                    effect="opacity"
                                                    wrapperProps={{
                                                        style: { transitionDelay: "1s" },
                                                    }}
                                                />
                                            </div>

                                            <p className='order-item-name'>{item.title}</p>
                                            <div className="item-details">
                                                <button onClick={() => QuantityChange(item.DataId, -1)}>-</button>
                                                <b className='item-quantity'>{getInitialQuantity(item.DataId)}</b>
                                                <button onClick={() => QuantityChange(item.DataId, +1)}>+</button>
                                            </div>
                                            <p className='price'>₹{(item.value * item.price).toFixed(2)}</p>
                                        </div>
                                    ))) : ''}
                        </div>
                        <div className="bill-details">
                            <h3>Bill Details</h3>
                            <div>Item Total: <p>₹{billDetails.itemTotal}</p></div>
                            <div>Delivery Fee: <p>₹{billDetails.deliveryFee}</p></div>
                            <div>Discount: <p>₹{billDetails.discount}</p></div>
                            <div>Platform Fee: <p>₹{billDetails.platformFee}</p></div>
                            <div>GST: <p>₹{billDetails.gst}</p></div>
                            <div><strong>To Pay: </strong><strong>₹{billDetails.toPay}</strong></div>
                        </div>
                        <div className="save">you save ₹{isCouponValid === true ? (finalAmount - (finalAmount * 0.8) + Math.abs(billDetails.discount)).toFixed(2) : Math.abs(billDetails.discount)}</div>
                        <div className="coupon-section">
                            <h3>Apply Coupon</h3>
                            {isCouponValid === true && <p className="valid-coupon">Coupon Applied! {DiscountValueIS}% discount applied.</p>}
                            {isCouponValid === false && <p className="invalid-coupon">Invalid Coupon Code.</p>}
                            <div className="input-button">
                                <input
                                    type="search"
                                    placeholder="Enter coupon code"
                                    value={coupon}
                                    onChange={(e) => setCouponFor(e)}
                                    disabled={isCoupon}
                                />
                                {!isCoupon ?
                                    <button onClick={() => applyCoupon(coupon)}>Apply</button>
                                    :
                                    <button onClick={toggleisCoupon}>Edit</button>
                                }
                            </div>
                            <button className='coupon-item-btn' onClick={toggleCoupons}>{!showCoupons ? 'Your Coupons' : 'Hide Coupons'}</button>
                            {showCoupons && (
                                <div className="coupon-popup">
                                    <CouponComponent setTrue={setTrue} toggleCoupons={toggleCoupons} coupon={coupon}
                                        RestaurantId={cartItems[0].RestaurantRestaurantId}
                                        applyCoupon={applyCoupon} setCoupon={setCoupon} finalAmount={finalAmount} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="no-contact-delivery">
                        <label>
                            <input type="checkbox" checked={contactlessDelivery} onChange={() => setContactlessDelivery(!contactlessDelivery)} />
                            Opt in for No-contact Delivery
                        </label>
                        <p>Unwell, or avoiding contact? Please select no-contact delivery. Partner will safely place the order outside your door (not for COD)</p>
                    </div>
                    <div className="cancellation-policy">
                        <h3>Review your order and address details to avoid cancellations</h3>
                        <p>Note: If you cancel within 60 seconds of placing your order, a 100% refund will be issued. No refund for cancellations made after 60 seconds.</p>
                        <p>Avoid cancellation as it leads to food wastage.</p>
                        <p><a href="/cancellation-policy">Read cancellation policy</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;
