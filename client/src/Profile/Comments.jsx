import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Comments.css';
import Loading from '../Loading/LoadingP';

import { LazyLoadImage } from 'react-lazy-load-image-component';

const Comments = ({ email, menuId, onClose }) => {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [CommentsPage, setCommentsPage] = useState(0);
    const observer = useRef();
    const containerRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrlProcess}/api/comments?menuId=${menuId}&page=${page}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const totalPages = Math.ceil(data.TotalLength / 3);
            setCommentsPage(totalPages);

            if (data.data.length === 0) {
                setHasMore(false); // Set hasMore to false if no more comments
            } else {
                setComments((prevComments) => [...prevComments, ...data.data]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
        setLoading(false);
    }, [menuId, page]);

    // Fetch comments when component mounts or page changes
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Intersection Observer callback to detect when the last comment is visible
    const lastCommentRef = useCallback(
        (node) => {
            if (loading) return; // Do nothing if currently loading
            if (observer.current) observer.current.disconnect(); // Disconnect the previous observer
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    if (page <= CommentsPage && imagesLoaded !== 0 && imagesLoaded % 3 === 0) {
                        setPage((prevPage) => prevPage + 1); // Increment page number when the last comment is visible
                    }
                    else {
                        return;
                    }
                }
            });
            if (node) observer.current.observe(node); // Observe the last comment
        },
        [loading, hasMore, imagesLoaded]
    );

    const handleImageLoad = () => {
        setImagesLoaded((prev) => prev + 1);
    };

    // Function to format time ago for the comment
    const timeAgo = (timestamp) => {
        const timeDiff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        return `${days} days ago`;
    };

    // Handle click outside the comments container
    const handleClickOutside = useCallback(
        (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose(); // Call onClose if clicked outside the container
            }
        },
        [onClose]
    );

    // Add event listener for clicks outside the container
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="comments-container show" ref={containerRef}>
            <button className="close-button" onClick={onClose}>X</button>
            {comments && comments.map((comment, index) => (
                <div
                    className="comment"
                    key={index}
                    ref={index === comments.length - 1 ? lastCommentRef : null}
                >
                    {imagesLoaded < index ? (
                        <div className="image-placeholder"></div>
                    ) : (
                        <LazyLoadImage
                            alt={comment.firstname}
                            onLoad={handleImageLoad}
                            effect="blur"
                            className="comment-image"
                            wrapperProps={{
                                style: { transitionDelay: "1s" },
                            }}
                            src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${comment.image}.jpg`} />
                    )}

                    <div className="comment-content">
                        <div className="comment-header">
                            <span className="comment-username">{comment.firstname} {comment.lastname}</span>
                            <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="comment-text">{comment.Comment}</p>
                    </div>
                </div>
            ))}
            {loading && <Loading />}
            {!hasMore && !loading && <p className="no-more-comments">No more comments</p>}
        </div>
    );
};

export default Comments;
