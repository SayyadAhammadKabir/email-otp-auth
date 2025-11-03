import React from 'react';

const Signup = ({ onNavigate }) => {
  return (
    <div className="auth-form">
      <h2 className="text-center">Sign Up</h2>
      <p className="text-center">
        For this demo, you can simply use the login flow. 
        The system will automatically create an account when you verify your OTP.
      </p>
      
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          disabled
        />
      </div>
      
      <button 
        className="btn btn-primary btn-full"
        onClick={() => onNavigate('login')}
      >
        Go to Login
      </button>

      <p className="text-center mt-3">
        Already have an account?{' '}
        <button 
          type="button"
          className="btn btn-link"
          onClick={() => onNavigate('login')}
          style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer'}}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;