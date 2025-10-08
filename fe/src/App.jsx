// fe/src/App.jsx

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import Features from './components/Features.jsx';
import CompensationScheme from './components/CompensationScheme.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleStartNowClick = () => {
    if (!isConnected) {
      open();
    } else {
      console.log("Wallet already connected, proceed to the main app...");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        isConnected={isConnected}
        address={address}
        onConnect={() => open()}
        onDisconnect={() => disconnect()}
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