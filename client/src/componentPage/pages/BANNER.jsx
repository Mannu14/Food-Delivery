import { LazyLoadImage } from 'react-lazy-load-image-component';
function BANNER() {
  return (
    <div className="banner">

      <div className="container">

        <div className="slider-container has-scrollbar">

          <div className="slider-item">
            <div style={{ width: '100%', height: '100%', borderRadius: '5px', backgroundColor: '#eee' }}>
              <LazyLoadImage
                src="/assets/images/products/1.jpg" alt="delicious dish" className="banner-img"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />
            </div>

            <div className="banner-content">

              <p className="banner-subtitle">Popular Dish</p>

              <h2 className="banner-title">Delicious Meal</h2>

              <p className="banner-text">
                starting at &dollar; <b>20</b>.00
              </p>

              <a href="#" className="banner-btn">Order now</a>

            </div>

          </div>

          <div className="slider-item">
            <div style={{ width: '100%', height: '100%', borderRadius: '5px', backgroundColor: '#eee' }}>
              <LazyLoadImage
                src="/assets/images/products/chad-montano-MqT0asuoIcU-unsplash.jpg" alt="tasty meal" className="banner-img"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />
            </div>

            <div className="banner-content">

              <p className="banner-subtitle">Trending Meal</p>

              <h2 className="banner-title">Tasty Dish</h2>

              <p className="banner-text">
                starting at &dollar; <b>15</b>.00
              </p>

              <a href="#" className="banner-btn">Order now</a>

            </div>

          </div>

          <div className="slider-item">
            <div style={{ width: '100%', height: '100%', borderRadius: '5px', backgroundColor: '#eee' }}>
              <LazyLoadImage
                src="/assets/images/products/eiliv-aceron-ZuIDLSz3XLg-unsplash.jpg" alt="fresh dish" className="banner-img"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />
            </div>

            <div className="banner-content">

              <p className="banner-subtitle">Sale Offer</p>

              <h2 className="banner-title">Fresh Dishes</h2>

              <p className="banner-text">
                starting at &dollar; <b>29</b>.99
              </p>

              <a href="#" className="banner-btn">Order now</a>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BANNER;
