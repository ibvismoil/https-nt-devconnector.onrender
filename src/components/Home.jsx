import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, Button, Avatar, Tag, Spin } from 'antd';
import { CheckCircleOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function getPosts() {
      try {
        const response = await axios.get(
          `https://nt-devconnector.onrender.com/api/profile`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setErrorMessage('Ошибка получения данных. Проверьте токен или сервер.');
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, []);

  const handleViewProfile = (profile) => {
    navigate(`/profile/${profile.user?._id}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 60, color: '#17a2b8' }} spin />}
          tip='Загрузка данных...'
          size='large'
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px', color: '#17a2b8', fontSize: '3rem', fontWeight: 'bold' }}>Developers</h1>
      <p style={{ marginBottom: '20px', color: 'black', fontSize: '1.5rem' }}>Browse and connect with developers</p>
      <div>
      <Button type='primary' onClick={() => navigate('/')} style={{ marginBottom: '20px', backgroundColor: '#17a2b8' }} >
        Home
      </Button>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {posts.length === 0 ? (
          <p>Посты не найдены.</p>
        ) : (
          posts.map((post) => (
            <Card key={post._id} style={{ width: '80%', marginBottom: '20px', backgroundColor: '#F4F4F4', borderRadius: '15px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={100} icon={<UserOutlined />} src={post.user?.avatar || null}  style={{ marginRight: '20px' }} />
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>
                    {post.user?.name || 'No Name'}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#555' }}>{post.company || 'No Company'}</p>
                  <p style={{ margin: '5px 0', color: '#777' }}>{post.location || 'No Location'}</p>
                  <Button type='primary' onClick={() => handleViewProfile(post)} style={{ marginTop: '10px', backgroundColor: '#17a2b8' }} >
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
