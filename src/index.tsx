import ReactDOM from 'react-dom/client';
import React from 'react';

import GlobalStyle from './styles/GlobalStyle';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>
);
