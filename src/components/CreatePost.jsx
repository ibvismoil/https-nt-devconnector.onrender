import React, { useState } from 'react';
import { Button, Input, Form, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      await axios.post(
        'https://nt-devconnector.onrender.com/api/posts',
        { text: values.text },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      message.success('Пост успешно создан!');
      navigate('/posts');
    } catch (error) {
      message.error('Ошибка при создании поста!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#17a2b8' }}>Say Something...</h2>
      {loading ? (
        <Spin tip="Say Something..." size="large" />
      ) : (
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Text for posts" name="text" rules={[{ required: true, message: 'Введите текст поста!' }]}>
            <TextArea rows={6} placeholder="Create a post..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#17a2b8' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default CreatePost;
