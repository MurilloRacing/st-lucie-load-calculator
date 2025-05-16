import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Error tracking for development
if (process.env.NODE_ENV === 'development') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
  };

  // Additional React Error Boundary fallback
  window.onunhandledrejection = (event) => {
    console.error('Unhandled Promise rejection:', event.reason);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'text-sm font-medium',
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
            icon: '✅',
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
            icon: '❌',
          },
          loading: {
            style: {
              background: '#6B7280',
              color: 'white',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
