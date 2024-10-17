import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Cart from '../component/pages/Cart';
import { NavLink, useLocation } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Notifications from "../Profile/Notifications";

function Header() {
    const [isCartVisible, setIsCartVisible] = useState(false);
    const cartItems = useSelector((state) => state.cartreduser.carts);
    const location = useLocation();
    const isSearchPage = location.pathname === '/Main' | '/main';

    const toggleCartVisibility = () => {
        setIsCartVisible(prevState => !prevState);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.value, 0);
    const IsNotifications = location.pathname === '/Notifications' | '/notifications';

    useEffect(() => {
        window.onscroll = function () {
            fixHeader();
        };

        function fixHeader() {
            const header = document.querySelector('.header-main');
            if (header) {
                const sticky = header.offsetTop;

                if (window.pageYOffset > sticky) {
                    header.style.position = 'fixed';
                    header.style.top = '0';
                } else {
                    header.style.position = 'relative';
                }
            }
        }

        return () => {
            window.onscroll = null; // Clean up scroll event listener
        };
    }, []);

    return (
        <header>
            <div className="header-top">
                <div className="container">
                    <ul className="header-social-container">
                        <li><a href="#" className="social-link"><ion-icon name="logo-facebook"></ion-icon></a></li>
                        <li><a href="#" className="social-link"><ion-icon name="logo-twitter"></ion-icon></a></li>
                        <li><a href="#" className="social-link"><ion-icon name="logo-instagram"></ion-icon></a></li>
                        <li><a href="#" className="social-link"><ion-icon name="logo-linkedin"></ion-icon></a></li>
                    </ul>
                    <div className="header-alert-news">
                        <p><b>Free Delivery</b>This Week on Orders Over - ₹600</p>
                    </div>
                    <div className="header-top-actions">
                        <select name="currency">
                            <option value="usd">USD &dollar;</option>
                            <option value="eur">EUR &euro;</option>
                        </select>
                        <select name="language">
                            <option value="en-US">English</option>
                            <option value="es-ES">Español</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="header-main">
                <div className="container">
                    <a href="/Main" className="header-logo">
                        <div style={{ width: '220px', height: '40px', backgroundColor: '#e8e8e8', borderRadius: '10px' }}>
                            <LazyLoadImage
                                src="/assets/images/logo/Mkcoding_Logo1.jpeg" alt="Food Delivery logo"
                                effect="opacity"
                                wrapperProps={{
                                    style: { transitionDelay: "1s" },
                                }}
                                style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
                            />
                        </div>
                    </a>
                    <div className="header-search-container">
                        <NavLink className={({ isActive }) =>
                            isActive ? 'search-btn-Link active' : 'search-btn-Link'
                        } to='Search'> <ion-icon name="search-outline"></ion-icon>Search </NavLink>
                    </div>
                    <div className="header-user-actions">
                        <NavLink to='/UserProfile' className="action-btn"><ion-icon name="person-outline"></ion-icon></NavLink>
                        <div className="action-btn">
                            {/* _________________________________ */}
                            {IsNotifications ?
                                <>
                                    <ion-icon name="heart-outline"></ion-icon><span className="count">0</span>
                                </>
                                : <Notifications />}
                            {/* _________________________________ */}
                        </div>
                        <button className="action-btn"><ion-icon name="bag-handle-outline" onClick={toggleCartVisibility}></ion-icon><span className="count">{totalItems}</span></button>
                    </div>
                </div>
            </div>
            <Cart isVisible={isCartVisible} onToggleCart={toggleCartVisibility} />

            {isSearchPage ?
                <nav className="desktop-navigation-menu">
                    <div className="container">
                        <ul className="desktop-menu-category-list">
                            <li className="menu-category"><a href="#" className="menu-title">Home</a></li>
                            <li className="menu-category">
                                <a href="#" className="menu-title">Categories</a>
                                <div className="dropdown-panel">
                                    <ul className="dropdown-panel-list">
                                        <li className="menu-title"><a href="#">Appetizers</a></li>
                                        <li className="panel-list-item"><a href="#">Salads</a></li>
                                        <li className="panel-list-item"><a href="#">Soups</a></li>
                                        <li className="panel-list-item"><a href="#">Main Courses</a></li>
                                        <li className="panel-list-item"><a href="#">Desserts</a></li>
                                        <li className="panel-list-item"><a href="#">
                                            <div style={{ width: '250px', height: '119px', backgroundColor: '#e8e8e8' }}>
                                                <LazyLoadImage src="/assets/images/pexels-narda-yescas-724842-1566837.jpg" alt="Food Collection"
                                                    effect="opacity"
                                                    wrapperProps={{
                                                        style: { transitionDelay: "1s" },
                                                    }}
                                                    style={{ width: '250px', height: '119px', backgroundColor: '#fff' }}
                                                />
                                            </div>
                                        </a></li>
                                    </ul>
                                    <ul className="dropdown-panel-list">
                                        <li className="menu-title"><a href="#">Beverages</a></li>
                                        <li className="panel-list-item"><a href="#">Soft Drinks</a></li>
                                        <li className="panel-list-item"><a href="#">Juices</a></li>
                                        <li className="panel-list-item"><a href="#">Smoothies</a></li>
                                        <li className="panel-list-item"><a href="#">Coffee</a></li>
                                        <li className="panel-list-item"><a href="#">
                                            <div style={{ width: '250px', height: '119px', backgroundColor: '#e8e8e8' }}>
                                                <LazyLoadImage src="/assets/images/pexels-quang-nguyen-vinh-222549-2175211.jpg" alt="Beverages Collection"
                                                    effect="opacity"
                                                    wrapperProps={{
                                                        style: { transitionDelay: "1s" },
                                                    }}
                                                    style={{ width: '250px', height: '119px', backgroundColor: '#fff' }}
                                                />
                                            </div>
                                            {/* <img style={{ width: "250px", height: "119px" }} /> */}
                                        </a></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="menu-category">
                                <a href="#" className="menu-title">Offers</a>
                                <ul className="dropdown-list">
                                    <li className="dropdown-item"><a href="#">Discounts</a></li>
                                    <li className="dropdown-item"><a href="#">Bundles</a></li>
                                    <li className="dropdown-item"><a href="#">Loyalty Program</a></li>
                                </ul>
                            </li>
                            <li className="menu-category"><a href="#" className="menu-title">About Us</a></li>
                            <li className="menu-category"><a href="#" className="menu-title">Contact</a></li>
                        </ul>
                    </div>
                </nav>
                : ''
            }
        </header>
    );
}

export default Header;