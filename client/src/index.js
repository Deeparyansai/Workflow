import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast'; // Import Toaster from react-hot-toast

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <AuthProvider>
      <Toaster /> {/* Add Toaster here */}
      <App />
    </AuthProvider>
  </Provider>
);
