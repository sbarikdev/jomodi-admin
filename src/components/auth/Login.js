import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Input, Notification, Image } from '@mantine/core';
import { useAuth } from '../../context/auth-context';
import { notifications } from '@mantine/notifications';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [username, setUsername] = useState(''); // Change this to [email, setEmail
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        username: username,
        password: password,
      };
      const decoded = await login(credentials);
      if (decoded.admin === true && decoded.active === true) {
        navigate('/dashboard');

        notifications.show({
          title: 'Login Successful',
          message: `Welcome ${decoded?.username}`,
          color: 'teal',
          autoClose: 5000,
        });
      } else {
        notifications.show({
          title: 'Not Authorized',
          message: 'You are not authorized to access this page',
          color: 'red',
          autoClose: 5000,
        });
      }
      // Navigate to '/dashboard' only if the login is successful and authorized

    } catch (err) {
      notifications.show({
        title: 'Login Failed',
        message: err.message,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  return (
    <Container size="xl" style={{
      marginTop: 50,
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Image src="./jomo.jpg" width={100} height={100} />
      <Card shadow="sm" >
        
          <div style={{ marginBottom: 20 }}>
            <Input
              type="text"
              required
              label="Username/Phone Number"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              placeholder="Enter your username "
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Input
              type="password"
              required
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
            onClick={handleLogin}
            variant="gradient" color="teal">
              Login
            </Button>
          </div>
   
      </Card>
    </Container>
  );
};

export default Login;
