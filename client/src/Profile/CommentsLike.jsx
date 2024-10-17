import React, { useEffect, useState } from 'react';
import Comments from './Comments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import LoadingShow from '../Loading/Loading';

const apiUrlProcess_SOCKET = `${window.location.origin}`;
const socket = io(`${apiUrlProcess_SOCKET}`, {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const CommentsLike = ({ MenuId, userEmail }) => {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [commentsCount, setCommentsCount] = useState({});
    const [visibleMenuId, setVisibleMenuId] = useState(null);
    const [likesCount, setLikesCount] = useState({});
    const [likedMenus, setLikedMenus] = useState(new Set());
    const [errorMessages, setErrorMessages] = useState({});
    const [IsLoading, setIsLoading] = useState(true);

    // Fetch grouped comments count from the server
    const fetchCommentsCounts = async () => {
        try {
            const response = await fetch(`${apiUrlProcess}/api/comments/grouped-count`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch comments counts');
            }
            const data = await response.json();
            const counts = {};
            data?.forEach(({ _id, count }) => {
                counts[_id] = count;
            });
            setCommentsCount(counts);
        } catch (error) {
            console.error('Error fetching comments counts:', error);
        }
    };

    // Fetch likes count for each menu item when component mounts
    const fetchLikesCounts = async () => {
        try {
            const response = await fetch(`${apiUrlProcess}/api/menus/likes-count`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch likes counts');
            }
            const data = await response.json();
            setLikesCount(data);
        } catch (error) {
            console.error('Error fetching likes counts:', error);
        }
    };

    // Fetch the liked status of menus for the current user
    const fetchLikedMenus = async () => {
        try {
            const response = await fetch(`${apiUrlProcess}/api/user/liked-menus`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch liked menus');
            }
            const data = await response.json();
            setLikedMenus(new Set(data.likedMenuIds));
        } catch (error) {
            console.error('Error fetching liked menus:', error);
        }
    };

    useEffect(() => {
        // fetchCommentsCounts();
        // fetchLikesCounts();
        // fetchLikedMenus();
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchCommentsCounts(),
                    fetchLikesCounts(),
                    fetchLikedMenus(),
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Set loading to false after all fetches
            }
        };

        fetchData();
        // Listen for like response from the server
        socket.on('likeResponse', (response) => {
            if (response.success) {
                // Update liked menus and likes count based on user's like or unlike action
                if (response.action === 'like') {
                    setLikedMenus((prev) => new Set(prev.add(response.menuId)));
                    setLikesCount((prev) => ({
                        ...prev,
                        [response.menuId]: (prev[response.menuId] || 0) + 1,
                    }));
                } else if (response.action === 'dislike') {
                    setLikedMenus((prev) => {
                        const updatedSet = new Set(prev);
                        updatedSet.delete(response.menuId);
                        return updatedSet;
                    });
                    setLikesCount((prev) => ({
                        ...prev,
                        [response.menuId]: Math.max((prev[response.menuId] || 1) - 1, 0),
                    }));
                }
                setErrorMessages((prev) => ({ ...prev, [response.menuId]: '' })); // Clear error message for this menu
            } else {
                // Display the error message only for the specific MenuId
                setErrorMessages((prev) => ({ ...prev, [response.menuId]: response.error }));
            }
        });

        // Clean up the socket listener on component unmount
        return () => {
            socket.off('likeResponse');
        };
    }, [likedMenus]);

    // Handle like button click
    const handleLikeClick = (menuId) => {
        if (!userEmail) {
            setErrorMessages((prev) => ({
                ...prev,
                [menuId]: 'Please log in to like this item.',
            }));
            return;
        }
        const isLiked = likedMenus.has(menuId);
        socket.emit('StoreTheLikes', {
            email: userEmail,
            menuId,
            action: isLiked ? 'dislike' : 'like',
        });
    };

    const handleCommentClick = (menuId) => {
        setVisibleMenuId((prevMenuId) => (prevMenuId === menuId ? null : menuId));
    };

    // Handle closing comments for a specific menu item
    const handleCloseComments = () => {
        setVisibleMenuId(null);
    };

    // Format count numbers (e.g., 1000 -> 1k)
    const formatCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}m`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count;
    };
    const style = {
        color: '#ff0000',
        position: 'absolute',
        top: '-35px',
        left: '20px',
        fontSize: '12px',
        width: '200px',
        background: '#c1c3ff',
        padding: '5px 10px',
        borderRadius: '50px 50px 50px 0'
      };
    if (IsLoading) {
        return <LoadingShow width='25px' height='25px' />
    }

    return (
        <>
            <div className='like-button-div-error'>
                <FontAwesomeIcon
                    className={`like-button`}
                    icon={faHeart}
                    onClick={() => handleLikeClick(MenuId)}
                    style={{ color: likedMenus.has(MenuId) ? 'red' : '#555', }}
                    onMouseDown={(e) => {
                        let targetPath = e.target.tagName === 'svg' ? e.target.querySelector('path') : e.target;
                        if (targetPath.tagName === 'path') { targetPath.style.transition = 'transform 0.2s ease-in-out'; targetPath.style.transformOrigin = 'center'; targetPath.style.transform = 'scale(1.7)'; }
                    }}
                    onMouseUp={(e) => {
                        let targetPath = e.target.tagName === 'svg' ? e.target.querySelector('path') : e.target;
                        if (targetPath.tagName === 'path') { targetPath.style.transform = 'scale(1)'; }
                    }}
                />
                {formatCount(likesCount[MenuId] || 0)}
                {errorMessages[MenuId] && (
                    <div style={style}>
                        {errorMessages[MenuId]}
                    </div>
                )}
            </div>
            <FontAwesomeIcon
                className="comment-button"
                onClick={() => handleCommentClick(MenuId)}
                icon={faComment}
                style={{ cursor: 'pointer' }}
            />
            {formatCount(commentsCount[MenuId] || 0)}

            {visibleMenuId === MenuId && <Comments menuId={MenuId} onClose={handleCloseComments} />}
        </>
    );
};

export default CommentsLike;
