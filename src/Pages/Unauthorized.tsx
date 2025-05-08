import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">401</h1>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
      <p className="text-gray-600 mb-6">
        Sorry, you don’t have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
