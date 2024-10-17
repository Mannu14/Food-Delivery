import { useEffect, useState } from "react";
import './login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingShow from "../Loading/Loading";

function Login() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [errorMsg, setAlertMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const sendTo = searchParams.get('sendTo');

  const handleLogin = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!email || !password) {
      setAlertMsg('Please fill in all required fields.');
      return;
    }
    try {
      const response = await fetch(`${apiUrlProcess}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.errorMsg === 'User Not Found') {
        setAlertMsg('User not found.');
        return;
      }
      if (data.errorMsg === 'Invalid Password') {
        setAlertMsg('Invalid Password.');
        return;
      }
      if (data.errorMsg === 'Go To Profile Page') {
        setAlertMsg('');
        if (sendTo) {
          navigate(`/${sendTo}`);
        }
        else {
          navigate('/UserProfile')
        }

      }
    } catch (error) {
      console.error('Error:', error);
      setAlertMsg('Login failed. Please try again.');
    }finally{
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertMsg('');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAlertMsg('')
    }, 7000);

    return () => clearInterval(intervalId);
  }, [errorMsg]);

  return (
    <>
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div className="container-login">
            <h2 className="heading-login" style={{ color: '#c5cae9', marginBottom: '20px', marginTop: '5px' }}>
              <span style={{ color: '#c5cae9' }}>Please Login To Continue</span>
            </h2>
            <hr style={{ border: '1px solid #ccc' }} />
            <div className="field-login">
              <label htmlFor="email" className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-envelope icon"></i>
                  <input
                    autoFocus
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    id="email"
                    placeholder="name123@gmail.com"
                  />
                </div>
              </label>
              <label htmlFor="password" className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-lock icon"></i>
                  <input
                    className="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    placeholder="Password *"
                  />
                </div>
              </label>
              {errorMsg &&
                <div id="customAlert" className="alert">
                  <span className="closebtn" onClick={closeAlert}>&times;</span>
                  <strong>Error:</strong> {errorMsg}
                </div>
              }
              <label htmlFor="submit" className="submit-login">
                <button style={{ marginTop: '30px' }} type="submit" className="input-submit">
                  {loading? <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly',height:'25px'}}><LoadingShow stroke='pink' width="25px" height="25px"/>please wait...</div> :'Sign in'}
                </button>
              </label>
            </div>
            <hr />
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
