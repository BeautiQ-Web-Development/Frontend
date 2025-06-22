import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#075B5E', // Deep teal
      dark: '#054548',
      light: '#2A7B7E',
    },
    secondary: {
      main: '#E6F7F8', // Light teal instead of white
      dark: '#CCF0F2',
      light: '#F0FAFB',
    },
    background: {
      default: '#F8F8FF', // Off white background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A', // Very dark text for excellent readability
      secondary: '#2E2E2E', // Dark grey for secondary text
    },
    accent: {
      main: '#E6F7F8', // Very light teal
      light: '#F0FAFB',
      dark: '#CCF0F2',
    },
    neutral: {
      main: '#F0F0F5', // Light off-white
      light: '#F8F8FF',
      dark: '#E0E0EB',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#075B5E',
    },
    h2: {
      fontWeight: 600,
      color: '#075B5E',
    },
    h3: {
      fontWeight: 600,
      color: '#075B5E',
    },
    h4: {
      fontWeight: 600,
      color: '#075B5E',
    },
    h5: {
      fontWeight: 600,
      color: '#075B5E',
    },
    h6: {
      fontWeight: 600,
      color: '#075B5E',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);