import React, { useState, useEffect } from 'react';
import LoadingP from '../Loading/LoadingP';
import { useNavigate, NavLink } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Search() {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            setPage(1); // Reset page to 1 when search term changes
            fetchRestaurants();
        } else {
            setSearchResults([]); // Clear results if the search term is empty
            setHasMore(false); // Prevent further data loading
        }
    }, [searchTerm]);

    useEffect(() => {
        if (page > 1) {
            fetchRestaurants();
        }
    }, [page]);

    const fetchRestaurants = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${apiUrlProcess}/api/restaurants?q=${searchTerm}&page=${page}`);
            const data = await response.json();

            if (page === 1) {
                setSearchResults(data.restaurants);
            } else {
                setSearchResults(prevResults => [...prevResults, ...data.restaurants]);
            }

            const totalPages = Math.ceil(data.totalResults / 3);
            setHasMore(page < totalPages);

        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setHasMore(false); // Stop loading more data on error
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setHasMore(true); // Allow further data loading
    };

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const innerHeight = window.innerHeight;

        if (innerHeight + scrollTop >= scrollHeight - 400 && !loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div className="search-container">
            <div className="search-bar">
                <input
                    type="search"
                    name="search"
                    className="search-input"
                    placeholder="Search for restaurants or dishes..."
                    value={searchTerm}
                    onChange={handleInputChange}
                />
            </div>
            <div className="search-data">
                {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div key={index + 10}>
                            {result.RestaurantMenu.map(menuItem => (
                                <NavLink to={`/restaurant/${result.RestaurantId}`} className='RestaurentData' key={menuItem.MenuId}>
                                    <div className="MenuItems">
                                        <div style={{ width: '80px', height: '80px', borderRadius: '5px', backgroundColor: '#c1affb' }}>
                                            <LazyLoadImage
                                                className='MenuItems-image' src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${menuItem.image}.jpg`} alt="item image"
                                                effect="opacity"
                                                wrapperProps={{
                                                    style: { transitionDelay: "1s" },
                                                }}
                                            />
                                        </div>
                                        <div className='Restaurant-Name-image-ItemName'>
                                            <span>{menuItem.ItemName}</span>
                                            <br />
                                            <div className='Restaurant-Name-image'>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c1affb' }}>
                                                    <LazyLoadImage
                                                        className='Restaurant-Image' src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${result.RestaurantImgage}.jpg`} alt="Restaurant image"
                                                        effect="opacity"
                                                        wrapperProps={{
                                                            style: { transitionDelay: "1s" },
                                                        }}
                                                    />
                                                </div>
                                                <h5 className='Restaurant-Name'>{result.RestaurantName} - {result.RestaurantLocation[0]?.area}, {result.RestaurantLocation[0]?.district}, {result.RestaurantLocation[0]?.state}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    ))
                ) : (
                    !loading && (
                        <div>
                            {searchTerm == '' ? <p>Search for restaurants or dishes...</p> :
                                <p>No match found for "{searchTerm}"</p>}
                        </div>
                    )
                )}
                {loading && <LoadingP />}
                {!loading && !hasMore && searchResults.length > 0 && (
                    <p style={{ color: '#ccc', fontSize: '20px', textAlign: 'center', marginTop: '40px' }}>No More Data</p>
                )}
            </div>
        </div>
    );
}

export default Search;
