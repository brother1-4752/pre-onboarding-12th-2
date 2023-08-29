import { createBrowserRouter } from 'react-router-dom';
import React from 'react';

import { Detail, ErrorBoundary, Home } from '../pages';
import App from '../App';

interface IRouter {
  path: string;
  element: React.ReactNode;
  errorElement?: React.ReactNode;
  children?: IRouter[];
}

const routerData: IRouter[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/detail/:id',
        element: <Detail />,
      },
    ],
  },
];

const router = createBrowserRouter(routerData);

export default router;
