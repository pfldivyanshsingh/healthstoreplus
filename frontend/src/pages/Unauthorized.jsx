import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Unauthorized Access</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
