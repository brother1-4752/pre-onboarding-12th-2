import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from '../App';
import { ErrorBoundary, IssueDetail, IssueList } from '../pages';
import { get_react_issue_detail, get_react_issues_list } from '../api/getReactIssuesInfo';

interface IRouter {
  path: string;
  element: React.ReactNode;
  errorElement?: React.ReactNode;
  children?: IRouter[];
  loader?: (() => any) | (({ params }: any) => any);
}

const routerData: IRouter[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '',
        element: <IssueList />,
        loader: async () => get_react_issues_list(),
      },
      {
        path: '/issue/:id',
        element: <IssueDetail />,
        loader: async ({ params }) => get_react_issue_detail(params.id),
      },
    ],
  },
];

const router = createBrowserRouter(routerData);

export default router;
