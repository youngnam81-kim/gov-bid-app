// src/index.js (main.jsx 역할)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store'; // Redux Store 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}> {/* Redux Store를 App 컴포넌트에 주입 */}
    <App />
  </Provider>
  // </React.StrictMode>
);