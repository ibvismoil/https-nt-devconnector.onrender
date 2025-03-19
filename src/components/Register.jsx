import React, { useState } from 'react';
import { Button, Input, Form, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            message.error('Пароли не совпадают!');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                'https://nt-devconnector.onrender.com/api/users',
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            message.success('Успешная регистрация!');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Ошибка регистрации!';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#17a2b8' }}>Регистрация</h2>
            {loading ? (
                <Spin tip="Регистрация..." size="large" />
            ) : (
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Имя"
                        name="name"
                        rules={[{ required: true, message: 'Введите имя!' }]}
                    >
                        <Input placeholder="Имя" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Введите Email!' },
                            { type: 'email', message: 'Некорректный формат Email!' },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            { required: true, message: 'Введите пароль!' },
                            { min: 6, message: 'Пароль должен содержать не менее 6 символов!' },
                        ]}
                    >
                        <Input.Password placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item
                        label="Повторите пароль"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Повторите пароль!' },
                            { min: 6, message: 'Пароль должен содержать не менее 6 символов!' },
                        ]}
                    >
                        <Input.Password placeholder="Повторите пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#17a2b8' }}>
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                    <p style={{ textAlign: 'center' }}>
                        Уже есть аккаунт? <Link to="/login">Войдите</Link>
                    </p>
                </Form>
            )}
        </div>
    );
};

export default RegisterPage;
