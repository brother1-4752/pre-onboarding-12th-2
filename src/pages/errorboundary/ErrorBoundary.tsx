import { Suspense } from 'react';

export default function ErrorBoundary() {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');

  const errorStatus = [
    { statusCode: 301, description: 'Moved permanently' },
    { statusCode: 304, description: 'Not modified' },
    { statusCode: 404, description: 'Resource not found' },
    { statusCode: 410, description: 'Gone' },
    {
      statusCode: 422,
      description: 'Validation failed, or the endpoint has been spammed',
    },
  ];

  const ErrorBondary =
    status &&
    errorStatus
      .filter((errorObj) => errorObj.statusCode === parseInt(status))
      .map((targetObj) => (
        <div key={targetObj.statusCode}>
          <h1>Status Code : {targetObj.statusCode}</h1>

          <p>{targetObj['description']}</p>
        </div>
      ));

  return (
    <Suspense fallback={<div>...Status Code 파악 중에 있습니다...</div>}>
      {ErrorBondary}
    </Suspense>
  );
}
