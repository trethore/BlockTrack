import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // Your global styles including Tailwind
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider.tsx'; // Import ThemeProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="blocktrack-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
