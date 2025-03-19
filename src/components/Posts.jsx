import React, { useEffect, useState } from 'react';
import { Button, Card, message, Spin, Avatar } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
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
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
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
                    {
                        headers: {
                            'x-auth-token': token,
                        },
                    }
                );
                setUserMe(response.data._id);
            } catch (error) {
                message.error('Ошибка при загрузке данных пользователя');
            }
        };

        fetchPosts();
        fetchUser();
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`https://nt-devconnector.onrender.com/api/posts/${id}`, {
                headers: {
                    "x-auth-token": token,
                },
            })
            .then(() => {
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
                message.success("Пост успешно удалён");
            })
            .catch((error) => {
                console.error("Ошибка при удалении поста:", error);
                message.error("Ошибка при удалении поста");
            });
    };

    async function like(id) {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `https://nt-devconnector.onrender.com/api/posts/like/${id}`,
                {},
                {
                    headers: {
                        "x-auth-token": token,
                    },
                }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id ? { ...post, likes: response.data } : post
                )
            );

            console.log("Лайк успешно поставлен!", response.data);
        } catch (error) {
            console.error("Ошибка при лайке поста:", error.response?.data);
            message.error(error.response?.data?.msg || "Ошибка при лайке");
        }
    }

    async function unlike(id) {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `https://nt-devconnector.onrender.com/api/posts/unlike/${id}`,
                {},
                {
                    headers: {
                        "x-auth-token": token,
                    },
                }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === id ? { ...post, likes: response.data } : post
                )
            );

            console.log("Лайк успешно удалён!", response.data);
        } catch (error) {
            console.error("Ошибка при удалении лайка:", error.response?.data);
            message.error(error.response?.data?.msg || "Ошибка при удалении лайка");
        }
    }

    if (loading) {
        return <Spin tip="Загрузка постов..." size="large" />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Posts</h2>
                <Button type="primary" onClick={() => navigate('/create')} style={{ backgroundColor: '#17a2b8' }}>
                    Create post
                </Button>
            </div>
            {posts.length === 0 ? (
                <p>Постов нет.</p>
            ) : (
                posts.map((post) => (
                    <Card key={post._id} style={{ marginBottom: '10px', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',}}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar style={{ marginRight: '10px' }}>U</Avatar>
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#17a2b8' }}>{post.user.name}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                                    Опубликовано: {new Date(post.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <h3 style={{ marginTop: '10px' }}>{post.text}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div className="flex gap-[15px] mt-[10px]">
                                <button onClick={() => like(post?._id)}>Like {post?.likes.length}</button>
                                <button onClick={() => unlike(post?._id)}>Unlike</button>
                            </div>
                            <Button
  type="primary"
  style={{ backgroundColor: '#17a2b8', marginLeft: '10px' }}
  onClick={() => navigate(`/comments/${post._id}`)}
>
  Discussion
</Button>

                            {String(post.user) === String(userMe) && (
                                <Button type="danger" onClick={() => handleDelete(post._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                                    Удалить
                                </Button>
                            )}
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
};

export default PostsPage;
