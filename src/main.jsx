import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {console.log('Book RPG v1.0.0')}
    <App />
  </React.StrictMode>
);
