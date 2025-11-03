import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/auth/send-otp', { email });
      setMessage(response.data.message);
      setStep('otp');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/auth/verify-otp', { email, otp });
      setMessage(response.data.message);
      onLogin(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="text-center">Login with OTP</h2>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={handleSendOTP}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <p className="text-center mt-2">
            Didn't receive OTP?{' '}
            <button 
              type="button" 
              className="btn btn-link"
              onClick={() => setStep('email')}
              style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}
            >
              Resend
            </button>
          </p>
        </form>
      )}

      <p className="text-center mt-3">
        Don't have an account?{' '}
        <button 
          type="button"
          className="btn btn-link"
          onClick={() => onNavigate('signup')}
          style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;