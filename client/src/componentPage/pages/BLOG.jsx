import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
function BLOG({ city, filteredRestaurants }) {
  return (
    <div className="blog">

      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>Top restaurant chains in {city}</h2>
        {filteredRestaurants.length > 0 ? (
          <div className="blog-container has-scrollbar">
            {filteredRestaurants.map((res) => (
              <div className="blog-card" key={res.RestaurantId}>

                <Link to={`/restaurant/${res.RestaurantId}`}>
                  <div style={{ width: '300px', height: '450px', borderRadius: '10px', backgroundColor: '#eee' }}>
                    <LazyLoadImage
                      src={`https://res.cloudinary.com/diz4lqbev/image/upload/v1234567890/${res.RestaurantImgage}.jpg`} alt="Delicious Recipes for a Quick Meal" style={{ width: '300px', height: '450px' }} className="blog-banner"
                      effect="opacity"
                      wrapperProps={{
                        style: { transitionDelay: "1s" },
                      }}
                    />
                  </div>
                </Link>
                <div className="blog-content">
                  <h3 className="blog-category">{res.RestaurantName}</h3>
                  <h3 className="blog-title" style={{ cursor: 'pointer' }}><span className="green-star">★</span> {res.Ratings[0].Rating.toFixed(1)}</h3>
                  <p className="blog-meta">From <cite>{`${res.RestaurantLocation[0].area}, ${res.RestaurantLocation[0].district}`}</cite></p>
                </div>
              </div>
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
  );
}

export default BLOG;
