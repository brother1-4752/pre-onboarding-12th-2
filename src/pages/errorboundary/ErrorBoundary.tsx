import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  const errorStatus = [
    { statusCode: 301, description: 'Moved permanently' },
    { statusCode: 304, description: 'Not modified' },
    { statusCode: 404, description: 'Resource not found' },
    { statusCode: 410, description: 'Gone' },
    { statusCode: 422, description: 'Validation failed, or the endpoint has been spammed' },
  ];

  if (isRouteErrorResponse(error)) {
    errorStatus.filter((errorObj) =>
      errorObj.statusCode === error.status ? (
        <div key={errorObj.statusCode}>
          <h1>Status Code : {errorObj.statusCode}</h1>

          <p>{errorObj.description}</p>
        </div>
      ) : (
        <div>범위 밖의 오류 발생</div>
      )
    );
  }

  return <div>알 수 없는 오류 발생</div>;
}
