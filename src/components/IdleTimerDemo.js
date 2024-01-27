// IdleTimerDemo.js

import React, { useState, useEffect } from 'react';

// CSS Styles for the Popup and Modal
const popupStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  border: '1px solid #ccc',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  zIndex: '1000',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  zIndex: '999',
};

const Login = ({ onLogin }) => (
  <div>
    <h1>Login Page</h1>
    <button onClick={onLogin}>Login</button>
  </div>
);

const Home = ({ onLogout }) => (
  <div>
    <h1>Welcome to the Home Page</h1>
    <button onClick={onLogout}>Logout</button>
  </div>
);

const Logout = ({ onLogin }) => (
  <div>
    <h1>Logout Page</h1>
    <button onClick={onLogin}>Back to Login</button>
  </div>
);

const Popup = ({ countdown }) => (
  <div>
    <div style={modalOverlayStyle} />
    <div style={popupStyle} >
      <h1>Are you with us?</h1>
      <p>Click anywhere to continue interaction</p>
      <p>Logout in {countdown} seconds</p>
    </div>
  </div>
);

const IdleTimer = ({ onTimeout, onInteract }) => {
  const [isActive, setIsActive] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(10); // Initial countdown value

  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsActive(false);
        setShowPopup(true);
      }, 5000); // 5 seconds idle timeout
    };

    const handleActivity = () => {
      setIsActive(true);
      setShowPopup(false);
      setCountdown(10); // Reset the countdown on activity
      resetTimeout();
    };

    // Attach event listeners
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);

    // Initial setup
    resetTimeout();

    // Countdown interval
    const countdownInterval = setInterval(() => {
      if (showPopup && countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }
    }, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      clearTimeout(timeoutId);
      clearInterval(countdownInterval);
    };
  }, [onTimeout, showPopup, countdown]);

  useEffect(() => {
    let popupTimeout;

    if (showPopup) {
      // Set a timeout for the popup to disappear after 10 seconds
      popupTimeout = setTimeout(() => {
        setShowPopup(false);
        onTimeout();
      }, 10000); // 10 seconds
    }

    return () => {
      clearTimeout(popupTimeout);
    };
  }, [showPopup, onTimeout]);


  return (
    <div>
      {isActive ? 'User is active' : 'User is idle'}
      {showPopup && <Popup  countdown={countdown} />}
    </div>
  );
};

const IdleTimerDemo = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {!isLoggedIn && <Login onLogin={() => setLoggedIn(true)} />}

      {isLoggedIn && (
        <div>
          <Home onLogout={() => setLoggedIn(false)} />
          <IdleTimer
            onTimeout={() => setLoggedIn(false)}
            onInteract={() => console.log('User interacted!')}
          />
        </div>
      )}
    </div>
  );
};

export default IdleTimerDemo;
