import React, { useEffect, useState } from 'react';
import { Button, Card, message, Spin, Space } from 'antd';
import { LikeOutlined, DislikeOutlined, CommentOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userMe, setUserMe] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(
                    'https://nt-devconnector.onrender.com/api/posts',
                    { headers: { 'x-auth-token': token } }
                );
                setPosts(response.data);
            } catch (error) {
                message.error('Ошибка при загрузке постов');
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(
                    'https://nt-devconnector.onrender.com/api/auth',
                    { headers: { 'x-auth-token': token } }
                );
                setUserMe(response.data._id);
            } catch (error) {
                message.error('Ошибка при загрузке данных пользователя');
            }
        };

        fetchPosts();
        fetchUser();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`https://nt-devconnector.onrender.com/api/posts/${id}`, {
                headers: { "x-auth-token": token },
            });
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
            message.success("Пост успешно удалён");
        } catch (error) {
            message.error("Ошибка при удалении поста");
        }
    };

    const like = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(
                `https://nt-devconnector.onrender.com/api/posts/like/${id}`,
                {},
                { headers: { "x-auth-token": token } }
            );
            setPosts((prevPosts) => prevPosts.map((post) =>
                post._id === id ? { ...post, likes: response.data } : post
            ));
            message.success("Лайк успешно поставлен!");
        } catch (error) {
            message.error("Ошибка при лайке");
        }
    };

    const unlike = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(
                `https://nt-devconnector.onrender.com/api/posts/unlike/${id}`,
                {},
                { headers: { "x-auth-token": token } }
            );
            setPosts((prevPosts) => prevPosts.map((post) =>
                post._id === id ? { ...post, likes: response.data } : post
            ));
            message.success("Лайк успешно удалён!");
        } catch (error) {
            message.error("Ошибка при удалении лайка");
        }
    };

    if (loading) {
        return <Spin tip="Загрузка постов..." size="large" />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{fontSize:'3rem', fontWeight:'bold',color:'#17a2b8'}}>Posts</h2>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '20px' }} onClick={() => navigate('/create')}>
                Добавить пост
            </Button>
            {posts.map((post) => (
                <Card key={post._id} style={{ marginBottom: '20px'   }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img style={{ borderRadius:'50%' }} src={post.avatar} alt="" width={80} height={80} />
                    </div>
                    <h2 style={{fontSize:'20px', fontWeight:'400', color:'#17a2b8'}}>Name: {post.name}</h2>
                    <p style={{fontSize:'18px', fontWeight:'350'}}>Text: {post.text}</p>
                    <Space>
                        <Button icon={<LikeOutlined />} onClick={() => like(post._id)}>{post?.likes?.length || 0}</Button>
                        <Button icon={<DislikeOutlined />} onClick={() => unlike(post._id)} />
                        <Button onClick={() => navigate(`/comments/${post._id}`)}>Discussion</Button>
                        {String(post.user) === String(userMe) && (
                            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(post._id)}>
                                Удалить
                            </Button>
                        )}
                    </Space>
                </Card>
            ))}
        </div>
    );
};

export default PostsPage;
