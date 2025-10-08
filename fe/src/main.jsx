// fe/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import baru

import App from './App.jsx';
import { config } from './wagmi.js';
import './index.css';

// Buat instance QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiConfig config={config}>
      {/* Tambahkan QueryClientProvider di sini */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
  </StrictMode>,
);