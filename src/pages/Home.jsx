import { Link } from 'react-router-dom';

const Home = () => (
  <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow rounded">
    <h1 className="text-3xl font-bold mb-4 text-center">📊 P1 Load Calculator</h1>
    <p className="mb-6 text-gray-700 text-center">
      Use this tool to build and manage electrical load templates for P1 Motor Club units.
    </p>
    <div className="flex flex-col gap-4">
      <Link
        to="/calculator"
        className="bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
      >
        ⚙️ Start New Calculation
      </Link>
      <Link
        to="/saved-lists"
        className="bg-green-600 text-white text-center py-2 rounded hover:bg-green-700"
      >
        💾 View Saved Lists
      </Link>
      <Link
        to="/load-lists"
        className="bg-purple-600 text-white text-center py-2 rounded hover:bg-purple-700"
      >
        📂 View Load Templates
      </Link>
      <Link
        to="/admin"
        className="bg-gray-800 text-white text-center py-2 rounded hover:bg-gray-900"
      >
        🔐 Admin Tools
      </Link>
    </div>
  </div>
);

export default Home;
