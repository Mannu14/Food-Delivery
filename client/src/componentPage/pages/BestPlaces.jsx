import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import "./BestPlaces.css"; // Import the CSS file
import RestaurantList from "./RestaurantList";
import BLOG from "./BLOG";
import LoadingShow from "../../Loading/Loading";

const BestPlaces = () => {
  const apiUrlProcess = `${window.location.origin}/apis`;
  
  const [bestPlacesOpen, setBestPlacesOpen] = useState(false);
  const [city, setCity] = useState('Jaipur');
  const [RestaurantCart, setRestaurantCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [samplePlaces, setSamplePlaces] = useState([]);

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
        if (data?.RestaurantMenuForCart) {
          const uniqueDistricts = new Set();

          data.RestaurantMenuForCart.forEach(res => {
            const district = res.RestaurantLocation[0].district;
            if (district) {
              uniqueDistricts.add(district);
            }
          });
          const formattedDistricts = Array.from(uniqueDistricts).map(district => ({ text: district }));
          setSamplePlaces(formattedDistricts);
        }

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleMorePlaces = () => setBestPlacesOpen(true);
  const handleLessPlaces = () => setBestPlacesOpen(false);

  useEffect(() => {
    const filteredRestaurants = RestaurantCart.filter((res) =>
      res.RestaurantLocation[0].district.toLowerCase().includes(city.toLowerCase())
    );

    const sortedData = filteredRestaurants.sort((a, b) => b.Ratings[0].Rating - a.Ratings[0].Rating);
    setSortedRestaurants(sortedData);
  }, [RestaurantCart, city]);

  return (
    <>
      <>
        {loading ?
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <LoadingShow stroke="#a49dc1" width="25px" height="25px" />
            <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}>Loading...</p>
          </div>

          : <BLOG city={city} filteredRestaurants={sortedRestaurants} />
        }
        <RestaurantList city={city} />
      </>
      <div className="BestPlaces">
        <hr className="separator" />
        <div className="header">
          <h1>Best Places to Eat Across Cities</h1>
        </div>
        <div className="places-container">
          {samplePlaces.slice(0, 11).map((place, index) => (
            <div style={{ background: `${city === place.text ? '#ffedcc' : ''}` }} className="place-card" key={index} onClick={() => setCity(place.text)}>
              <h2>Best Restaurants in {place.text}</h2>
            </div>
          ))}
          {!bestPlacesOpen && (
            <div className="show-more" onClick={handleMorePlaces}>
              <RiArrowDownSLine className="icon" />
              <h2>Show more</h2>
            </div>
          )}
          {bestPlacesOpen && (
            <>
              {samplePlaces.slice(11).map((place, index) => (
                <div style={{ background: `${city === place.text ? '#ffedcc' : ''}` }} className="place-card" key={index} onClick={() => setCity(place.text)}>
                  <h2>Best Restaurants in {place.text}</h2>
                </div>
              ))}
              <div className="show-less" onClick={handleLessPlaces}>
                <RiArrowUpSLine className="icon" />
                <h2>Show less</h2>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BestPlaces;
