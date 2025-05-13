import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-6 py-10 bg-gray-50 min-h-screen">
      <nav className="mb-10 text-center">
        <Link to="/" className="text-blue-600 font-semibold mr-6 hover:underline">
          Home
        </Link>
        <Link to="/calculator" className="text-blue-600 font-semibold hover:underline">
          Calculator
        </Link>
      </nav>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          P1 Motor Club – Electrical Load Calculator
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Quickly estimate and manage power loads for your garage, shop, or commercial space.
        </p>

        <Link
          to="/calculator"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          ➕ Start New Load Calculation
        </Link>
      </div>
    </div>
  );
}

export default Home;
