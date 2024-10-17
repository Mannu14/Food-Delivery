import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import LoadingShow from '../Loading/Loading';
// import _ from 'lodash';



const RestaurantForm = ({ restaurantDataUpdate = null, onClose }) => {
  const apiUrlProcess = `${window.location.origin}/apis`;
  

  const [restaurantData, setRestaurantData] = useState({
    RestaurantEmailId: '',
    RestaurantImgage: '',
    RestaurantName: '',
    RestaurantPhone: '',
    OpningTime: '',
    ClosingTime: '',
    RestaurantLocation: {
      area: '',
      district: '',
      lat: '',
      lng: '',
      pincode: '',
      state: ''
    }
  });
  // ------------location-----
  const [CurrentLocationError, setCurrentLocationError] = useState(null);
  const [State, setState] = useState(null);
  const [image, setImage] = useState(null);
  const [BackedError, setBackedError] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 27.6094, lng: 75.1398 }); // Default to Bangalore
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });


      if (permissionStatus.state === 'denied') {
        setState('denied');
        alert('Please allow access to your location.');
        setCurrentLocationError('*Please allow access to your location.');
        return;
      }
      if (permissionStatus.state === 'granted') {
        setState('granted');
      }

      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        fetchLocationDataMap('latlng', `${latitude},${longitude}`);

        // Update the map center with the current location
        setMapCenter({ lat: latitude, lng: longitude });
      } else {
        setCurrentLocationError('*Geolocation is not supported by this browser.');
      }
    } catch (err) {
      setCurrentLocationError('*Error getting location: ' + err.message);
    }
  };

  const UseCurrentLocation = () => {
    if (State === 'granted') {
      setCurrentLocationError('*You are already using your current location.');
    }
    if (State === 'denied') {
      setCurrentLocationError('*Please allow access to your location.');
    }
    getLocation();
  }
  // ------------location-----End
  const [errorsINput, setErrorsINput] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setRestaurantData({
      ...restaurantData,
      RestaurantLocation: {
        ...restaurantData.RestaurantLocation,
        [name]: value
      }
    });
  };

  const handleInputChangeUser = (e) => {
    const { name, value } = e.target;


    setRestaurantData({
      ...restaurantData,
      [name]: value
    });
  };
  const [LoadingKeys, setLoadingKeys] = useState(true);
  const [Keys, setKeys] = useState({});
  useEffect(() => {
    // Fetch user data from your API endpoint
    const fetchKeyData = async () => {
      setLoadingKeys(true);
      try {
        const response = await fetch(`${apiUrlProcess}/keys`, {
          method: 'GET',
          credentials: 'include', // Include cookies if necessary
        });

        const KEYSData = await response.json();
        setKeys(KEYSData.KEYS);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchKeyData();
  }, []);
  

  const fetchLocationData = async () => {
    const { area, district, pincode, state } = restaurantData.RestaurantLocation;
    const query = `${area} ${district} ${pincode} ${state}`;

    const newErrorsInput = {};
    setErrorsINput({});
    if (!area) newErrorsInput.area = '*Area is required';
    if (!district) newErrorsInput.district = '*District is required';
    if (!pincode) newErrorsInput.pincode = '*Pincode is required';
    if (!state) newErrorsInput.state = '*State is required';

    if (Object.keys(newErrorsInput).length > 0) {
      setErrorsINput(newErrorsInput);
      // return; // Stop execution if there are empty fields
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${Keys.FRONTEND_OPENCAGEDATA_GOOGLE_MAP_KEY}&language=en&pretty=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        const components = data.results[0].components;
        const location = data.results[0].geometry;

        if (validateLocationData(components, newErrorsInput)) {
          setRestaurantData({
            ...restaurantData,
            RestaurantLocation: {
              ...restaurantData.RestaurantLocation,
              lat: location.lat,
              lng: location.lng,
              area: components.village || components.town || components.city || components._normalized_city || restaurantData.RestaurantLocation.area,
              district: components.city || components.state_district || restaurantData.RestaurantLocation.district,
              pincode: components.postcode || restaurantData.RestaurantLocation.pincode,
              state: components.state || restaurantData.RestaurantLocation.state,
            }
          });
        }

        // Pan the map to the new location
        setMapCenter({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error('Error fetching location details');
    }
  };

  // ---- map click------
  const fetchLocationDataMap = async (key, value) => {
    let query = value;

    if (key === 'pincode') {
      query = `${restaurantData.RestaurantLocation.area} ${restaurantData.RestaurantLocation.district} ${value} ${restaurantData.RestaurantLocation.state}`;
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${Keys.FRONTEND_OPENCAGEDATA_GOOGLE_MAP_KEY}&language=en&pretty=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setErrorsINput({});


      if (data.results.length > 0) {
        const components = data.results[0].components;
        const location = data.results[0].geometry;

        setRestaurantData({
          ...restaurantData,
          RestaurantLocation: {
            ...restaurantData.RestaurantLocation,
            lat: location.lat,
            lng: location.lng,
            area: components.village || components.town || components.city || components._normalized_city || restaurantData.RestaurantLocation.area,
            district: components.city || components.state_district || restaurantData.RestaurantLocation.district,
            pincode: components.postcode || restaurantData.RestaurantLocation.pincode,
            state: components.state || restaurantData.RestaurantLocation.state,
          }
        });

        setMapCenter({ lat: location.lat, lng: location.lng });
      }
    } catch (error) {
      console.error('Error fetching location details');
    }
  };

  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setCurrentLocationError(null);
    setErrors({});

    setRestaurantData({
      ...restaurantData,
      RestaurantLocation: { ...restaurantData.RestaurantLocation, lat, lng }
    });

    fetchLocationDataMap('latlng', `${lat},${lng}`);
  };
  // ---- map click End------

  const validateLocationData = (components, newErrorsInput) => {
    const errors = {};
    setErrors({});

    if (components.postcode !== restaurantData.RestaurantLocation.pincode) {
      errors.pincode = 'Pincode does not match the selected location.';
    }
    let AreaComponent;
    if (components.village) {
      AreaComponent = components.village
    }
    else if (components.town) {
      AreaComponent = components.town
    }
    else if (components.city) {
      AreaComponent = components.city
    }
    else if (components._normalized_city) {
      AreaComponent = components._normalized_city
    }
    else {
      AreaComponent = "*Component is Not Present"
    }
    if (AreaComponent !== restaurantData.RestaurantLocation.area) {
      errors.village = '*village or town does not match the selected location.';
    }
    if (components.city !== restaurantData.RestaurantLocation.district && components.state_district !== restaurantData.RestaurantLocation.district) {
      errors.district = '*District does not match the selected location.';
    }
    if (components.state !== restaurantData.RestaurantLocation.state) {
      errors.state = '*State does not match the selected location.';
    }

    if (Object.keys(newErrorsInput).length == 0) {
      setErrors(errors);
    }

    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('RestaurantEmailId', restaurantData.RestaurantEmailId);
    formData.append('RestaurantName', restaurantData.RestaurantName);
    formData.append('RestaurantPhone', restaurantData.RestaurantPhone);
    formData.append('OpningTime', restaurantData.OpningTime);
    formData.append('ClosingTime', restaurantData.ClosingTime);

    formData.append('area', restaurantData.RestaurantLocation.area);
    formData.append('district', restaurantData.RestaurantLocation.district);
    formData.append('pincode', restaurantData.RestaurantLocation.pincode);
    formData.append('state', restaurantData.RestaurantLocation.state);
    formData.append('lat', restaurantData.RestaurantLocation.lat);
    formData.append('lng', restaurantData.RestaurantLocation.lng);
    if (image) {
      formData.append('RestaurantImgage', image);
    }

    try {
      const apiUrl = restaurantDataUpdate ? `${apiUrlProcess}/api/updateRestaurant/${restaurantDataUpdate.RestaurantId}` : `${apiUrlProcess}/api/restaurants`;
      const response = await fetch(apiUrl, {
        method: restaurantDataUpdate ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      setBackedError(data.alertMsg);

      if (!response.ok) {
        throw new Error('failed to fetch Data');
      }
      onClose();
    }
    catch (error) {
      console.error('There was an error submitting the restaurant data!', error);
    } finally {
      setLoading(false);
    }
  };

  if (LoadingKeys) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <LoadingShow stroke="#a1a0f9" width="25px" height="25px" />
      <p style={{ textAlign: 'center', paddingLeft: '20px', color: '#555' }}> Loading...</p>
    </div>;
  }


  return (
    <div className="Top-container">
      <div className="bottom-container">
        <form onSubmit={handleSubmit}>
          <h2 style={{ color: '#999' }}>Restaurant Form</h2>

          <input
            type="email"
            name="RestaurantEmailId"
            placeholder="Restaurant's Email"
            onChange={handleInputChangeUser}
          />
          <div className="fileInput">
            <button>Upload File</button>
            <input
              type="file"
              name="RestaurantImgage"
              placeholder="Restaurant Image URL"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <input
            type="text"
            name="RestaurantName"
            placeholder="Restaurant's Name"
            onChange={handleInputChangeUser}
          />
          <input
            type="number"
            name="RestaurantPhone"
            placeholder="Restaurant's Phone Number"
            onChange={handleInputChangeUser}
          />
          <div className="opening-closing-time">
            <input
              type="time"
              name="OpningTime"
              placeholder="Restaurant's OpningTime"
              onChange={handleInputChangeUser}
            />
            <input
              type="time"
              name="ClosingTime"
              placeholder="Restaurant's ClosingTime"
              onChange={handleInputChangeUser}
            />
          </div>


          <h3>Restaurant Location</h3>
          <input
            type="text"
            name="area"
            placeholder="Area"
            value={restaurantData.RestaurantLocation.area}
            onChange={handleInputChange}
          />
          {errorsINput.area && <div className="error">{errorsINput.area}</div>}
          <input
            type="text"
            name="district"
            placeholder="District"
            value={restaurantData.RestaurantLocation.district}
            onChange={handleInputChange}
          />
          {errorsINput.district && <div className="error">{errorsINput.district}</div>}
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={restaurantData.RestaurantLocation.pincode}
            onChange={handleInputChange}
          />
          {errorsINput.pincode && <div className="error">{errorsINput.pincode}</div>}
          <input
            type="text"
            name="state"
            placeholder="State"
            value={restaurantData.RestaurantLocation.state}
            onChange={handleInputChange}
          />
          {errorsINput.state && <div className="error">{errorsINput.state}</div>}
          {/* Display Errors */}

          {Object.keys(errors).length > 0 && (
            <div className="error allError">
              {errors.pincode && <p>{errors.pincode}</p>}
              {errors.village && <p>{errors.village}</p>}
              {errors.district && <p>{errors.district}</p>}
              {errors.state && <p>{errors.state}</p>}
            </div>
          )}
          <button type="button" className='Form-btns' onClick={fetchLocationData}>
            Find Location
          </button>
          {CurrentLocationError && <p className="error">{CurrentLocationError}</p>}
          <button type="button" className='Form-btns' onClick={UseCurrentLocation}>
            Use Current Location
          </button>

          <div style={{ height: '400px', width: '100%' }}>
            <LoadScript googleMapsApiKey={Keys.FRONTEND_GOOGLE_MAP_KEY}>
              <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                center={mapCenter}
                zoom={11}
                onClick={handleMapClick}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </LoadScript>
          </div>

          {BackedError && <p className="error error-submit">{BackedError}</p>}
          <button className='Form-btns' type="submit">
            {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><LoadingShow width="25px" height="25px" /> please wait...</div> :
              restaurantDataUpdate ? 'Update' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RestaurantForm;