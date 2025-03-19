import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { List, Avatar, Button, Input, message, Spin } from 'antd';
import { UserOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';

const DiscussionPage = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('userId');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://nt-devconnector.onrender.com/api/posts/${id}`);
      setComments(response.data.comments || []);
      setLoading(false);
    } catch (error) {
      message.error('Ошибка при загрузке комментариев!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return message.warning('Комментарий не может быть пустым!');
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `https://nt-devconnector.onrender.com/api/posts/comment/${id}`,
        { text: newComment },
        { headers: { 'x-auth-token': token } }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      message.success('Комментарий добавлен!');
    } catch (error) {
      message.error('Ошибка при добавлении комментария!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://nt-devconnector.onrender.com/api/posts/comment/${id}/${commentId}`,
        { headers: { 'x-auth-token': token } }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
      message.success('Комментарий удален!');
    } catch (error) {
      message.error('Ошибка при удалении комментария!');
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 50, color: '#17a2b8' }} spin />;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
      <h2 style={{ color: '#17a2b8' }}>Discussion</h2>

      <Input.TextArea
        rows={4}
        placeholder="Напишите комментарий..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button
        type="primary"
        onClick={handleAddComment}
        loading={submitting}
        style={{ backgroundColor: '#17a2b8', marginBottom: '20px' }}
      >
        Добавить комментарий
      </Button>

      <List
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item
            actions={
              comment.user === currentUser
                ? [
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Удалить
                    </Button>
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={comment.name || 'Аноним'}
              description={comment.text || 'Без текста'}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default DiscussionPage;
