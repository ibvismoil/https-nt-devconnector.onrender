import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/ProfilePage';
import CreatePost from './components/CreatePost';
import LoginPage from './components/AuthPage';
import RegisterPage from './components/Register';
import PostsPage from './components/Posts';
import '@ant-design/v5-patch-for-react-19';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        {localStorage.getItem('token') && (
          <button onClick={handleLogout} style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
            Выйти
          </button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/create" element={<ProtectedRoute element={<CreatePost />} />} />
        <Route path="/posts" element={<ProtectedRoute element={<PostsPage />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
