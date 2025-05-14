import { Routes, Route, useLocation, useParams, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from '@/pages/Home';
import Calculator from '@/pages/Calculator';
import SavedLists from '@/pages/SavedLists';
import LoadListTemplates from '@/components/LoadListTemplates';
import TemplateEditor from '@/components/TemplateEditor';
import Admin from '@/pages/Admin';
import NavBar from '@/components/NavBar';
import ErrorBoundary from '@/components/ErrorBoundary';

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

function App() {
  const location = useLocation();
  console.log('📍 Current path:', location.pathname);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;

