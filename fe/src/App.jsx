// fe/src/App.jsx

import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, decodeEventLog } from 'viem';

import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import Features from './components/Features.jsx';
import CompensationScheme from './components/CompensationScheme.jsx';
import Footer from './components/Footer.jsx';
import FlightResultsPage from './components/FlightResultsPage';
import FlightPurchasePage from './components/FlightPurchasePage';

// --- PERBAIKAN: Impor variabel yang sudah benar ---
import { FLIGHT_INSURANCE_ADDRESS, FLIGHT_INSURANCE_ABI, IDRS_TOKEN_ADDRESS, IDRS_ABI } from './utils/contracts.js';

export default function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [view, setView] = useState('search'); // 'search', 'results', 'purchase'
  const [flightData, setFlightData] = useState({ searchParams: null, results: [] });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState(null);

  const { data: approveHash, error: approveError, isPending: isApproving, writeContract: approveContract } = useWriteContract();
  const { data: mintHash, error: mintError, isPending: isMinting, writeContract: mintContract } = useWriteContract();
  
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { data: mintReceipt, isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });

  const handleFlightSearch = async (params) => {
    try {
      const response = await fetch('http://localhost:3001/api/flights/search', { // Port disesuaikan ke 3001
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
    setMintedTokenId(null);
  };
  
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setView('purchase');
  };
  
  const handleBackToResults = () => {
      setView('results');
      setSelectedFlight(null);
      setMintedTokenId(null);
  }

  const handleApprove = async () => {
    if (!selectedFlight) return;
    approveContract({
        // --- PERBAIKAN: Menggunakan variabel yang benar ---
        address: IDRS_TOKEN_ADDRESS,
        abi: IDRS_ABI, 
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

  useEffect(() => {
    if (approveSuccess) {
        alert("Approval token berhasil! Anda sekarang dapat melanjutkan untuk membayar dan mencetak tiket.");
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (mintSuccess && mintReceipt) {
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
          setMintedTokenId(tokenId);
        } catch(e) {
            console.error("Gagal mendekode event log:", e);
        }
      }
    }
  }, [mintSuccess, mintReceipt]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header isConnected={isConnected} address={address} onConnect={() => open()} onDisconnect={() => disconnect()} />
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