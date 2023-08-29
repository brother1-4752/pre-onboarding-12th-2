import ReactDOM from 'react-dom/client';
import React from 'react';

import GlobalStyle from '../styles/GlobalStyle';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
