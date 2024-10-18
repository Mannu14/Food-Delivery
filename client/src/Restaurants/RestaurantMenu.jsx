import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './RestaurantMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle, faStar, faLocationDot, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { REMOVE, UPDATE_ITEM_QUANTITY, ADD } from '../component/redux/action/action';
import RestaurantForm from './RestaurantForm';
import { useLocation } from 'react-router-dom';
import RestaurantMenuForm from './RestaurantMenuForm';
import Loading from '../Loading/LoadingP';
import CommentsLike from '../Profile/CommentsLike';
import { clearCart } from '../component/redux/action/action';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import LoadingShow from '../Loading/Loading';

function RestaurantMenu() {
    const apiUrlProcess = `${window.location.origin}/apis`;
    
    const { restaurantId } = useParams();
    const [restaurantData, setRestaurantData] = useState(null);
    const [Owner, setOwner] = useState(null);
    const [OwnerSearch, setOwnerSearch] = useState(null);
    const [restaurantDataMenu, setRestaurantDataMenu] = useState(null);
    const [loadingfirst, setLoadingfirst] = useState(true);
    const [loading, setLoading] = useState(false);
    const [Error, setError] = useState('');
    const [restTime, setRestTime] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalOtherRestaurant, setshowModalOtherRestaurant] = useState(false);
    const [showModalMenu, setShowModalMenu] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [showModalDeal, setShowModalDeal] = useState(false);
    const [selectedDealItem, setSelectedDealItem] = useState(null);
    const location = useLocation();
    const IsRestaurantUpdate = location.pathname === `/restaurant/${restaurantId}`;
    const [page, setPage] = useState(1);
    const pageSize = 2;
    const [hasMore, setHasMore] = useState(true);
    // --- searchDishes ---
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [pageMenu, setPageMenu] = useState(1);
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [hasMoreMenu, setHasMoreMenu] = useState(true);
    const [user, setUser] = useState(true);
    const [distance, setDistance] = useState(null);


    useEffect(() => {
        if (restaurantData) {
            const currentDate = new Date();
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();
            const currentTime = currentHours * 60 + currentMinutes;

            const openingTimeStr = restaurantData.Availabitity[0].OpningTime;
            const closingTimeStr = restaurantData.Availabitity[0].ClosingTime;

            const [openingHours, openingMinutes] = openingTimeStr.split(':').map(Number);
            const openingTime = openingHours * 60 + openingMinutes;

            const [closingHours, closingMinutes] = closingTimeStr.split(':').map(Number);
            const closingTime = closingHours * 60 + closingMinutes;

            if (currentTime <= openingTime && currentTime <= closingTime) {
                setRestTime(true)
            }
        }
    }, [restaurantData]);

    useEffect(() => {
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
        };
        fetchUserData();
    }, []);


    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await fetch(`${apiUrlProcess}/api/restaurantMenu/${restaurantId}`);
                const data = await response.json();
                const restaurant_lat = data?.RestaurantLocation[0]?.lat || '';
                const restaurant_lng = data?.RestaurantLocation[0]?.lng || '';
                setError(data.alertMsg)
                setRestaurantData(data);

                const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

                if (permissionStatus.state === 'denied') {
                    // const alertTimeout = setTimeout(() => {
                    //     alert('Turn on location access to measure the distance to the restaurant.');
                    // }, 10);

                    // // Clear the timeout after 2 seconds to prevent further alerts
                    // setTimeout(() => {
                    //     clearTimeout(alertTimeout);
                    // }, 20);
                    return;
                }
                if (navigator.geolocation) {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    const { latitude, longitude } = position.coords;
                    const distance_km = haversine(restaurant_lat, restaurant_lng, latitude, longitude);
                    setDistance(distance_km.toFixed(2));
                } else {
                    console.error('Unable to set address from location data.');
                }

            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            } finally {
                setLoadingfirst(false);
            }
        };

        fetchRestaurantData();
    }, [restaurantId]);

    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cartreduser.carts);


    const getInitialQuantity = (MenuId) => {
        const itemInCart = cartItems.find(item => item.DataId === MenuId);
        return itemInCart ? itemInCart.value : 0;
    };

    const AddQuantity = (menuItem, restaurantData) => {
        const user_id = user?._id;
        const imgSrc = `https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${menuItem.image}.jpg`;
        const price = menuItem.Price;
        const ratings = ((menuItem.Ratings[0].Rating) * 5 / menuItem.Ratings[0].RatingCount).toFixed(1);
        const title = menuItem.ItemName;
        const DataId = menuItem.MenuId;
        const value = getInitialQuantity(DataId) + 1;
        const RestaurantName = restaurantData.RestaurantName;
        const RestaurantImgSrc = `https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${restaurantData.RestaurantImgage}.jpg`;
        const RestaurantRestaurantId = restaurantData.RestaurantId;
        const lat = restaurantData.RestaurantLocation[0].lat;
        const lng = restaurantData.RestaurantLocation[0].lng;
        const productData = { user_id, DataId, RestaurantRestaurantId, lat, lng, RestaurantName, RestaurantImgSrc, imgSrc, title, price, ratings, value };
        if (cartItems[0]?.RestaurantRestaurantId === RestaurantRestaurantId || !cartItems[0]?.RestaurantRestaurantId) {
            dispatch(ADD(productData));
        }
        else {
            setshowModalOtherRestaurant(true);
        }
    };

    const QuantityChange = (MenuId, change) => {
        const newQuantity = getInitialQuantity(MenuId) + change;
        if (newQuantity > 0) {
            dispatch(UPDATE_ITEM_QUANTITY(MenuId, newQuantity));
        } else {
            dispatch(REMOVE(MenuId));
        }
    };

    const formatTimeTo12Hour = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
    };

    const handleUpdateClick = () => {
        setShowModal(true);
    };
    const handleUpdateClickMenu = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setShowModalMenu(true);
    };
    const handleUpdateClickDeal = (menuItem) => {
        setSelectedDealItem(menuItem);
        setShowModalDeal(!showModalDeal);
    };


    const closeModal = () => {
        setShowModal(false);
        setShowModalMenu(false);
        setSelectedMenuItem(null);
        setShowModalDeal(!showModalDeal)
        setSelectedDealItem(null);
    };
    const handleClickOutside = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    };

    // ----------------- for menus=----

    const fetchRestaurantMenus = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrlProcess}/api/restaurantMenuPage?page=${page}&pageSize=${pageSize}&restaurantId=${restaurantId}`);
            const data = await response.json();

            setError(data.alertMsg)
            if (page === 1) {
                setRestaurantDataMenu(data.restaurants);
            } else {
                setRestaurantDataMenu(prevResults => [...prevResults, ...data.restaurants]);
            }

            const totalPages = Math.ceil(data.totalResults / 2);
            setHasMore(page < totalPages);
            setOwner(data.restaurantSender_id);
        } catch (error) {
            console.error('Error fetching restaurant menus:', error);
            setHasMore(false); // Stop loading more data on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurantMenus();
    }, [page]);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const innerHeight = window.innerHeight;

        if (innerHeight + scrollTop >= scrollHeight - 500 && !loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);
    // ----------------- for menus=----end

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            setPageMenu(1);
            setHasMoreMenu(true);  // Reset to allow more data to load
            fetchRestaurantsMenu(1, true);  // Fetch the first page of search results
        } else {
            setSearchResults([]);
            setHasMoreMenu(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (pageMenu > 1 && !loadingMenu) {
            fetchRestaurantsMenu(pageMenu, false);  // Fetch subsequent pages
        }
    }, [pageMenu]);

    const fetchRestaurantsMenu = async (page, reset = false) => {
        setLoadingMenu(true);

        try {
            const response = await fetch(`${apiUrlProcess}/api/searchdishes?q=${searchTerm}&pageMenu=${page}&restaurantId=${restaurantId}`);
            const data = await response.json();

            if (reset) {
                setSearchResults(data.menuItems);  // Reset results on new search
            } else {
                setSearchResults(prevResults => [...prevResults, ...data.menuItems]);  // Append new results on scroll
            }

            const totalPages = Math.ceil(data.totalResults / 2);
            setHasMoreMenu(page < totalPages);
            setOwnerSearch(data.restaurantSender_id)

        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setHasMoreMenu(false);  // Stop loading more data on error
        } finally {
            setLoadingMenu(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        // Reset pagination and allow data loading
    };

    const handleScrollMenu = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const innerHeight = window.innerHeight;

        if (innerHeight + scrollTop >= scrollHeight - 500 && !loadingMenu && hasMoreMenu) {
            setPageMenu(prevPage => prevPage + 1);  // Increment pageMenu to fetch the next page
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScrollMenu);
        return () => window.removeEventListener('scroll', handleScrollMenu);
    }, [loadingMenu, hasMoreMenu]);

    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const toRadians = (degrees) => degrees * (Math.PI / 180);
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
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
    const cutText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    if (loadingfirst) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <LoadingShow stroke="#a1a0f9" width="25px" height="25px" />
            <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}>Restaurant Loading...</p>
        </div>;
    }

    return (
        <div className="restaurant-menu-container">
            <h2 style={{ color: restTime ? 'gray' : '' }}>{restaurantData.RestaurantName}
                {restTime ? <span style={{ fontSize: '10px', color: 'gray' }}>(Closed) </span> : <span style={{ fontSize: '10px', color: 'green' }}>(open)</span>}
            </h2>
            <div className="restaurant-details-bg">
                {restTime ? <span style={{ fontSize: '14px', color: 'red' }}><h5>Uh-oh! Outlet is not accepting orders at the moment. They should be back by {formatTimeTo12Hour(restaurantData.Availabitity[0].OpningTime)} tomorrow</h5> </span> : ''}

                <div className="restaurant-details">
                    <p> <span><FontAwesomeIcon icon={faStar} /></span> Rating: (
                        {(restaurantData.Ratings[0].Rating).toFixed(1)} ⭐ reating
                        {restaurantData.Ratings[0].RatingCount < 1000 ? (
                            ` ${restaurantData.Ratings[0].RatingCount}`
                        ) : restaurantData.Ratings[0].RatingCount >= 1000 && restaurantData.Ratings[0].RatingCount < 1000000 ? (
                            ` ${(restaurantData.Ratings[0].RatingCount / 1000).toFixed(1)}k`
                        ) : (
                            ` ${(restaurantData.Ratings[0].RatingCount / 1000000).toFixed(1)}m`
                        )} )</p>
                    <p> <span><FontAwesomeIcon icon={faLocationDot} /></span> {restaurantData.RestaurantLocation[0]?.area}, {restaurantData.RestaurantLocation[0]?.district}</p>
                    <div className="vertical-line"></div>
                    <p className='restaurant-details-p2'><FontAwesomeIcon className='restaurant-details-p2-icon' icon={faCircle} /> Timing: {formatTimeTo12Hour(restaurantData.Availabitity[0].OpningTime)} to {formatTimeTo12Hour(restaurantData.Availabitity[0].ClosingTime)}</p>
                    <p> <span><FontAwesomeIcon icon={faBicycle} /></span> {distance ? distance : '3.7'} kms | ₹{calculateDeliveryFee(distance)} Delivery fee will apply</p>
                    {user && user?.restaurant === '1' && (user?._id === OwnerSearch || user?._id === Owner) && (
                        <div className="update-Restaurent-details">
                            <button onClick={handleUpdateClick}>Update Profile</button>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="Deals-for-you">Deals for you</h3>
            <div className="deals-by-restaurent">
                {restaurantData && restaurantData.DealsByRestaurant.map(menuItem => (
                    <div className="menu-items" key={menuItem.MenuId}>
                        <div className="menu-item">
                            <div className="menuitem-name">
                                <h3><button className="icon-container"><FontAwesomeIcon icon={faCircle} className={`${menuItem.IsVeg === 'true' ? 'IsVeg' : 'not-IsVeg'} dot-icon`} /></button>{menuItem.IsVeg === 'true' ? 'Veg' : 'Non-Veg'}</h3>
                                <h3 className='menuItem-ItemName'>{menuItem.ItemName}</h3>
                                <p className='menuitem-price'>₹{menuItem.Price}</p>
                                <p className='menuitem-discount'>{menuItem.discount}</p>
                                <p className='menuitem-description'>{menuItem.description}</p>
                                {user?.restaurant === '1' && (user?._id === OwnerSearch || user?._id === Owner) && (
                                    <div className="update-Restaurent-details">
                                        <button onClick={() => handleUpdateClickDeal(menuItem)}>Update</button>
                                    </div>
                                )}
                            </div>
                            <div className="imgAnd-button">
                                <div className='LazyLoadImage-img'>
                                    <LazyLoadImage
                                        className={`${restTime ? 'Rest-closed' : ''}`} alt={menuItem.ItemName}
                                        effect="blur"
                                        wrapperProps={{
                                            style: { transitionDelay: "1s" },
                                        }}
                                        src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${menuItem.image}.jpg`} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {restaurantData.DealsByRestaurant.length === 0 ? <p>No Deals found for this Restaurant.</p> : ''}
            </div>
            <div className="search-menu-items" style={{ marginTop: '20px' }}>
                <div className="search-bar">
                    <input
                        type="search"
                        name="search"
                        className="search-input"
                        placeholder={`Search ${restaurantData.RestaurantName}'s dishes...`}
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="search-menuitems-show" style={{ minHeight: '500px' }}>
                {user?.restaurant === '1' && (user?._id === OwnerSearch || user?._id === Owner) && (
                    <h3><Link to='/RestaurantMenuForm' className='Add-menus'>ADD Menu</Link></h3>
                )}


                {searchTerm.trim() !== '' ? (
                    <div>
                        {searchResults.length > 0 ? (
                            <>
                                {searchResults.map((menuItem) => (
                                    <div className="menu-items" key={menuItem.MenuId}>
                                        <div className="menu-item">
                                            <div className="menuitem-name">
                                                <h3>
                                                    <button className="icon-container">
                                                        <FontAwesomeIcon icon={faCircle} className={`${menuItem.IsVeg === 'true' ? 'IsVeg' : 'not-IsVeg'} dot-icon`} />
                                                    </button>
                                                    {menuItem.IsVeg === 'true' ? 'Veg' : 'Non-Veg'}
                                                </h3>
                                                <h3 className='menuItem-ItemName'>{cutText(menuItem.ItemName, 80)}</h3>
                                                <div style={{ display: 'flex' }}>
                                                    <p style={{ paddingRight: '10px', textDecoration: 'line-through' }} className='menuitem-price'>₹{menuItem.discount}</p>
                                                    <p className='menuitem-price'>₹{menuItem.Price}</p>
                                                </div>
                                                <p className='menuitem-rating'>
                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                    <span>{(menuItem.Ratings[0].Rating).toFixed(1)}</span>
                                                    <span>
                                                        {menuItem.Ratings[0].RatingCount < 1000 ? (
                                                            `(${menuItem.Ratings[0].RatingCount})`
                                                        ) : menuItem.Ratings[0].RatingCount >= 1000 && menuItem.Ratings[0].RatingCount < 1000000 ? (
                                                            `(${(menuItem.Ratings[0].RatingCount / 1000).toFixed(1)}k)`
                                                        ) : (
                                                            `(${(menuItem.Ratings[0].RatingCount / 1000000).toFixed(1)}m)`
                                                        )}
                                                    </span>
                                                </p>
                                                <p className='menuitem-description'>{cutText(menuItem.description, 300)}</p>
                                                <div className="update-Restaurent-details-comment-button">
                                                    {/* --------------------------- */}
                                                    {/* Comment button and conditional rendering of Comments */}
                                                    <CommentsLike MenuId={menuItem.MenuId} userEmail={user.email} />
                                                    {/* --------------------------- */}
                                                    {user?.restaurant === '1' && user?._id === OwnerSearch && (
                                                        <div className="update-Restaurent-details">
                                                            <button onClick={() => handleUpdateClickMenu(menuItem)}>Update</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="imgAnd-button">
                                                <div className='LazyLoadImage-img'>
                                                    <LazyLoadImage
                                                        className={`${restTime ? 'Rest-closed' : ''}`} src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${menuItem.image}.jpg`} alt={menuItem.ItemName}
                                                        effect="blur"
                                                        wrapperProps={{
                                                            style: { transitionDelay: "1s" },
                                                        }} />
                                                </div>
                                                <div className="All-button">
                                                    <button onClick={() => QuantityChange(menuItem.MenuId, -1)}>-</button>
                                                    <p className='Quantity-Change-value'>{getInitialQuantity(menuItem.MenuId)}</p>
                                                    <button onClick={() => AddQuantity(menuItem, restaurantData)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {loadingMenu && <Loading />}
                                {!loadingMenu && !hasMoreMenu && searchResults.length > 0 && (
                                    <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>No More Data</p>
                                )}
                            </>
                        ) : (
                            <>
                                {loadingMenu ? <Loading /> : <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>No matching data found.</p>}
                            </>
                        )}
                    </div>
                ) : (
                    restaurantDataMenu && restaurantDataMenu.length > 0 ? (
                        <>
                            {restaurantDataMenu.map(menuItem => (
                                <div className="menu-items" key={menuItem.MenuId}>
                                    <div className="menu-item">
                                        <div className="menuitem-name">
                                            <h3>
                                                <button className="icon-container">
                                                    <FontAwesomeIcon icon={faCircle} className={`${menuItem.IsVeg === 'true' ? 'IsVeg' : 'not-IsVeg'} dot-icon`} />
                                                </button>
                                                {menuItem.IsVeg === 'true' ? 'Veg' : 'Non-Veg'}
                                            </h3>
                                            <h3 className='menuItem-ItemName'>{cutText(menuItem.ItemName, 80)}</h3>
                                            <div style={{ display: 'flex' }}>
                                                <p style={{ paddingRight: '10px', textDecoration: 'line-through' }} className='menuitem-price'>₹{menuItem.discount}</p>
                                                <p className='menuitem-price'>₹{menuItem.Price}</p>
                                            </div>
                                            <p className='menuitem-rating'>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span>{(menuItem.Ratings[0].Rating).toFixed(1)}</span>
                                                <span>
                                                    {menuItem.Ratings[0].RatingCount < 1000 ? (
                                                        `(${menuItem.Ratings[0].RatingCount})`
                                                    ) : menuItem.Ratings[0].RatingCount >= 1000 && menuItem.Ratings[0].RatingCount < 1000000 ? (
                                                        `(${(menuItem.Ratings[0].RatingCount / 1000).toFixed(1)}k)`
                                                    ) : (
                                                        `(${(menuItem.Ratings[0].RatingCount / 1000000).toFixed(1)}m)`
                                                    )}
                                                </span>
                                            </p>
                                            <p className='menuitem-description'>{cutText(menuItem.description, 300)}</p>
                                            <div className="update-Restaurent-details-comment-button">
                                                {/* --------------------------- */}
                                                {/* Comment button and conditional rendering of Comments */}
                                                <CommentsLike MenuId={menuItem.MenuId} userEmail={user?.email} />
                                                {/* --------------------------- */}
                                                {user?.restaurant === '1' && user?._id === Owner && (
                                                    <div style={{ marginLeft: '10px' }} className="update-Restaurent-details">
                                                        <button onClick={() => handleUpdateClickMenu(menuItem)}>Update</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="imgAnd-button">
                                            <div className='LazyLoadImage-img' >
                                                <LazyLoadImage
                                                    className={`${restTime ? 'Rest-closed' : ''}`} src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${menuItem.image}.jpg`} alt={menuItem.ItemName}
                                                    effect="blur"
                                                    wrapperProps={{
                                                        style: { transitionDelay: "1s" },
                                                    }} />
                                            </div>
                                            <div className="All-button">
                                                <button onClick={() => QuantityChange(menuItem.MenuId, -1)}>-</button>
                                                <p className='Quantity-Change-value'>{getInitialQuantity(menuItem.MenuId)}</p>
                                                <button onClick={() => AddQuantity(menuItem, restaurantData)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && <Loading />}
                            {!loading && !hasMore && restaurantDataMenu.length > 0 && (
                                <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>No More Data</p>
                            )}
                        </>
                    ) : (
                        <>
                            {loading ? <Loading /> : <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>No menu data available.</p>}
                        </>
                    )
                )}
            </div>

            {!restaurantData && <div>No data found for this restaurant.</div>}
            {Error && <div>{Error}</div>}

            {showModalDeal && selectedDealItem && user?.restaurant === '1' && (
                <div className="modal-overlay" onClick={handleClickOutside}>
                    <div className="modal-content" style={{height:'90%'}} onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>X</button>
                        <RestaurantMenuForm
                            UpdateDeal={selectedDealItem}
                            MyRestaurantId={restaurantId || ''}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}

            {showModalMenu && selectedMenuItem && user?.restaurant === '1' && (
                <div className="modal-overlay" onClick={handleClickOutside}>
                    <div className="modal-content" style={{height:'90%'}} onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>X</button>
                        <RestaurantMenuForm
                            UpdateMenu={selectedMenuItem}
                            MyRestaurantId={restaurantId || ''}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}

            {showModal && user?.restaurant === '1' && (
                <div className="modal-overlay" onClick={handleClickOutside}>
                    <div className="modal-content" style={{height:'90%'}} onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>X</button>
                        <RestaurantForm restaurantDataUpdate={IsRestaurantUpdate ? restaurantData : ''} onClose={closeModal} />
                    </div>
                </div>
            )}

            {showModalOtherRestaurant && (
                <div className="status-update-modal" style={{ zIndex: '1002' }}>
                    <div className="status-update-modal-content" style={{ maxWidth: '450px', fontSize: '17px' }}>
                        <h3 style={{ color: '#555', paddingBottom: '5px' }}>Start over by clearing the cart.</h3>
                        <p style={{ color: '#666', paddingBottom: '5px' }}>Are you sure you want to clear the <strong>{cartItems[0]?.RestaurantName}?</strong> </p>
                        <div className="status-update-btn">
                            <button onClick={() => setshowModalOtherRestaurant(false)}>Cancel</button>
                            <button onClick={() => { dispatch(clearCart()); setshowModalOtherRestaurant(false); }}>OK</button>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default RestaurantMenu;
