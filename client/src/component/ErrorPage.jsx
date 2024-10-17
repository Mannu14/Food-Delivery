import React from 'react';

function ErrorPage() {
  const errorPageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    margin: '0',
  };

  const messageStyle = {
    fontSize: '1.5rem',
    margin: '10px 0 20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#ecf0f1',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#c0392b',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = buttonStyle.backgroundColor;
  };

  return (
    <div style={errorPageStyle}>
      <div style={titleStyle}>Error 404</div>
      <div style={messageStyle}>Page Not Found</div>
      <a 
        href="/main" 
        style={buttonStyle} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        Go to Homepage
      </a>
    </div>
  );
}

export default ErrorPage;
