import { useState, useEffect } from 'react';

import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import Features from './components/Features.jsx';
import CompensationScheme from './components/CompensationScheme.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };
  
  const handleStartNowClick = () => {
    if (!isConnected) {
      connectWallet();
    } else {
      console.log("Wallet already connected, proceed to the main app...");
    }
  };
  
  useEffect(() => {
    const checkInitialConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    };
    checkInitialConnection();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isConnected={isConnected} 
        address={address} 
        onConnect={connectWallet} 
      />
      <main>
        <HeroSection onStart={handleStartNowClick} />
        <Features />
        <CompensationScheme />
      </main>
      <Footer />
    </div>
  );
}