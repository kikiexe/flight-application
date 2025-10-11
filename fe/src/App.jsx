// fe/src/App.jsx

import { useState } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import Features from './components/Features.jsx';
import CompensationScheme from './components/CompensationScheme.jsx';
import Footer from './components/Footer.jsx';
import FlightResultsPage from './components/FlightResultsPage'; // <-- Impor komponen baru

export default function App() {
  // --- Bagian Wallet (dari kode Anda, tetap dipertahankan) ---
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // --- Bagian Baru: State untuk mengelola tampilan & data ---
  const [view, setView] = useState('search'); // 'search' atau 'results'
  const [flightData, setFlightData] = useState({
    searchParams: null,
    results: [],
  });

  // --- Bagian Baru: Fungsi untuk menangani pencarian penerbangan ---
  const handleFlightSearch = async (params) => {
    console.log('Frontend mengirim data ke backend:', params);

    try {
      const response = await fetch('http://localhost:3000/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const results = await response.json();
      console.log('Frontend menerima hasil:', results);
      
      setFlightData({ searchParams: params, results: results });
      setView('results'); // Ganti tampilan ke halaman hasil

    } catch (error) {
      console.error("Gagal mengambil data penerbangan:", error);
    }
  };

  const handleBackToSearch = () => {
    setView('search');
    setFlightData({ searchParams: null, results: [] });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header tetap sama, sudah menangani logika wallet */}
      <Header
        isConnected={isConnected}
        address={address}
        onConnect={() => open()}
        onDisconnect={() => disconnect()}
      />
      <main className="flex-grow">
        {/* Logika kondisional untuk menampilkan halaman */}
        {view === 'search' ? (
          <>
            {/* Mengirimkan fungsi handleFlightSearch ke HeroSection */}
            <HeroSection onSearch={handleFlightSearch} />
            <Features />
            <CompensationScheme />
          </>
        ) : (
          <FlightResultsPage 
            searchParams={flightData.searchParams}
            flights={flightData.results}
            onBack={handleBackToSearch}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}