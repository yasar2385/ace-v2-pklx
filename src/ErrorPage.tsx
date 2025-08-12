// ErrorPage.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                <h1>{error.status}</h1>
                <p>{error.statusText}</p>
                <button
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/'}
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <button
                className="btn btn-primary"
                onClick={() => window.location.href = '/'}
            >
                Go to Home
            </button>
        </div>
    );
}

export default ErrorPage;