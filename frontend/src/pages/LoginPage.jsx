import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, verify } from '../services/authService';
import '../style/LoginPage.css';
import Banner from './components/Banner';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    const resp = await login(email);

    if (!resp) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
      setEmailSubmitted(true);
    }
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleVerificationSubmit = async (event) => {
    event.preventDefault();
    const resp = await verify(email, verificationCode);

    if (!resp) {
      setVerificationError('Invalid verification code');
      setVerificationCode('');
    } else {
      setVerificationError('');
      navigate('/');
    }
  };

  return (
    <div>
      <Banner />
      <div className='login-container'>
        <form onSubmit={handleEmailSubmit}>
          <div className='input-container'>
            <input
              type="email"
              id="email"
              className={emailSubmitted ? 'input-field-submitted' : 'input-field'}
              value={email}
              placeholder='Email'
              onChange={handleEmailChange}
              required
              disabled={emailSubmitted} // readonly
              style={{ opacity: emailSubmitted ? 0.5 : 1 }} // gray out
            />
          </div>
          {emailError && <p className="error-message">{emailError}</p>}
          {!emailSubmitted && <button className='login-button' type="submit">Verify</button>}
        </form>
        {emailSubmitted && (
          <form onSubmit={handleVerificationSubmit}>
            <div className='input-container'>
              <input
                type="text"
                id="verificationCode"
                className='input-field'
                value={verificationCode}
                placeholder='Enter code'
                onChange={handleVerificationCodeChange}
                required
              />
            </div>
            {verificationError && <p className="error-message">{verificationError}</p>}
            <button className='login-button' type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;