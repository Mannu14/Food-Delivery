import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import LoadingShow from '../Loading/Loading';

function Register() {
  const apiUrlProcess = `${window.location.origin}/apis`;
  const [alertMsg, setAlertMsg] = useState('');

  const navigate = useNavigate();

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');
  const [image, setImage] = useState(null); // Store image as a file object
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!firstname || !email || !password || !confirmpassword) {
      setAlertMsg('Please fill in all required fields.');
      return;
    }
    if (password !== confirmpassword) {
      setAlertMsg('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('language', language);
    if (image) {
      formData.append('image', image);
    }
    formData.append('password', password);
    formData.append('confirmpassword', confirmpassword);

    try {
      const response = await fetch(`${apiUrlProcess}/register`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      setAlertMsg(data.alertMsg);
      if (data.alertMsg === 'successful registration') {
        setAlertMsg('');
        navigate('/auth?startwith=signIn');
      }
    } catch (error) {
      console.error(error);
      setAlertMsg('Registration failed. Please try again.');
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
  }, [alertMsg]);

  return (
    <div className="Register-form">
      <div className="Register-container">
        <h2 className="Register-heading" style={{ textAlign: 'center', color: '#c5cae9', fontSize: '22px', marginBottom: '20px', marginTop: '20px' }}>
          <span>Create an Account</span>
        </h2>
        <hr style={{ border: '1px solid #ccc' }} />
        <div className="Register-field">
          <form id="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-user icon"></i>
                  <input type="text" id="firstname" onChange={(e) => setFirstName(e.target.value)} autoComplete="off" name="firstname" placeholder="First Name Unique*" required />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-user icon"></i>
                  <input type="text" id="lastname" onChange={(e) => setLastName(e.target.value)} autoComplete="off" name="lastname" placeholder="Last Name" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-envelope icon"></i>
                  <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} autoFocus name="email" placeholder="name123@gmail.com" required />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-phone icon"></i>
                  <input type="number" id="phone" onChange={(e) => setPhone(e.target.value)} autoComplete="off" name="phone" placeholder="Phone Number" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-address-card icon"></i>
                  <input type="text" id="address" onChange={(e) => setAddress(e.target.value)} autoComplete="off" name="address" placeholder="Address" />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-globe icon"></i>
                  <input type="text" id="language" onChange={(e) => setLanguage(e.target.value)} autoComplete="off" name="language" placeholder="Language" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-image icon"></i>
                  <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} name="image" placeholder="Upload Image" />
                </div>
              </div>
            </div>
            <div className="two-two-input">
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-lock icon"></i>
                  <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} autoComplete="off" name="password" placeholder="Password *" required />
                </div>
              </div>
              <div className="input-label">
                <div className="input-wrapper">
                  <i className="fa fa-lock icon"></i>
                  <input type="password" id="confirmpassword" onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off" name="confirmpassword" placeholder="Confirm Password *" required />
                </div>
              </div>
            </div>
            {alertMsg &&
              <div id="customAlert" className="alert">
                <span className="closebtn" onClick={closeAlert}>&times;</span>
                <strong>Error:</strong> {alertMsg}
              </div>
            }
            <div className="submit-Register">
              <button style={{ marginTop: '30px' }} type="submit" className="input-submit">
              {loading? <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly',height:'25px'}}><LoadingShow stroke='pink' width="25px" height="25px"/> please wait...</div> :'Register'}
                </button>
            </div>
          </form>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span className="text-center" style={{ fontSize: '17px', color: '#c5cae9' }}>Already have an account?</span>
            <Link style={{ color: '#ccc', fontWeight: '500', textAlign: 'center', paddingLeft: '10px', fontSize: '14px' }} to="/auth?startwith=signIn">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
