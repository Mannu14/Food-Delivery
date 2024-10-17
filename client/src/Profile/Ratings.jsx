import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Ratings.css'; // Import the CSS file for styling
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Ratings({ setShowRating, user, deliverBoy, order, source }) {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [deliveryBoyRating, setDeliveryBoyRating] = useState(0);
    const [restaurantRating, setRestaurantRating] = useState(0);
    const [comment, setComment] = useState('');
    const [itemRatings, setItemRatings] = useState([]);
    const [error, setError] = useState('');
    const textareaRef = useRef(null);
    const [loading, setLoading] = useState(false);


    const showDeliveryBoyForm =
        source === 'notification' && user?.restaurant === '1';
    const showRestaurantForm =
        source === 'notification' && deliverBoy == undefined && user?.deliveryBoy && user?.deliveryBoy[user?.deliveryBoy?.length - 1]?.admin === '1';
    const showBothForms = source === 'cart' && user?.restaurant != '1';

    // Initialize item ratings when order items change
    useEffect(() => {
        if (showBothForms && order?.items) {
            // Set initial ratings for each item in the order to 0
            const initialRatings = order.items.map(() => null);
            setItemRatings(initialRatings);
        }
    }, [showBothForms, order]);

    const adjustTextareaSize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.width = 'auto'; // Reset width
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on content
            textareaRef.current.style.width = `${textareaRef.current.scrollWidth}px`; // Adjust width based on content
        }
    };

    // Adjust textarea size initially and on content change
    useEffect(() => {
        adjustTextareaSize();
    }, [comment]);

    // Handles the submission of the form
    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            deliveryBoyRating: deliveryBoyRating || null,
            restaurantRating: restaurantRating || null,
            itemRatings: itemRatings.map((rating, index) => ({
                item_id: order.items[index].MenuId,
                rating,
            })),
            comment: comment || null,
            email: user.email || null,
            RestaurantId: order?.RestaurantId || null,
            order_id: order?.id || null,
            deliverBoy_Email: deliverBoy?.email || null,
        };

        try {
            const response = await fetch(`${apiUrlProcess}/submitRating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowRating(false); // Hide the form if submission is successful
                window.location.reload();
            } else {
                const { alertMsg } = await response.json();
                setError(alertMsg); // Show error if submission fails
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Renders the star rating component
    const renderStars = (rating, setRating) => {
        const stars = Array.from({ length: 10 }, (_, index) => {
            const value = (index + 1) * 0.5; // 0.5 increment ratings


            return (
                <span key={index} onClick={() => setRating(value)} className="star">
                    <FontAwesomeIcon
                        icon={faStar}
                        style={{ color: value <= rating ? '#FFD700' : '#ddd' }}
                    />
                </span>
            );
        });

        return (
            <div className="stars-container">
                {stars}
                <p>{getRatingDescription(rating)}</p>
            </div>
        );
    };

    // Helper function to get rating descriptions based on value
    const getRatingDescription = (value) => {
        switch (value) {
            case 0.5:
                return 'Bad';
            case 1:
                return 'Poor';
            case 1.5:
                return 'Below Average';
            case 2:
                return 'Fair';
            case 2.5:
                return 'Average';
            case 3:
                return 'Satisfactory';
            case 3.5:
                return 'Above Average';
            case 4:
                return 'Good';
            case 4.5:
                return 'Very Good';
            case 5:
                return 'Excellent';
            default:
                return '';
        }
    };

    // Handle item rating changes
    const handleItemRatingChange = (index, rating) => {
        const updatedRatings = [...itemRatings];
        updatedRatings[index] = rating;
        setItemRatings(updatedRatings);
    };


    return (
        <div className="status-update-modal" style={{ overflow: 'auto', flexWrap: 'wrap' }}>
            <div className="status-update-modal-content">
                <h3>Rate Your Experience</h3>
                {error === 'The order rating has been successfully submitted.' ?
                    <div style={{ color: 'green', marginBottom: '10px' }}>{error}</div> :
                    <div className="error-message">{error}</div>}

                {/* Delivery Boy Rating */}
                {(showDeliveryBoyForm || showBothForms) && (
                    <div className="rating-section">
                        <label>Rate Delivery Boy</label>
                        <div className='rating-section-div'>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                <LazyLoadImage src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${deliverBoy?.image}.jpg`} alt="Delivery Boy"
                                    effect="opacity"
                                    wrapperProps={{
                                        style: { transitionDelay: "1s" },
                                    }}
                                />
                            </div>
                            <p>{deliverBoy?.firstname} {deliverBoy?.lastname}</p>
                        </div>
                        {renderStars(deliveryBoyRating, setDeliveryBoyRating)}
                    </div>
                )}

                {/* Restaurant Rating */}
                {(showRestaurantForm || showBothForms) && (
                    <div className="rating-section">
                        <label>Rate Restaurant</label>
                        <div className='rating-section-div'>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                <LazyLoadImage src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${order?.RestaurantImgSrc}.jpg`} alt="Restaurant image"
                                    effect="opacity"
                                    wrapperProps={{
                                        style: { transitionDelay: "1s" },
                                    }}
                                />
                            </div>
                            <p>{order?.RestaurantName}-</p>
                            <p style={{ color: '#222' }}>{order?.id}</p>
                        </div>
                        {renderStars(restaurantRating, setRestaurantRating)}
                    </div>
                )}

                {/* Order Item Ratings */}
                {showBothForms && order?.items && (
                    <div className="order-items-rating-section">
                        <h4>Rate Order Items</h4>
                        {order.items.map((item, index) => (
                            <div key={index} className="rating-section">
                                <div className='rating-section-div'>
                                    <label>{item.itemName}</label>
                                </div>
                                {renderStars(itemRatings[index], (rating) =>
                                    handleItemRatingChange(index, rating)
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Comment Box */}
                <div className="comment-section">
                    <label>Leave a Comment</label>
                    <textarea
                        ref={textareaRef}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment here..."
                        rows={1}
                    ></textarea>
                </div>

                {/* Buttons for submission and cancellation */}
                <div className="button-group">
                    <button onClick={() => setShowRating(false)}>Cancel</button>
                    <button onClick={handleSubmit}>
                        {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><LoadingShow width="25px" height="25px" /> please wait...</div> : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Ratings;
