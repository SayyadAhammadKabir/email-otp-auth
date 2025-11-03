import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App.css';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data.user);
      setCurrentView('dashboard');
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentView('login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      
      <div className="container">
        {currentView === 'login' && <Login onLogin={handleLogin} onNavigate={setCurrentView} />}
        {currentView === 'signup' && <Signup onNavigate={setCurrentView} />}
        {currentView === 'dashboard' && user && <Dashboard user={user} />}
      </div>
    </div>
  );
}

export default App;