import React from 'react';

const Navbar = ({ user, onLogout, onNavigate, currentView }) => {
  return (
    <nav className="navbar">
      <div className="logo">YourLogo</div>
      
      <div className="nav-buttons">
        {user ? (
          // User is logged in
          <>
            <span>Welcome, {user.name}</span>
            <button 
              className="btn btn-outline" 
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          // User is not logged in
          <>
            {currentView !== 'login' && (
              <button 
                className="btn btn-outline" 
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
            )}
            {currentView !== 'signup' && (
              <button 
                className="btn btn-primary" 
                onClick={() => onNavigate('signup')}
              >
                Sign Up
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;