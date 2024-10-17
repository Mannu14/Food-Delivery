import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const homePageStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1abc9c',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
  };

  const subtitleStyle = {
    fontSize: '1.7rem',
    margin: '0 0 30px 0',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '20px',
  };

  const buttonStyle = {
    padding: '12px 25px',
    fontSize: '1.2rem',
    color: '#1abc9c',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#16a085',
    color: '#fff',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
    e.target.style.color = buttonHoverStyle.color;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = buttonStyle.backgroundColor;
    e.target.style.color = buttonStyle.color;
  };

  return (
    <div style={homePageStyle}>
      <div style={titleStyle}>Welcome to MkCodiing!</div>
      <div style={subtitleStyle}>Select Your Favorite Restaurant and Savor the Experience!</div>
      <div style={buttonContainerStyle}>
        <Link
          to="/Cart"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Cart
        </Link>
        <Link
          to="/Main"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Restaurants
        </Link>
        <Link
          to="/auth"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          SignIn or SignUp
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
