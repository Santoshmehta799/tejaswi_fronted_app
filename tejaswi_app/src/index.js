import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from './utils/theme';
import { Provider } from 'react-redux';
import store from './app/store';
import SnackbarComponent from './components/SnackbarComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SnackbarComponent />
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
