import { Routes, Route, useLocation, useParams, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Component } from 'react';

import Home from '@/pages/Home';
import Calculator from '@/pages/Calculator';
import SavedLists from '@/pages/SavedLists';
import LoadListTemplates from '@/components/LoadListTemplates';
import TemplateEditor from '@/components/TemplateEditor';
import Admin from '@/pages/Admin';
import NavBar from '@/components/NavBar';

import './index.css';

// Custom 404 component
const NotFound = () => (
  <div className="container mx-auto p-6 text-center">
    <h1 className="text-2xl font-bold mb-4">404 – Page Not Found</h1>
    <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
      ← Back to Home
    </Link>
  </div>
);

// Route param wrapper for TemplateEditor
const TemplateEditorWrapper = () => {
  const { templateId } = useParams();
  return <TemplateEditor templateId={templateId} />;
};

class App extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/saved-lists" element={<SavedLists />} />
            <Route path="/load-lists" element={<LoadListTemplates />} />
            <Route path="/load-lists/:templateId" element={<TemplateEditorWrapper />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            className: 'text-sm',
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
          }}
        />
      </div>
    );
  }
}

export default App;

