import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/ProfilePage';
import CreatePost from './components/CreatePost';
import LoginPage from './components/AuthPage';
import RegisterPage from './components/Register';
import PostsPage from './components/Posts';
import '@ant-design/v5-patch-for-react-19';
import Pages from './components/Main';
import './App.css'
import DiscussionPage from './components/DiscussionPage';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path='/comments/:id' element={<DiscussionPage/>} />
        <Route path="/profiles" element={<Home />} />
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
