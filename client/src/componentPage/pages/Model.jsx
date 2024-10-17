import React, { useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Model() {

  useEffect(() => {
    // modal variables
    const modal = document.querySelector('[data-modal]');
    const modalCloseBtn = document.querySelector('[data-modal-close]');
    const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

    // modal function
    if (modal && modalCloseBtn && modalCloseOverlay) {
      const modalCloseFunc = function () { modal.classList.add('closed') }

      // modal eventListener
      modalCloseOverlay.addEventListener('click', modalCloseFunc);
      modalCloseBtn.addEventListener('click', modalCloseFunc);
    }
  }, [])

  return (
    <>
      <div className="overlay" data-overlay></div>

      <div className="modal" data-modal>

        <div className="modal-close-overlay" data-modal-overlay></div>

        <div className="modal-content" style={{height:''}}>

          <button className="modal-close-btn" data-modal-close>
            <ion-icon name="close-outline"></ion-icon>
          </button>

          <div className="newsletter-img">
            <div style={{ width: '400px', height: '400px', borderRadius: '5px', backgroundColor: '#c1affb' }}>
              <LazyLoadImage src="/assets/images/pexels-narda-yescas-724842-1566837.jpg" alt="subscribe newsletter" width="400" height="400"
                effect="opacity"
                wrapperProps={{
                  style: { transitionDelay: "1s" },
                }}
              />
            </div>
          </div>

          <div className="newsletter">

            <form action="#">

              <div className="newsletter-header">

                <h3 className="newsletter-title">Subscribe to our Food Newsletter</h3>

                <p className="newsletter-desc">
                  Subscribe to <b>Foodie's Paradise</b> to get the latest food updates and exclusive discounts.
                </p>

              </div>

              <input type="email" name="email" className="email-field" placeholder="Email Address" required />

              <button type="submit" className="btn-newsletter">Subscribe</button>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}

export default Model;
