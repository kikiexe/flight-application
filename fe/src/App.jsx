// fe/src/App.jsx

import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, decodeEventLog } from 'viem'; // <-- Tambahkan import decodeEventLog

import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import Features from './components/Features.jsx';
import CompensationScheme from './components/CompensationScheme.jsx';
import Footer from './components/Footer.jsx';
import FlightResultsPage from './components/FlightResultsPage';
import FlightPurchasePage from './components/FlightPurchasePage';

import { FLIGHT_INSURANCE_ADDRESS, FLIGHT_INSURANCE_ABI, IDRX_TOKEN_ADDRESS, ERC20_ABI } from './utils/contracts.js';

export default function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [view, setView] = useState('search'); // 'search', 'results', 'purchase'
  const [flightData, setFlightData] = useState({
    searchParams: null,
    results: [],
  });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState(null);

  // --- WAGMI Hooks untuk Interaksi Kontrak ---
  const { data: approveHash, error: approveError, isPending: isApproving, writeContract: approveContract } = useWriteContract();
  // Hilangkan `mintInitiated` karena tidak digunakan
  const { data: mintHash, error: mintError, isPending: isMinting, writeContract: mintContract } = useWriteContract();
  
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  // Gunakan hook ini untuk mendapatkan detail transaksi setelah berhasil
  const { data: mintReceipt, isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });

  // --- Fungsi Navigasi & Pencarian ---
  const handleFlightSearch = async (params) => {
    try {
      const response = await fetch('http://localhost:3000/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const results = await response.json();
      setFlightData({ searchParams: params, results: results });
      setView('results');
    } catch (error) {
      console.error("Gagal mengambil data penerbangan:", error);
    }
  };

  const handleBackToSearch = () => {
    setView('search');
    setFlightData({ searchParams: null, results: [] });
    setSelectedFlight(null);
    setMintedTokenId(null); // Reset juga tokenId
  };
  
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setView('purchase');
  };
  
  const handleBackToResults = () => {
    setView('results');
    setSelectedFlight(null);
    setMintedTokenId(null); // Reset juga tokenId
  }

  // --- Fungsi Interaksi Smart Contract ---
  const handleApprove = async () => {
    if (!selectedFlight) return;
    approveContract({
        address: IDRX_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [FLIGHT_INSURANCE_ADDRESS, parseEther(selectedFlight.price.toString())],
    });
  };

  const handleMintTicket = async (passengerName) => {
    if (!selectedFlight || !flightData.searchParams || !passengerName) return;

    const { departure, destination, departureDate } = flightData.searchParams;
    const departureTimestamp = Math.floor(new Date(departureDate).getTime() / 1000);

    mintContract({
        address: FLIGHT_INSURANCE_ADDRESS,
        abi: FLIGHT_INSURANCE_ABI,
        functionName: 'mintTicket',
        args: [
            passengerName,
            BigInt(selectedFlight.id),
            departure.split('(')[0].trim(),
            destination.split('(')[0].trim(),
            BigInt(departureTimestamp),
            parseEther(selectedFlight.price.toString())
        ],
    });
  };

  // --- useEffects untuk memproses hasil transaksi ---
  useEffect(() => {
    if (approveSuccess) {
        console.log("Approval berhasil!");
        alert("Approval token berhasil! Anda sekarang dapat melanjutkan untuk membayar dan mencetak tiket.");
    }
  }, [approveSuccess]);

  // *** BAGIAN BARU: Logika untuk mendapatkan Token ID setelah mint berhasil ***
  useEffect(() => {
    if (mintSuccess && mintReceipt) {
      console.log("Minting berhasil! Menganalisis log transaksi...");
      
      // Cari event 'TicketMinted' di log transaksi
      const ticketMintedLog = mintReceipt.logs.find(log => 
        log.address.toLowerCase() === FLIGHT_INSURANCE_ADDRESS.toLowerCase()
      );

      if (ticketMintedLog) {
        try {
          const decodedLog = decodeEventLog({
            abi: FLIGHT_INSURANCE_ABI,
            eventName: 'TicketMinted',
            data: ticketMintedLog.data,
            topics: ticketMintedLog.topics,
          });
          
          const { tokenId } = decodedLog.args;
          console.log('Ticket NFT berhasil dibuat dengan Token ID:', tokenId.toString());
          setMintedTokenId(tokenId); // <-- Gunakan setMintedTokenId di sini!
        } catch(e) {
            console.error("Gagal mendekode event log:", e);
        }
      } else {
        console.warn("Event 'TicketMinted' tidak ditemukan di log transaksi.");
      }
    }
  }, [mintSuccess, mintReceipt]);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        isConnected={isConnected}
        address={address}
        onConnect={() => open()}
        onDisconnect={() => disconnect()}
      />
      <main className="flex-grow">
        {view === 'search' && (
          <>
            <HeroSection onSearch={handleFlightSearch} />
            <Features />
            <CompensationScheme />
          </>
        )}
        {view === 'results' && (
          <FlightResultsPage 
            searchParams={flightData.searchParams}
            flights={flightData.results}
            onBack={handleBackToSearch}
            onSelectFlight={handleSelectFlight}
          />
        )}
         {view === 'purchase' && (
          <FlightPurchasePage
            flight={selectedFlight}
            searchParams={flightData.searchParams}
            onBack={handleBackToResults}
            onApprove={handleApprove}
            onMint={handleMintTicket}
            isApproving={isApproving}
            isMinting={isMinting}
            approveError={approveError}
            mintError={mintError}
            mintSuccess={mintSuccess}
            mintedTokenId={mintedTokenId}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}