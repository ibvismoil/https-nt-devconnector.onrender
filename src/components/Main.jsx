import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

const handleRegister = () => {
  window.location.href = '/register';
};


const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: 'url(https://c.pxhere.com/photos/1c/58/Art_Code_Computer_Creative_CSS_Design_Desk_Mac-1614086.jpg!d)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>Developer Connector</h1>
        <p style={{ fontSize: '1.5rem' }}>Create a developer profile/portfolio, share posts and get help from other developers</p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button type="primary" size="large" onClick={() => navigate('/profiles')}>Developer</Button>
        <Button size="large" onClick={() => navigate('/posts')}>Posts</Button>
          {localStorage.getItem('token') ? (
            <button onClick={handleLogout} style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
              Выйти
            </button>
             ) : (
            <button onClick={handleRegister} style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
              Регистрация
            </button>
             )}
      </div>
    </div>
  );
};

export default MainPage;
