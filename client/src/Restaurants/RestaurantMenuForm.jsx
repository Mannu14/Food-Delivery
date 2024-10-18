import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import './RestaurantMenuForm.css'
import LoadingShow from '../Loading/Loading';

function RestaurantMenuForm({ UpdateMenu, UpdateDeal, MyRestaurantId, onClose }) {

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isMenuForm = searchParams.get('startwith') === 'showmenuform';
  const isDealsForm = searchParams.get('startwith') === 'showdealsforyouform';

  useEffect(() => {
    if (!UpdateMenu && UpdateDeal) {
      setSearchParams({ startwith: 'showdealsforyouform' });
    } else if (UpdateMenu && !UpdateDeal) {
      setSearchParams({ startwith: 'showmenuform' });
    }
  }, [UpdateMenu, UpdateDeal, setSearchParams]);
  const IsRestaurantMenuUpdate = location.pathname === `/restaurant/${MyRestaurantId}`;




  return (
    <div className="Top-container">
      <div className="Top-Common-container">
        <div className="button-group">
          {IsRestaurantMenuUpdate && UpdateMenu ?
            <Link
              to="?startwith=showmenuform"
              className={`toggle-button ${isMenuForm ? 'active' : ''}`}
            >
              Show Menu Form
            </Link>
            : IsRestaurantMenuUpdate && UpdateDeal ?
              < Link
                to="?startwith=showdealsforyouform"
                className={`toggle-button ${isDealsForm ? 'active' : ''}`}
              >
                Show Deals For You Form
              </Link>
              :
              <>
                <Link
                  to="?startwith=showmenuform"
                  className={`toggle-button ${isMenuForm ? 'active' : ''}`}
                >
                  Show Menu Form
                </Link>
                < Link
                  to="?startwith=showdealsforyouform"
                  className={`toggle-button ${isDealsForm ? 'active' : ''}`}
                >
                  Show Deals For You Form
                </Link>
              </>
          }
        </div>

        <div className="form-container">
          {isDealsForm ? <DealsForYouForm onClose={onClose} UpdateDeal={IsRestaurantMenuUpdate ? UpdateDeal : ''} /> : ''}
          {isMenuForm ? <MenuItemsForm onClose={onClose} UpdateMenu={IsRestaurantMenuUpdate ? UpdateMenu : ''} /> : ''}
          {!isDealsForm && !isMenuForm ? <MenuItemsForm onClose={onClose} UpdateMenu={IsRestaurantMenuUpdate ? UpdateMenu : ''} /> : ''}
        </div>
      </div>
    </div >
  );
}

