import React, { useState } from 'react';
import { Button, Input, Form, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://nt-devconnector.onrender.com/api/auth',
                values,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const token = response.data.token;
            localStorage.setItem('token', token);
            const userResponse = await axios.get('https://nt-devconnector.onrender.com/api/auth', {
                headers: {
                    'x-auth-token': token
                }
            });

            message.success('Успешный вход!');
            navigate('/');
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Ошибка входа!';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#17a2b8' }}>Вход</h2>
            {loading ? (
                <Spin tip="Загрузка..." size="large" />
            ) : (
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Введите Email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль!' }]}
                    >
                        <Input.Password placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#17a2b8' }}>
                            Войти
                        </Button>
                    </Form.Item>
                    <p style={{ textAlign: 'center' }}>
                        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
                    </p>
                </Form>
            )}
        </div>
    );
};

export default LoginPage;
