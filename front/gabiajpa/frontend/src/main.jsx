import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ← 여기 연결 중요
import './index.css'; // tailwind가 여기에 적용돼야 함

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);