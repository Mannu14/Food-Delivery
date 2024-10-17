import { useState } from 'react';
import RegistrationForm from './Register';
import Login from './Login';
import './CommonLoginSignUp.css';
import { Link, useSearchParams } from 'react-router-dom';

function Auth() {
  const [searchParams] = useSearchParams();
  const isSignInL = searchParams.get('startwith') === 'signIn';
  const isSignUpL = searchParams.get('startwith') === 'signUp';

  return (
    <div className="Common-container">
      <div className="button-group">
        <Link
          to="?startwith=signIn"
          className={`toggle-button ${isSignInL ? 'active' : ''}`}
        >
          Sign In
        </Link>
        <Link
          to="?startwith=signUp"
          className={`toggle-button ${isSignUpL ? 'active' : ''}`}
        >
          Sign Up
        </Link>
      </div>
      <div className="form-container">
        {isSignUpL ? <RegistrationForm /> : <Login/>}
      </div>
    </div>
  );
}

export default Auth;
