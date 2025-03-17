import React, { useEffect, useState } from 'react';
import { Button, Card, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(
                    'https://nt-devconnector.onrender.com/api/posts',
                    {
                        headers: {
                            'x-auth-token': token
                        }
                    }
                );
                setPosts(response.data);
            } catch (error) {
                message.error('Ошибка при загрузке постов');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const deletePost = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(
                `https://nt-devconnector.onrender.com/api/posts/${postId}`,
                {
                    headers: {
                        'x-auth-token': token
                    }
                }
            );
            message.success('Пост успешно удалён');
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            message.error('Ошибка при удалении поста');
        }
    };

    if (loading) {
        return <Spin tip="Загрузка постов..." size="large" />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Посты</h2>
                <Button type="primary" onClick={() => navigate('/create')} style={{ backgroundColor: '#17a2b8' }}>
                    Создать пост
                </Button>
            </div>
            {posts.length === 0 ? (
                <p>Постов нет.</p>
            ) : (
                posts.map(post => (
                    <Card key={post._id} style={{ marginBottom: '10px' }}>
                        <h3>{post.text}</h3>
                        <p>Автор: {post.user.name}</p>
                        {String(post.user._id) === String(localStorage.getItem('userId')) && (
                            <Button type="danger" onClick={() => deletePost(post._id)}>
                                Удалить
                            </Button>
                    )}
                    </Card>
                ))
            )}
        </div>
    );
};

export default PostsPage;
