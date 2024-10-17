import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function SERVICE() {
  return (
    <div>
      <div className="container">
        <div className="testimonials-box">
          {/* - TESTIMONIALS */}
          <div className="testimonial">
            <h2 className="title">Testimonial</h2>

            <div className="testimonial-card">
              <LazyLoadImage src="/assets/images/brooke-lark-1Rm9GLHV0UA-unsplash.jpg" alt="alan doe" className="testimonial-banner" width="80" height="80"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />

              <p className="testimonial-name">Alan Doe</p>

              <p className="testimonial-title">Food Blogger</p>
              <LazyLoadImage src="/assets/images/icons/quotes.svg" alt="quotation" className="quotation-img" width="26"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />

              <p className="testimonial-desc">
                The food quality is exceptional. Every dish tastes fresh and delicious!
              </p>
            </div>
          </div>

          {/* - CTA */}
          <div className="cta-container" style={{ height: '70%' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '5px', backgroundColor: '#eee' }}>
              <LazyLoadImage src="/assets/images/brooke-lark-1Rm9GLHV0UA-unsplash.jpg" alt="summer collection" className="cta-banner"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />
            </div>

            <a href="#" className="cta-content">
              <p className="discount">25% Discount</p>
              <h2 className="cta-title">Summer Dishes</h2>
              <p className="cta-text">Starting @ $10</p>
              <button className="cta-btn">Order Now</button>
            </a>
          </div>

          {/* - SERVICE */}
          <div className="service">
            <h2 className="title">Our Services</h2>

            <div className="service-container">
              <a href="#" className="service-item">
                <div className="service-icon">
                  <ion-icon name="bicycle-outline"></ion-icon>
                </div>

                <div className="service-content">
                  <h3 className="service-title">Fast Delivery</h3>
                  <p className="service-desc">Within 30 minutes</p>
                </div>
              </a>

              <a href="#" className="service-item">
                <div className="service-icon">
                  <ion-icon name="rocket-outline"></ion-icon>
                </div>

                <div className="service-content">
                  <h3 className="service-title">Next Day Delivery</h3>
                  <p className="service-desc">For Bulk Orders</p>
                </div>
              </a>

              <a href="#" className="service-item">
                <div className="service-icon">
                  <ion-icon name="call-outline"></ion-icon>
                </div>

                <div className="service-content">
                  <h3 className="service-title">24/7 Support</h3>
                  <p className="service-desc">We are here to help</p>
                </div>
              </a>

              <a href="#" className="service-item">
                <div className="service-icon">
                  <ion-icon name="arrow-undo-outline"></ion-icon>
                </div>

                <div className="service-content">
                  <h3 className="service-title">Easy Returns</h3>
                  <p className="service-desc">Within 24 hours</p>
                </div>
              </a>

              <a href="#" className="service-item">
                <div className="service-icon">
                  <ion-icon name="ticket-outline"></ion-icon>
                </div>

                <div className="service-content">
                  <h3 className="service-title">Exclusive Offers</h3>
                  <p className="service-desc">Sign up for deals</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SERVICE;
