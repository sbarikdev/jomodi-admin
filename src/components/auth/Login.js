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

      // Assuming login is an async function that returns a decoded user object
      const decoded = await login(credentials);

      // Check for admin and active status in the decoded user object
      if (decoded.admin === true && decoded.active === true) {
        // Navigate to dashboard only if authorized and active
        navigate('/dashboard');

        // Show a successful login notification
        notifications.show({
          title: 'Login Successful',
          message: `Welcome ${decoded?.username}`,
          color: 'teal',
          autoClose: 5000,
        });
      } else {
        // Show an unauthorized access notification
        notifications.show({
          title: 'Not Authorized',
          message: 'You are not authorized to access this page',
          color: 'red',
          autoClose: 5000,
        });
      }
    } catch (err) {
      // Show a login failed notification if an error occurs
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
