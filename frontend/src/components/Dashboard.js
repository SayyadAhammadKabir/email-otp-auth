import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <h2>Welcome to Dashboard!</h2>
      
      <div className="user-info">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>

      <div className="otp-section">
        <h3>How it Works</h3>
        <p>You successfully logged in using Email OTP authentication!</p>
        <p>The OTP was sent via Brevo email service and verified securely.</p>
      </div>
    </div>
  );
};

export default Dashboard;