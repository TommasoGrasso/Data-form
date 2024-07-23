import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './components/register';
import LoginForm from './components/login';
import Dashboard from './components/dashboard';
import EditProfile from './components/editProfile';
import { useState, useEffect } from 'react';

const App = () => {
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('isLoggedIn'));

  useEffect(() => {
    if (isLoggedIn) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('isLoggedIn');
    }
  }, [isLoggedIn, username]);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<h1>Welcome to the Home Page. Click here to <a href="/login">login</a></h1>} />
        <Route path="/login" element={!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Dashboard username={username} onLogout={handleLogout} />
        )} />
        <Route path="/dashboard" element={!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Dashboard username={username} onLogout={handleLogout} />
        )} />
        <Route path="/edit-profile/:username" element={<EditProfile />} />
      </Routes>
    </Router>
  );
};

export default App;