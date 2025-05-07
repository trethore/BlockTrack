import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './lib/apollo/client.ts';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './components/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="blocktrack-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
