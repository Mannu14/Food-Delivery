import { useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function NOTIFICATION() {

    useEffect(() => {
        // notification toast variables
        const notificationToast = document.querySelector('[data-toast]');
        const toastCloseBtn = document.querySelector('[data-toast-close]');

        // notification toast eventListener
        if (toastCloseBtn && notificationToast) {
            toastCloseBtn.addEventListener('click', function () {
                notificationToast.classList.add('closed');
            });
        }
    })

    return (
        <>
            <div className="notification-toast" data-toast>

                <button className="toast-close-btn" data-toast-close>
                    <ion-icon name="close-outline"></ion-icon>
                </button>

                <div className="toast-banner">
                    <div style={{ width: '80px', height: '70px', borderRadius: '5px', backgroundColor: '#c1affb' }}>
                        <LazyLoadImage
                            src="/assets/images/pexels-quang-nguyen-vinh-222549-2175211.jpg" alt="Rose Gold Earrings"
                            effect="opacity"
                            wrapperProps={{
                                style: { transitionDelay: "1s" },
                            }}
                            style={{ width: '80px', height: '70px', borderRadius: '5px', backgroundColor: '#fff' }}
                        />
                    </div>
                </div>

                <div className="toast-detail">

                    <p className="toast-message">
                        Someone in new just bought
                    </p>

                    <p className="toast-title">
                        Rose Gold Earrings
                    </p>

                    <p className="toast-meta">
                        <time dateTime="PT2M">2 Minutes</time> ago
                    </p>

                </div>

            </div>
        </>
    );
}

export default NOTIFICATION;