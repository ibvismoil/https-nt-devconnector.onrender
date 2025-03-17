import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Tag, Button, Spin } from 'antd';
import { UserOutlined, CheckCircleOutlined, GlobalOutlined, LoadingOutlined } from '@ant-design/icons';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getProfile() {
      try {
        const response = await axios.get(`https://nt-devconnector.onrender.com/api/profile/user/${id}`, {
          headers: {
            "x-auth-token": token,
          },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Ошибка получения данных профиля.");
        setLoading(false);
      }
    }

    getProfile();
  }, [id]);

  const antIcon = <LoadingOutlined style={{ fontSize: 50, color: '#17a2b8' }} spin />;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (!profile) {
    return <p>{errorMessage || 'Профиль не найден!'}</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>Back To Profiles</Button>
      <div style={{ width: '1000px', height: '568px', marginLeft:'240px', backgroundColor: '#17a2b8', padding: '40px', borderRadius: '10px', color: '#fff' }}>
        <Avatar
          size={250 }
          icon={<UserOutlined />}
          src={profile.user?.avatar || null}
          style={{ marginBottom: '20px' }}
        />
        <h2 style={{ margin: '0', fontSize: '3rem', fontWeight: 'bold' }}>{profile.user?.name || 'No Name'}</h2>
        <p style={{ fontSize: '1.5rem' }}> {profile.status || 'No status'} at {profile.company || 'No Company'}</p>
        <p style={{marginTop:'15px'}}>{profile.location || 'No Location'}</p>
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer">
            <GlobalOutlined style={{ fontSize: '1.5rem', color: '#fff',marginTop:'15px' }} />
          </a>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#F4F4F4', borderRadius: '10px' }}>
        <h3 style={{ marginBottom: '10px',fontSize: '1.5em',fontWeight:'bold', color: '#17a2b8'  }}>Users Bio</h3>
        <p style={{unicodeBidi:'isolate'}}>{profile.bio || 'No bio available'}</p>
        <br style={{color:'black'}} />
        <h3 style={{ marginTop: '20px',fontSize: '1.5em',fontWeight:'bold', color: '#17a2b8' }}>Skill Set</h3>
        {profile.skills?.map((skill, index) => (
          <Tag key={index}  style={{ marginBottom: '5px', gap:'15px' , color:"black" }}>
            {skill}
          </Tag>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={{ flex: 1, margin: '10px', padding: '20px', backgroundColor: '#F4F4F4', borderRadius: '10px' }}>
          <h3>Experience</h3>
          {profile.experience?.length ? profile.experience.map((exp, index) => (
            <p key={index}>{exp.title} at {exp.company}</p>
          )) : <p>No experience credentials</p>}
        </div>
        <div style={{ flex: 1, margin: '10px', padding: '20px', backgroundColor: '#F4F4F4', borderRadius: '10px' }}>
          <h3>Education</h3>
          {profile.education?.length ? profile.education.map((edu, index) => (
            <p key={index}>{edu.degree} from {edu.school}</p>
          )) : <p>No education credentials</p>}
        </div>
      </div>

      <h3 style={{ marginTop: '20px' }}>GitHub Repos</h3>
      <p>Coming soon...</p>
    </div>
  );
};

export default ProfilePage;
