import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./BestPlaces.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LoadingShow from "../../Loading/Loading";

const RestaurantCard = ({ name, address, rating, DealsByRestaurant, RestaurantImgage, RestaurantId }) => {
  const dealOptions = DealsByRestaurant
    ? [
      `${parseInt(DealsByRestaurant.discount.replace(/\D/g, ''), 10)}% OFF UPTO ₹${DealsByRestaurant.Price}`,
      `ITEMS AT ₹${DealsByRestaurant.Price}`
    ]
    : [];

  const randomDeal = dealOptions[Math.floor(Math.random() * dealOptions.length)];

  return (
    <Link to={`/restaurant/${RestaurantId}`} className="restaurant-link">
      <div className="restaurant-card">
        <div className="image-container">
          <div style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <LazyLoadImage
              src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${RestaurantImgage}.jpg`}
              alt={`Restaurant image of ${name}`}
              effect="opacity"
              wrapperProps={{
                style: { transitionDelay: "1s" },
              }}
            />
            {randomDeal && <p className="deal-overlay">{randomDeal}</p>}
          </div>
        </div>
        <div>
          <h2>{name}</h2>
          <p><span className="green-star">★</span> {rating.toFixed(1)}</p>
          <p>{address}</p>
        </div>
      </div>
    </Link>
  );
};

const RestaurantList = ({ city = "Default City",
  sort = [
    { title: "Rating: High to Low" },
    { title: "Rating: Low to High" },
    { title: "Price: High to Low" },
    { title: "Price: Low to High" }
  ] }) => {
    const apiUrlProcess = `${window.location.origin}/apis`;
  const [RestaurantCart, setRestaurantCart] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAveragePrice = (restaurant) => {
    if (restaurant.RestaurantMenu && restaurant.RestaurantMenu.length > 0) {
      const totalPrice = restaurant.RestaurantMenu.reduce((acc, item) => acc + parseFloat(item.Price), 0);
      return totalPrice / restaurant.RestaurantMenu.length;
    }
    return 0;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrlProcess}/api/HomeRestaurant`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          console.log("Error fetching data");
        }
        if (response.status === 401) {
          return;
        }
        const data = await response.json();
        setRestaurantCart(data.RestaurantMenuForCart);
        setSortedRestaurants(data.RestaurantMenuForCart);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSortClick = (sortType) => {
    if (activeFilter === sortType) {
      setSortedRestaurants(RestaurantCart);
      setActiveFilter(null);
    } else {
      let sortedData = [...RestaurantCart];

      if (sortType === "Price: Low to High") {
        sortedData = sortedData.sort((a, b) => getAveragePrice(a) - getAveragePrice(b));
      } else if (sortType === "Price: High to Low") {
        sortedData = sortedData.sort((a, b) => getAveragePrice(b) - getAveragePrice(a));
      } else if (sortType === "Rating: Low to High") {
        sortedData = sortedData.sort((a, b) => a.Ratings[0].Rating - b.Ratings[0].Rating);
      } else if (sortType === "Rating: High to Low") {
        sortedData = sortedData.sort((a, b) => b.Ratings[0].Rating - a.Ratings[0].Rating);
      }

      setSortedRestaurants(sortedData);
      setActiveFilter(sortType);
    }
  };

  const filteredRestaurants = sortedRestaurants.filter((res) =>
    res.RestaurantLocation[0].district.toLowerCase().includes(city.toLowerCase())
  );


  return (
    <>
      <hr className="separator" />
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <LoadingShow stroke="#a49dc1" width="25px" height="25px" />
          <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}>Loading...</p>
        </div>
      ) : (
        <div className="RestaurantList">
          <div className="restaurants-container">
            <div className="title-section">
              <h2>Restaurants with online food delivery in {city}</h2>
            </div>
            <div className="filter-section">
              <div className="filter-button">
                <h3>
                  Filter &nbsp;
                  <FontAwesomeIcon icon={faFilter} />
                </h3>
              </div>
              {sort.map((x) => (
                <div
                  key={x.title}
                  onClick={() => handleSortClick(x.title)}
                  className={`sort-button ${activeFilter === x.title ? "active-sort" : "inactive-sort"}`}
                >
                  <h1>{x.title}</h1>
                  {activeFilter === x.title && (
                    <div>
                      <FontAwesomeIcon icon={faXmark} className="icon" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="restaurant-grid">
                {filteredRestaurants.map((res) => (
                  <RestaurantCard
                    key={res.RestaurantId}
                    name={res.RestaurantName}
                    address={`${res.RestaurantLocation[0].area}, ${res.RestaurantLocation[0].district}`}
                    rating={res.Ratings[0].Rating}
                    DealsByRestaurant={res?.DealsByRestaurant[res.DealsByRestaurant.length - 1]}
                    RestaurantImgage={res.RestaurantImgage}
                    RestaurantId={res.RestaurantId}
                  />
                ))}
              </div>
            ) : (
              <div className="no-restaurant-message">
                <div className="image-container-for">
                  <img src="/assets/images/logo/Mkcoding_Logo.png" alt="No restaurants" className="no-restaurant-image" />
                  <div className="overlay-text">
                    <h2>No restaurants available in {city}</h2>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantList;
