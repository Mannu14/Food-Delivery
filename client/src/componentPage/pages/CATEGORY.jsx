import { LazyLoadImage } from 'react-lazy-load-image-component';
function CATEGORY() {
  return (
    <div className="category">

      <div className="container">

        <div className="category-item-container has-scrollbar">

          <div className="category-item">

            <div className="category-img-box">
              <div style={{  width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage
                  src="/assets/images/pexels-polina-tankilevitch-4109111.jpg" alt="Pizza" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Pizza</h3>

                <p className="category-item-amount">(53)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage
                  src="/assets/images/products/pexels-ivan-j-long-578165-1362044.jpg" alt="Burgers" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Burgers</h3>

                <p className="category-item-amount">(58)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage
                  src="/assets/images/pexels-zvolskiy-1721932.jpg" alt="Sushi" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Sushi</h3>

                <p className="category-item-amount">(68)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage
                  src="/assets/images/pexels-quang-nguyen-vinh-222549-2175211.jpg" alt="Salads" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Salads</h3>

                <p className="category-item-amount">(84)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage src="/assets/images/products/pexels-enginakyurt-1527603.jpg" alt="Desserts" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Desserts</h3>

                <p className="category-item-amount">(35)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage src="/assets/images/products/pexels-pixabay-301692.jpg" alt="Drinks" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Drinks</h3>

                <p className="category-item-amount">(16)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage src="/assets/images/products/clothes-1.jpg" alt="Pasta" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Pasta</h3>

                <p className="category-item-amount">(27)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

          <div className="category-item">

            <div className="category-img-box">
              <div style={{ width: "30px", backgroundColor: '#eee' }}>
                <LazyLoadImage src="/assets/images/pexels-zvolskiy-1721932.jpg" alt="Appetizers" style={{ width: "30px" }}
                  effect="opacity"
                  wrapperProps={{
                    style: { transitionDelay: "1s" },
                  }}
                />
              </div>
            </div>

            <div className="category-content-box">

              <div className="category-content-flex">
                <h3 className="category-item-title">Appetizers</h3>

                <p className="category-item-amount">(39)</p>
              </div>

              <a href="#" className="category-btn">Show all</a>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CATEGORY;
