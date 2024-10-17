import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorPage from "./component/ErrorPage";
import Header from './CommonComponent/Header';
import Search from './CommonComponent/Search';
import Main from './CommonComponent/Main';
import Footer from './CommonComponent/Footer';
import './componentPage/styles/style.css';
import RestaurantForm from './Restaurants/RestaurantForm';
import RestaurantMenuForm from './Restaurants/RestaurantMenuForm';
import Auth from './Login-signUp/Auth';
import RestaurantMenu from './Restaurants/RestaurantMenu';
import UserProfile from './Profile/UserProfile';
import Cart from './Profile/Cart';
import Notifications from './Profile/Notifications';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import HomePage from './Login-signUp/HomePage';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route exact="true" path='/' element={<HomePage/>} ></Route>
        <Route exact path='/auth' element={<Auth />} />
        <Route exact="true" path='/Main' element={<Main />} ></Route>
        <Route exact="true" path='/Search' element={<Search />} ></Route>
        <Route exact="true" path='/RestaurantForm' element={<RestaurantForm />} ></Route>
        <Route exact="true" path='/RestaurantMenuForm' element={<RestaurantMenuForm />} ></Route>
        <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
