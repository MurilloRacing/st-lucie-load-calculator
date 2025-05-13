import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import Home from './components/Home';
import Calculator from './components/Calculator';

import NewCalculator from './components/NewCalculator';
import SavedLists from './components/SavedLists';
import LoadListTemplates from './components/LoadListTemplates';
import TemplateEditor from './components/TemplateEditor'; // Add this import
import Admin from './components/Admin';

import './index.css';

// Wrapper to extract route params for TemplateEditor
const TemplateEditorWrapper = () => {
  const { templateId } = useParams();
  return <TemplateEditor templateId={templateId} />;
};

function App() {
  const location = useLocation();
  console.log('Current path:', location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/new" element={<NewCalculator />} />
        <Route path="/saved-lists" element={<SavedLists />} />
        <Route path="/load-lists" element={<LoadListTemplates />} />
        <Route path="/load-lists/:templateId" element={<TemplateEditorWrapper />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <div className="container mx-auto p-6 text-center">
              <h1 className="text-2xl font-bold">404 – Page Not Found</h1>
              <a href="/" className="text-blue-600 underline mt-4 inline-block">
                Go to Home
              </a>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

