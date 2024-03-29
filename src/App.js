import React, { useEffect, useState } from 'react';
import { MantineProvider, Text } from '@mantine/core';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from 'react-redux';
import MainRoute from './routers/MainRoute';
import { Notifications } from '@mantine/notifications';
import AppHeader from './components/AppHeader';
import { AuthProvider } from './context/auth-context';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Notifications position="top-right" zIndex={2077} />
        <AppHeader />
        <Routes>
          <Route path="/*" element={<MainRoute />} />
        </Routes>
      </Router>
      </AuthProvider>


  );
}

export default App;

