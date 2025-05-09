import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <nav className="mb-6">
        <Link to="/" className="text-blue-500 mr-4 hover:underline">Home</Link>
        <Link to="/calculator" className="text-blue-500 hover:underline">Calculator</Link>
      </nav>
      <h1 className="text-3xl font-bold text-center mb-6">P1 Electrical Load Calculator</h1>
      <p className="text-center mb-4">This application helps you manage and calculate electrical loads for your facility.</p>
      <div className="flex justify-center">
        <Link to="/calculator" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Electrical Load Calculator
        </Link>
      </div>
    </div>
  );
}

export default Home;
