import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Ratings.css';
import LoadingShow from '../Loading/Loading';

const CouponComponent = ({ setTrue, toggleCoupons, coupon,RestaurantId, applyCoupon, setCoupon, finalAmount }) => {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [loading, setLoading] = useState(false);

    const [loadingFor, setLoadingFor] = useState(true); // Start with loading state true
    const [RestaurantMenuForCart, setRestaurantMenuForCart] = useState([]);
    const [page, setPage] = useState(1);
    const [DealsPage, setDealsPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const fetchRestaurantMenuForCart = useCallback(async () => {
        setLoadingFor(true);
        try {
            const response = await fetch(`${apiUrlProcess}/CartCoupens?page=${page}&RestaurantId=${RestaurantId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const totalPages = Math.ceil(data.TotalLength / 2);
            setDealsPage(totalPages);

            if (data.data.length === 0) {
                setHasMore(false);
            } else {
                setRestaurantMenuForCart((prevComments) => [...prevComments, ...data.data]);
            }
        } catch (error) {
            console.error('Error fetching coupens:', error);
        }
        setLoadingFor(false);
    }, [RestaurantId, page]);

    useEffect(() => {
        fetchRestaurantMenuForCart();
    }, [fetchRestaurantMenuForCart]);

    const lastCommentRef = useCallback(
        (node) => {
            if (loadingFor) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    if (page <= DealsPage) {
                        setPage((prevPage) => prevPage + 1);
                    }
                    else {
                        return;
                    }
                }
            });
            if (node) observer.current.observe(node);
        },
        [loadingFor, hasMore]
    );

    const setCouponApplyOrNot = async (discount) => {
        setLoading(true);
        setCoupon(discount);
        setTrue(true);
        try {
            await applyCoupon(discount);
            setAppliedCoupon(discount);
        } finally {
            setLoading(false);
        }
    }

    const cutText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    useEffect(() => {
        if (coupon) {
            setAppliedCoupon(coupon);
        }
    }, [coupon]);

    const containerRef = useRef(null);

    const handleClickOutside = useCallback(
        (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                toggleCoupons(); // Call onClose if clicked outside the container
            }
        },
        [toggleCoupons]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="coupon-container" ref={containerRef}>
            {RestaurantMenuForCart.map((deal,index) => {
                const isCouponApplied = appliedCoupon === deal.discount;
                return (
                    <div key={deal._id} className="coupon-item"
                    ref={index === RestaurantMenuForCart.length - 1 ? lastCommentRef : null}
                    style={{
                        backgroundColor: isCouponApplied ? '#d4edda' : 'white',
                        opacity: finalAmount > parseInt(deal.Price) ? (isCouponApplied ? 1 : 0.8) : 0.5,
                        pointerEvents: isCouponApplied ? 'none' : (finalAmount > parseInt(deal.Price) ? 'auto' : 'none'),
                    }}>
                        <div className='coupon-item-block'>
                            <p>Price is greaterthen- ₹{deal.Price} {finalAmount < parseInt(deal.Price) ? <span style={{ paddingLeft: '10px', color: 'red' }}>This coupon is not applicable for this order</span> : ''}</p>
                            <div style={{ display: 'flex' }}>coupon- {deal.discount}
                                {isCouponApplied && (
                                    <p style={{ color: '#28a745', paddingLeft: '10px' }}>
                                        You have selected this coupon!
                                    </p>
                                )}
                            </div>
                            <p>{cutText(deal.description, 100)}</p>
                        </div>
                        <button className='coupon-item-btn' onClick={() => setCouponApplyOrNot(deal.discount)}
                            disabled={isCouponApplied || loading}
                            style={{
                                backgroundColor: isCouponApplied ? '#6c757d' : '#007bff',
                                color: isCouponApplied ? '#fff' : '#fff',
                            }}>
                            {loading && isCouponApplied ? 'Applying...' : isCouponApplied ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                )
            })}
            {loadingFor && <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><LoadingShow stroke={'#a49dc1'} width={'25px'} height={'25px'}/><p style={{ textAlign: 'center',paddingLeft:'20px' }}>coupons Loading...</p></div>}
            {!hasMore && !loadingFor && <p className="no-more-comments">No more coupons</p>}
        </div>
    );
};

export default CouponComponent;
