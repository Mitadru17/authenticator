import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from '../src';
import App from './App';
import './styles.css';

// Render the app with AuthProvider
ReactDOM.render(
  <AuthProvider
    apiConfig={{
      baseURL: 'http://localhost:5000/api/auth',
    }}
    onLoginSuccess={(user) => {
      console.log('Login successful:', user);
    }}
    onLogout={() => {
      console.log('User logged out');
    }}
  >
    <App />
  </AuthProvider>,
  document.getElementById('root')
); 