function MenuItemsForm(UpdateMenu) {
  const apiUrlProcess = `${window.location.origin}/apis`;

  const myMenu = UpdateMenu.UpdateMenu

  const [menuItems, setMenuItems] = useState({ RestaurantId: '', ItemName: '', Price: '', discount: '', description: '', IsVeg: '', InStock: '' });
  const [image, setImage] = useState(null);
  const [BackedError, setBackedError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (myMenu) {
      setMenuItems({
        ItemName: myMenu.ItemName || '',
        Price: myMenu.Price || '',
        discount: myMenu.discount || '',
        description: myMenu.description || '',
        IsVeg: myMenu.IsVeg || '',
        InStock: myMenu.InStock || '',
      });
    }
  }, [myMenu]);

  const handleMenuChange = (e) => {
    const { name, value } = e.target;

    setMenuItems({
      ...menuItems,
      [name]: value
    });
    setBackedError('')
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('RestaurantId', menuItems.RestaurantId);
    formData.append('ItemName', menuItems.ItemName);
    formData.append('Price', menuItems.Price);
    formData.append('discount', menuItems.discount);
    formData.append('description', menuItems.description);
    formData.append('IsVeg', menuItems.IsVeg);
    formData.append('InStock', menuItems.InStock);
    if (myMenu) {
      formData.append('MenuId', myMenu.MenuId);
    }

    if (image) {
      formData.append('ItemImage', image);
    }
    try {

      const apiUrl = myMenu ? `${apiUrlProcess}/api/updateMenu/${myMenu.MenuId}` : `${apiUrlProcess}/api/restaurants/Menu`;

      const response = await fetch(apiUrl, {
        method: myMenu ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      setBackedError(data.alertMsg);

      if (!response.ok) {
        throw new Error('failed to fetch Data');
      }
      if (response.ok) {
        UpdateMenu.onClose();
        window.location.reload()
      }
    }
    catch (error) {
      console.error('There was an error submitting the restaurant data!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Menu Items</h3>
      <div key='MenuItems'>
        <div className="input-container">
          <input
            type='text'
            name="RestaurantId"
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>Restaurant Id</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="ItemName"
            value={menuItems.ItemName}
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>Item Name</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="Price"
            value={menuItems.Price}
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>Price</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="discount"
            value={menuItems.discount}
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>Actual price</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="description"
            value={menuItems.description}
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>Description</label>
        </div>
        <div className="fileInput">
          <button>Upload File</button>
          <div className="input-container">
            <input
              type="file"
              name="image"
              placeholder=" "
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label>Item's Image</label>
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="IsVeg"
            value={menuItems.IsVeg}
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>Is Vegetarian(true/false)</label>
        </div>
        <div className="input-container">
          <input
            type="number"
            name="InStock"
            value={menuItems.InStock}
            placeholder=" "
            onChange={handleMenuChange}
          />
          <label>InStock(number of Items)</label>
        </div>
      </div>
      {BackedError && <p className="error error-submit">{BackedError}</p>}
      <button type="submit">
        {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><LoadingShow width="25px" height="25px" /> please wait...</div> : 'Submit Menu'}
      </button>
    </form>
  );
}

function DealsForYouForm(UpdateDeal) {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const myMenu = UpdateDeal.UpdateDeal

  const [menuItems, setMenuItems] = useState({ RestaurantId: '', ItemName: '', Price: '', discount: '', description: '', IsVeg: '' });
  const [image, setImage] = useState(null);
  const [BackedError, setBackedError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (myMenu) {
      setMenuItems({
        ItemName: myMenu.ItemName || '',
        Price: myMenu.Price || '',
        discount: myMenu.discount || '',
        description: myMenu.description || '',
        IsVeg: myMenu.IsVeg || '',
        InStock: myMenu.InStock || '',
      });
    }
  }, [myMenu]);

  const handleDealChange = (e) => {
    const { name, value } = e.target;

    setMenuItems({
      ...menuItems,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('RestaurantId', menuItems.RestaurantId);
    formData.append('ItemName', menuItems.ItemName);
    formData.append('Price', menuItems.Price);
    formData.append('discount', menuItems.discount);
    formData.append('description', menuItems.description);
    formData.append('IsVeg', menuItems.IsVeg);
    if (myMenu) {
      formData.append('MenuId', myMenu.MenuId);
    }

    if (image) {
      formData.append('ItemImage', image);
    }
    try {
      const apiUrl = myMenu ? `${apiUrlProcess}/api/updateDeal/${myMenu.MenuId}` : `${apiUrlProcess}/api/restaurants/Deal`;

      const response = await fetch(apiUrl, {
        method: myMenu ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include', // Include cookies
      });
      const data = await response.json();
      if (data.alertMsg) {
        setBackedError(data.alertMsg);
      }
      if (data.error) {
        setBackedError(data.error);
      }

      if (!response.ok) {
        throw new Error('failed to fetch Data');
      }
      if (response.ok) {
        UpdateDeal.onClose();
        window.location.reload()
      }

    }
    catch (error) {
      console.error('There was an error submitting the restaurant data!', error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Deals For You</h3>
      <div key='DealsForyou'>
        <div className="input-container">
          <input
            type='text'
            name="RestaurantId"
            placeholder=" "
            onChange={handleDealChange}
          />
          <label>Restaurant Id</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="ItemName"
            value={menuItems.ItemName}
            placeholder=" "
            onChange={handleDealChange}
          />
          <label>Deal Item Name</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="Price"
            placeholder=" "
            value={menuItems.Price}
            onChange={handleDealChange}
          />
          <label>Deal Price</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="discount"
            placeholder=" "
            value={menuItems.discount}
            onChange={handleDealChange}
          />
          <label>Discount coupon</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="description"
            placeholder=" "
            value={menuItems.description}
            onChange={handleDealChange}
          />
          <label>Description</label>
        </div>
        <div className="fileInput">
          <button>Upload File</button>
          <div className="input-container">
            <input
              type="file"
              name="image"
              placeholder=" "
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label>Image</label>
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="IsVeg"
            placeholder=" "
            value={menuItems.IsVeg}
            onChange={handleDealChange}
          />
          <label>Is Vegetarian(true/false)</label>
        </div>
      </div>
      {BackedError && <p className="error error-submit">{BackedError}</p>}
      <button type="submit">
        {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><LoadingShow width="25px" height="25px" /> please wait...</div> : 'Submit Deals'}
      </button>
    </form>
  );
}

export default RestaurantMenuForm;
