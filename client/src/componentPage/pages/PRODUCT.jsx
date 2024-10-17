import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ADD } from '../../component/redux/action/action';
import { useNavigate, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PRODUCT = () => {
  const [CartLength, setCartLength] = useState(0);

  const getData = useSelector((state) => state.cartreduser);
  const dispatch = useDispatch();
  const send = (e) => {
    const col4Div = e.target.closest('.showcase');
    if (col4Div) {
      const imgSrc = col4Div.querySelector('img').src;
      let titlecol4Div = col4Div.querySelector('.showcase-title');
      const totalPrice = col4Div.querySelector('.price').childNodes[0].textContent.trim();
      const priceSplit = totalPrice.split('₹')
      const price = priceSplit[priceSplit.length - 1]
      const ratingElements = col4Div.querySelectorAll('.reating i');
      const ratings = Array.from(ratingElements).map(icon => icon.className);

      const title = titlecol4Div.innerText
      const DataId = titlecol4Div.getAttribute('data-id');
      const value = 1;

      const productData = {
        DataId,
        imgSrc,
        title,
        price,
        ratings,
        value
      };
      dispatch(ADD(productData))
    }
  }


  useEffect(() => {
    // mobile menu variables
    const mobileMenuOpenBtns = document.querySelectorAll('[data-mobile-menu-open-btn]');
    const mobileMenus = document.querySelectorAll('[data-mobile-menu]');
    const mobileMenuCloseBtns = document.querySelectorAll('[data-mobile-menu-close-btn]');
    const overlay = document.querySelector('[data-overlay]');

    if (mobileMenuOpenBtns.length && mobileMenus.length && mobileMenuCloseBtns.length && overlay) {
      for (let i = 0; i < mobileMenuOpenBtns.length; i++) {

        // mobile menu function
        const mobileMenuCloseFunc = function () {
          mobileMenus[i].classList.remove('active');
          overlay.classList.remove('active');
        };

        mobileMenuOpenBtns[i].addEventListener('click', function () {
          mobileMenus[i].classList.add('active');
          overlay.classList.add('active');
        });

        mobileMenuCloseBtns[i].addEventListener('click', mobileMenuCloseFunc);
        overlay.addEventListener('click', mobileMenuCloseFunc);
      }
    }

    // accordion variables
    const accordionBtns = document.querySelectorAll('[data-accordion-btn]');
    const accordions = document.querySelectorAll('[data-accordion]');

    if (accordionBtns.length && accordions.length) {
      for (let i = 0; i < accordionBtns.length; i++) {

        accordionBtns[i].addEventListener('click', function () {

          const clickedBtn = this.nextElementSibling.classList.contains('active');

          for (let j = 0; j < accordions.length; j++) {

            if (clickedBtn) break;

            if (accordions[j].classList.contains('active')) {

              accordions[j].classList.remove('active');
              accordionBtns[j].classList.remove('active');
            }
          }

          this.nextElementSibling.classList.toggle('active');
          this.classList.toggle('active');
        });
      }
    }
  }, []);


  return (
    <>
      <div className="product-container">

        <div className="container">


          {/* - SIDEBAR */}

          <div className="sidebar has-scrollbar" data-mobile-menu>
            <div className="sidebar-category">
              <div className="sidebar-top">
                <h2 className="sidebar-title">Categories</h2>
                <button className="sidebar-close-btn" data-mobile-menu-close-btn>
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
              <ul className="sidebar-menu-category-list">
                <li className="sidebar-menu-category">
                  <button className="sidebar-accordion-menu" data-accordion-btn>
                    <div className="menu-title-flex">

                      <div style={{ width: "20px", height: "20px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/pexels-polina-tankilevitch-4109111.jpg" alt="Pizza" style={{ width: "20px", height: "20px" }} className="menu-title-img"
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <p className="menu-title">Pizza</p>
                    </div>
                    <div>
                      <ion-icon name="add-outline" className="add-icon"></ion-icon>
                      <ion-icon name="remove-outline" className="remove-icon"></ion-icon>
                    </div>
                  </button>
                  <ul className="sidebar-submenu-category-list" data-accordion>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Margherita</p>
                        <data value="45" className="stock" title="Available Stock">45</data>
                      </a>
                    </li>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Pepperoni</p>
                        <data value="30" className="stock" title="Available Stock">30</data>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="sidebar-menu-category">
                  <button className="sidebar-accordion-menu" data-accordion-btn>
                    <div className="menu-title-flex">
                    <div style={{ width: "20px", height: "20px" , borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-robinstickel-70497.jpg" alt="Burgers" style={{ width: "20px", height: "20px" }} className="menu-title-img" 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <p className="menu-title">Burgers</p>
                    </div>
                    <div>
                      <ion-icon name="add-outline" className="add-icon"></ion-icon>
                      <ion-icon name="remove-outline" className="remove-icon"></ion-icon>
                    </div>
                  </button>
                  <ul className="sidebar-submenu-category-list" data-accordion>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Cheeseburger</p>
                        <data value="25" className="stock" title="Available Stock">25</data>
                      </a>
                    </li>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Veggie Burger</p>
                        <data value="15" className="stock" title="Available Stock">15</data>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="sidebar-menu-category">
                  <button className="sidebar-accordion-menu" data-accordion-btn>
                    <div className="menu-title-flex">
                    <div style={{ width: "20px", height: "20px" , borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage src="/assets/images/pexels-zvolskiy-1721932.jpg" alt="Sushi" style={{ width: "20px", height: "20px" }} className="menu-title-img" 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <p className="menu-title">Sushi</p>
                    </div>
                    <div>
                      <ion-icon name="add-outline" className="add-icon"></ion-icon>
                      <ion-icon name="remove-outline" className="remove-icon"></ion-icon>
                    </div>
                  </button>
                  <ul className="sidebar-submenu-category-list" data-accordion>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">California Roll</p>
                        <data value="50" className="stock" title="Available Stock">50</data>
                      </a>
                    </li>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Spicy Tuna Roll</p>
                        <data value="20" className="stock" title="Available Stock">20</data>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="sidebar-menu-category">
                  <button className="sidebar-accordion-menu" data-accordion-btn>
                    <div className="menu-title-flex">
                    <div style={{width: "20px", height: "20px", borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage 
                        src="/assets/images/pexels-iina-luoto-460132-1211887.jpg" alt="Desserts" style={{ width: "20px", height: "20px" }} className="menu-title-img" 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <p className="menu-title">Desserts</p>
                    </div>
                    <div>
                      <ion-icon name="add-outline" className="add-icon"></ion-icon>
                      <ion-icon name="remove-outline" className="remove-icon"></ion-icon>
                    </div>
                  </button>
                  <ul className="sidebar-submenu-category-list" data-accordion>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Cheesecake</p>
                        <data value="40" className="stock" title="Available Stock">40</data>
                      </a>
                    </li>
                    <li className="sidebar-submenu-category">
                      <a href="#" className="sidebar-submenu-title">
                        <p className="product-name">Brownie</p>
                        <data value="35" className="stock" title="Available Stock">35</data>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="product-showcase">
              <h3 data-id='31' className="showcase-heading">Best Sellers</h3>
              <div className="showcase-wrapper">
                <div className="showcase-container">
                  <div className="showcase">
                    <a href="#" className="showcase-img-box">
                    <div style={{ width: "75px", height: "75px", borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage 
                        src="/assets/images/products/1.jpg" alt="Deluxe Pizza" style={{ width: "75px", height: "75px" }} className="showcase-img" 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                    </a>
                    <div className="showcase-content">
                      <a href="#">
                        <h4 data-id='1' className="showcase-title">Deluxe Pizza</h4>
                      </a>
                      <div className="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>
                      <div className="price-box">
                        <del>₹15.00</del>
                        <p className="price">₹12.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="showcase">
                    <a href="#" className="showcase-img-box">
                    <div style={{ width: "75px", height: "75px", borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage
                        src="/assets/images/products/pexels-robinstickel-70497.jpg" alt="Bacon Burger" style={{ width: "75px", height: "75px" }} className="showcase-img" 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                    </a>
                    <div className="showcase-content">
                      <a href="#">
                        <h4 data-id='2' className="showcase-title">Bacon Burger</h4>
                      </a>
                      <div className="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-half-outline"></ion-icon>
                      </div>
                      <div className="price-box">
                        <del>₹10.00</del>
                        <p className="price">₹7.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="showcase">
                    <a href="#" className="showcase-img-box">
                    <div style={{ width: "75px", height: "75px", borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage 
                        src="/assets/images/products/3.jpg" alt="Chocolate Brownie" style={{ width: "75px", height: "75px" }} className="showcase-img"
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                    </a>
                    <div className="showcase-content">
                      <a href="#">
                        <h4 data-id='3' className="showcase-title">Chocolate Brownie</h4>
                      </a>
                      <div className="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-half-outline"></ion-icon>
                      </div>
                      <div className="price-box">
                        <del>₹6.00</del>
                        <p className="price">₹4.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="showcase">
                    <a href="#" className="showcase-img-box">
                    <div style={{ width: "75px", height: "75px", borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage 
                        src="/assets/images/products/4.jpg" alt="California Roll" style={{ width: "75px", height: "75px" }} className="showcase-img"
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                    </a>
                    <div className="showcase-content">
                      <a href="#">
                        <h4 data-id='4' className="showcase-title">California Roll</h4>
                      </a>
                      <div className="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                      </div>
                      <div className="price-box">
                        <del>₹8.00</del>
                        <p className="price">₹6.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* header --- */}
          <div className="mobile-bottom-navigation">
            <button className="action-btn" data-mobile-menu-open-btn><ion-icon name="menu-outline"></ion-icon></button>
            <button className="action-btn"><ion-icon name="bag-handle-outline"></ion-icon><span className="count">0</span></button>
            <button className="action-btn"><ion-icon name="home-outline"></ion-icon></button>
            <button className="action-btn"><ion-icon name="heart-outline"></ion-icon><span className="count">0</span></button>
            <button className="action-btn" data-mobile-menu-open-btn><ion-icon name="grid-outline"></ion-icon></button>
          </div>
          <nav className="mobile-navigation-menu  has-scrollbar" data-mobile-menu>
            <div className="menu-top">
              <h2 className="menu-title">Menu</h2>
              <button className="menu-close-btn" data-mobile-menu-close-btn><ion-icon name="close-outline"></ion-icon></button>
            </div>
            <ul className="mobile-menu-category-list">
              <li className="menu-category"><a href="#" className="menu-title">Home</a></li>
              <li className="menu-category">
                <a href="#" className="menu-title">Categories</a>
                <ul className="dropdown-list">
                  <li className="dropdown-item"><a href="#">Appetizers</a></li>
                  <li className="dropdown-item"><a href="#">Salads</a></li>
                  <li className="dropdown-item"><a href="#">Soups</a></li>
                  <li className="dropdown-item"><a href="#">Main Courses</a></li>
                  <li className="dropdown-item"><a href="#">Desserts</a></li>
                </ul>
              </li>
              <li className="menu-category">
                <a href="#" className="menu-title">Offers</a>
                <ul className="dropdown-list">
                  <li className="dropdown-item"><a href="#">Discounts</a></li>
                  <li className="dropdown-item"><a href="#">Bundles</a></li>
                  <li className="dropdown-item"><a href="#">Loyalty Program</a> </li>
                </ul>
              </li>
              <li className="menu-category"><a href="#" className="menu-title">About Us</a></li>
              <li className="menu-category"><a href="#" className="menu-title">Contact</a></li>
            </ul>
          </nav>
          {/* header End --- */}



          <div className="product-box">

            {/* - PRODUCT MINIMAL */}

            <div className="product-minimal">

              <div className="product-showcase">

                <h2 className="title">New Arrivals</h2>

                <div className="showcase-wrapper has-scrollbar">

                  <div className="showcase-container">

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage
                        src="/assets/images/products/pexels-robinstickel-70497.jpg"
                          alt="classic burger" style={{ width: "70px" }} className="showcase-img" 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='5' className="showcase-title">Classic Burger</h4>
                        </a>

                        <a href="#" className="showcase-category">Burgers</a>

                        <div className="price-box">
                          <p className="price">₹10.00</p>
                          <del>₹15.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/clothes-2.jpg" alt="vegan salad"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='6' className="showcase-title">Vegan Salad</h4>
                        </a>

                        <a href="#" className="showcase-category">Salads</a>

                        <div className="price-box">
                          <p className="price">₹12.00</p>
                          <del>₹18.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage
                         src="/assets/images/products/pexels-enginakyurt-1527603.jpg" alt="spaghetti carbonara" className="showcase-img"
                          style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='7' className="showcase-title">Spaghetti Carbonara</h4>
                        </a>

                        <a href="#" className="showcase-category">Pasta</a>

                        <div className="price-box">
                          <p className="price">₹14.00</p>
                          <del>₹20.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-chevanon-302899.jpg" alt="Cold Coffee"
                          className="showcase-img" style={{ width: "70px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='8' className="showcase-title">Cold Coffee</h4>
                        </a>

                        <a href="#" className="showcase-category">Main Course</a>

                        <div className="price-box">
                          <p className="price">₹16.00</p>
                          <del>₹22.00</del>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="showcase-container">

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-elly-fairytale-3807397.jpg" alt="cheesecake"
                          className="showcase-img" style={{ width: "70px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='9' className="showcase-title">Cheesecake</h4>
                        </a>

                        <a href="#" className="showcase-category">Desserts</a>

                        <div className="price-box">
                          <p className="price">₹8.00</p>
                          <del>₹12.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-enginakyurt-1527603.jpg" alt="seafood paella"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='10' className="showcase-title">Seafood Paella</h4>
                        </a>

                        <a href="#" className="showcase-category">Seafood</a>

                        <div className="price-box">
                          <p className="price">₹22.00</p>
                          <del>₹30.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/pexels-polina-tankilevitch-4109111.jpg" alt="margherita pizza"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='11' className="showcase-title">Margherita Pizza</h4>
                        </a>

                        <a href="#" className="showcase-category">Pizzas</a>

                        <div className="price-box">
                          <p className="price">₹15.00</p>
                          <del>₹20.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-fotios-photos-1395958.jpg" alt="fruit smoothie"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='12' className="showcase-title">Fruit Smoothie</h4>
                        </a>

                        <a href="#" className="showcase-category">Beverages</a>

                        <div className="price-box">
                          <p className="price">₹5.00</p>
                          <del>₹8.00</del>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <div className="product-showcase">

                <h2 className="title">Trending</h2>

                <div className="showcase-wrapper  has-scrollbar">

                  <div className="showcase-container">

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-framed-by-rania-2454533.jpg" alt="gourmet burger"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='13' className="showcase-title">Gourmet Burger</h4>
                        </a>

                        <a href="#" className="showcase-category">Burgers</a>

                        <div className="price-box">
                          <p className="price">₹12.00</p>
                          <del>₹18.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-ivan-j-long-578165-1362044.jpg" alt="grilled steak"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='14' className="showcase-title">Grilled Steak</h4>
                        </a>

                        <a href="#" className="showcase-category">Main Course</a>

                        <div className="price-box">
                          <p className="price">₹20.00</p>
                          <del>₹28.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-janetrangdoan-1099680.jpg" alt="vegetable soup"
                          className="showcase-img" style={{ width: "70px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='15' className="showcase-title">Vegetable Soup</h4>
                        </a>

                        <a href="#" className="showcase-category">Soups</a>

                        <div className="price-box">
                          <p className="price">₹9.00</p>
                          <del>₹14.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/2.jpg" alt="chocolate lava cake"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='16' className="showcase-title">Chocolate Lava Cake</h4>
                        </a>

                        <a href="#" className="showcase-category">Desserts</a>

                        <div className="price-box">
                          <p className="price">₹7.00</p>
                          <del>₹11.00</del>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="showcase-container">

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/1.jpg" alt="avocado toast"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='17' className="showcase-title">Avocado Toast</h4>
                        </a>

                        <a href="#" className="showcase-category">Brunch</a>

                        <div className="price-box">
                          <p className="price">₹11.00</p>
                          <del>₹15.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/2.jpg" alt="tiramisu"
                          className="showcase-img" style={{ width: "70px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='18' className="showcase-title">Tiramisu</h4>
                        </a>

                        <a href="#" className="showcase-category">Desserts</a>

                        <div className="price-box">
                          <p className="price">₹9.00</p>
                          <del>₹13.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/3.jpg" alt="sushi platter"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='19' className="showcase-title">Sushi Platter</h4>
                        </a>

                        <a href="#" className="showcase-category">Sushi</a>

                        <div className="price-box">
                          <p className="price">₹25.00</p>
                          <del>₹35.00</del>
                        </div>

                      </div>

                    </div>

                    <div className="showcase">

                      <a href="#" className="showcase-img-box">
                      <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/4.jpg" alt="pancakes"
                          className="showcase-img" style={{ width: "70px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      </a>

                      <div className="showcase-content">

                        <a href="#">
                          <h4 data-id='20' className="showcase-title">Pancakes</h4>
                        </a>

                        <a href="#" className="showcase-category">Breakfast</a>

                        <div className="price-box">
                          <p className="price">₹6.00</p>
                          <del>₹9.00</del>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>




            {/* - PRODUCT FEATURED */}

            <div className="product-featured">

              <h2 className="title">Deal of the Day</h2>

              <div className="showcase-wrapper has-scrollbar">

                <div className="showcase-container">

                  <div className="showcase">

                    <div className="showcase-banner">
                    <div style={{ width: "300px",height:'199px', borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage
                         src="/assets/images/pexels-narda-yescas-724842-1566837.jpg" style={{ width: "300px" }} alt="Gourmet Pizza Special" className="showcase-img"  
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                    </div>

                    <div className="showcase-content">

                      <div className="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                      </div>

                      <a href="#">
                        <h3 data-id='32' className="showcase-title">Gourmet Pizza Special</h3>
                      </a>

                      <p className="showcase-desc">
                        Enjoy our special gourmet pizza with a blend of premium toppings and fresh ingredients. A perfect treat for any day.
                      </p>

                      <div className="price-box">
                        <p className="price">₹12.99</p>
                        <del>₹18.99</del>
                      </div>

                      <button className="add-cart-btn">Add to Cart</button>

                      <div className="showcase-status">
                        <div className="wrapper">
                          <p>
                            Already Sold: <b>50</b>
                          </p>

                          <p>
                            Available: <b>30</b>
                          </p>
                        </div>

                        <div className="showcase-status-bar"></div>
                      </div>

                      <div className="countdown-box">

                        <p className="countdown-desc">
                          Hurry Up! Offer ends in:
                        </p>

                        <div className="countdown">

                          <div className="countdown-content">

                            <p className="display-number">1</p>

                            <p className="display-text">Day</p>

                          </div>

                          <div className="countdown-content">
                            <p className="display-number">12</p>
                            <p className="display-text">Hours</p>
                          </div>

                          <div className="countdown-content">
                            <p className="display-number">45</p>
                            <p className="display-text">Min</p>
                          </div>

                          <div className="countdown-content">
                            <p className="display-number">20</p>
                            <p className="display-text">Sec</p>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="showcase-container">

                  <div className="showcase">

                    <div className="showcase-banner">
                    <div style={{ width: "70px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage
                         src="/assets/images/products/pexels-vince-2147491.jpg" style={{ width: "300px" }} alt="Premium Sushi Set" className="showcase-img"
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                    </div>

                    <div className="showcase-content">

                      <div className="showcase-rating">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                      </div>

                      <a href="#">
                        <h3 data-id='33' className="showcase-title">Premium Sushi Set</h3>
                      </a>

                      <p className="showcase-desc">
                        Savor our premium sushi set featuring a variety of fresh, delicious sushi rolls and sashimi.
                      </p>

                      <div className="price-box">
                        <p className="price">₹29.99</p>
                        <del>₹35.99</del>
                      </div>

                      <button className="add-cart-btn">Add to Cart</button>

                      <div className="showcase-status">
                        <div className="wrapper">
                          <p>
                            Already Sold: <b>25</b>
                          </p>

                          <p>
                            Available: <b>15</b>
                          </p>
                        </div>

                        <div className="showcase-status-bar"></div>
                      </div>

                      <div className="countdown-box">

                        <p className="countdown-desc">Hurry Up! Offer ends in:</p>

                        <div className="countdown">
                          <div className="countdown-content">
                            <p className="display-number">2</p>
                            <p className="display-text">Days</p>
                          </div>

                          <div className="countdown-content">
                            <p className="display-number">8</p>
                            <p className="display-text">Hours</p>
                          </div>

                          <div className="countdown-content">
                            <p className="display-number">30</p>
                            <p className="display-text">Min</p>
                          </div>

                          <div className="countdown-content">
                            <p className="display-number">10</p>
                            <p className="display-text">Sec</p>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>




            {/* - PRODUCT GRID */}

            <div className="product-main">

              <h2 className="title">New Products</h2>

              <div className="product-grid">

                <div className="showcase">

                  <div className="showcase-banner">
                  <div style={{ width: "300px", height: "250px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-xmtnguyen-699953.jpg" alt="Berry Greek Yogurt Parfait" style={{ width: "300px", height: "250px" }} className="product-img default"
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <div style={{ width: "0", height: "0", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-valeriya-1639557.jpg" alt="Berry Greek Yogurt Parfait" style={{ width: "300px", height: "250px" }} className="product-img hover" 
                         
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>

                    <p className="showcase-badge">15%</p>

                    <div className="showcase-actions">

                      <button className="btn-action">
                        <ion-icon name="heart-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="repeat-outline"></ion-icon>
                      </button>

                      <button className="btn-action" onClick={(e) => send(e)}>
                        <ion-icon name="bag-add-outline"></ion-icon>
                      </button>

                    </div>

                  </div>

                  <div className="showcase-content">

                    <a href="#" className="showcase-category">parfait</a>

                    <a href="#">
                      <h3 data-id='34' className="showcase-title">Berry Greek Yogurt Parfait</h3>
                    </a>

                    <div className="showcase-rating">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                    </div>

                    <div className="price-box">
                      <p className="price">₹8.00</p>
                      <del>₹10.00</del>
                    </div>

                  </div>

                </div>

                <div className="showcase">

                  <div className="showcase-banner">
                  <div style={{ width: "300px", height: "250px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-enginakyurt-1527603.jpg" alt="Creamy Garlic Shrimp Pasta" className="product-img default" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <div style={{ width: "0", height: "0", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-enginakyurt-1527603.jpg" alt="Creamy Garlic Shrimp Pasta" className="product-img hover" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>

                    <p className="showcase-badge angle black">sale</p>

                    <div className="showcase-actions">
                      <button className="btn-action">
                        <ion-icon name="heart-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="repeat-outline"></ion-icon>
                      </button>

                      <button className="btn-action" onClick={(e) => send(e)}>
                        <ion-icon name="bag-add-outline"></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="showcase-content">
                    <a href="#" className="showcase-category">pasta</a>

                    <h3 >
                      <a href="#" data-id='35' className="showcase-title">Creamy Garlic Shrimp Pasta</a>
                    </h3>

                    <div className="showcase-rating">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                    </div>

                    <div className="price-box">
                      <p className="price">₹12.00</p>
                      <del>₹15.00</del>
                    </div>

                  </div>

                </div>

                <div className="showcase">

                  <div className="showcase-banner">
                  <div style={{ width: "300px", height: "250px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/pexels-narda-yescas-724842-1566837.jpg" alt="Four Cheese Pizza" className="product-img default" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <div style={{ width: "0", height: "0", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/pexels-polina-tankilevitch-4109111.jpg" alt="Four Cheese Pizza" className="product-img hover" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>

                    <div className="showcase-actions">
                      <button className="btn-action">
                        <ion-icon name="heart-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="repeat-outline"></ion-icon>
                      </button>

                      <button className="btn-action" onClick={(e) => send(e)}>
                        <ion-icon name="bag-add-outline"></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="showcase-content">
                    <a href="#" className="showcase-category">pizza</a>

                    <h3 >
                      <a href="#" data-id='36' className="showcase-title">Four Cheese Pizza</a>
                    </h3>

                    <div className="showcase-rating">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                    </div>

                    <div className="price-box">
                      <p className="price">₹15.00</p>
                      <del>₹20.00</del>
                    </div>

                  </div>

                </div>

                <div className="showcase">

                  <div className="showcase-banner">
                  <div style={{ width: "300px", height: "250px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/clothes-3.jpg" alt="Mediterranean Quinoa Salad" className="product-img default" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <div style={{ width: "0", height: "0", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/clothes-2.jpg" alt="Mediterranean Quinoa Salad" className="product-img hover" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>

                    <p className="showcase-badge angle pink">new</p>

                    <div className="showcase-actions">
                      <button className="btn-action">
                        <ion-icon name="heart-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="repeat-outline"></ion-icon>
                      </button>

                      <button className="btn-action" onClick={(e) => send(e)}>
                        <ion-icon name="bag-add-outline"></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="showcase-content">
                    <a href="#" className="showcase-category">salad</a>

                    <h3 >
                      <a href="#" data-id='37' className="showcase-title">Mediterranean Quinoa Salad</a>
                    </h3>

                    <div className="showcase-rating">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                    </div>

                    <div className="price-box">
                      <p className="price">₹10.00</p>
                      <del>₹12.00</del>
                    </div>

                  </div>

                </div>

                <div className="showcase">

                  <div className="showcase-banner">
                  <div style={{ width: "300px", height: "250px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-ivan-j-long-578165-1362044.jpg" alt="Spicy BBQ Burger" className="product-img default" style={{ width: "300px", height: "250px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <div style={{ width: "0", height: "0", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/products/pexels-robinstickel-70497.jpg" alt="Spicy BBQ Burger" className="product-img hover" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>

                    <div className="showcase-actions">
                      <button className="btn-action">
                        <ion-icon name="heart-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="repeat-outline"></ion-icon>
                      </button>

                      <button className="btn-action" onClick={(e) => send(e)}>
                        <ion-icon name="bag-add-outline"></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="showcase-content">
                    <a href="#" className="showcase-category">burger</a>

                    <h3 >
                      <a href="#" data-id='38' className="showcase-title">Spicy BBQ Burger</a>
                    </h3>

                    <div className="showcase-rating">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                    </div>

                    <div className="price-box">
                      <p className="price">₹11.00</p>
                      <del>₹14.00</del>
                    </div>

                  </div>

                </div>

                <div className="showcase">

                  <div className="showcase-banner">
                  <div style={{ width: "300px", height: "250px", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/pexels-zvolskiy-1721932.jpg" alt="Vegan Smoothie Bowl" className="product-img default" style={{ width: "300px", height: "250px" }}
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>
                      <div style={{ width: "0", height: "0", borderRadius: '5px', backgroundColor: '#eee' }}>
                        <LazyLoadImage src="/assets/images/pexels-chanwalrus-958545 (1).jpg" alt="Vegan Smoothie Bowl" className="product-img hover" style={{ width: "300px", height: "250px" }} 
                          effect="opacity"
                          wrapperProps={{
                            style: { transitionDelay: "1s" },
                          }}
                        />
                      </div>

                    <p className="showcase-badge">10%</p>

                    <div className="showcase-actions">
                      <button className="btn-action">
                        <ion-icon name="heart-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="eye-outline"></ion-icon>
                      </button>

                      <button className="btn-action">
                        <ion-icon name="repeat-outline"></ion-icon>
                      </button>

                      <button className="btn-action" onClick={(e) => send(e)}>
                        <ion-icon name="bag-add-outline"></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="showcase-content">
                    <a href="#" className="showcase-category">smoothie</a>

                    <h3 >
                      <a href="#" data-id='39' className="showcase-title">Vegan Smoothie Bowl</a>
                    </h3>

                    <div className="showcase-rating">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star-outline"></ion-icon>
                    </div>

                    <div className="price-box">
                      <p className="price">₹9.00</p>
                      <del>₹10.00</del>
                    </div>

                  </div>

                </div>

              </div>

            </div>


          </div>

        </div>

      </div>
    </>
  );
}

export default PRODUCT;