// fe/src/App.jsx

import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract } from '@wagmi/core';
import { parseEther, decodeEventLog } from 'viem';

import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import Features from './components/Features.jsx';
import CompensationScheme from './components/CompensationScheme.jsx';
import Footer from './components/Footer.jsx';
import FlightResultsPage from './components/FlightResultsPage';
import FlightPurchasePage from './components/FlightPurchasePage';

import { FLIGHT_INSURANCE_ADDRESS, FLIGHT_INSURANCE_ABI, IDRS_TOKEN_ADDRESS, IDRS_ABI } from './utils/contracts.js';
import { config } from './wagmi.js';

export default function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // State untuk alur aplikasi
  const [view, setView] = useState('search'); // 'search', 'results', 'purchase'
  const [flightData, setFlightData] = useState({ searchParams: null, results: [] });
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  // State untuk interaksi kontrak
  const { data: approveHash, error: approveError, isPending: isApproving, writeContract: approveContract } = useWriteContract();
  const { data: mintHash, error: mintError, isPending: isMinting, writeContract: mintContract } = useWriteContract();
  
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { data: mintReceipt, isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });

  const [mintedTokenId, setMintedTokenId] = useState(null);
  
  // State baru untuk "Kelola Pemesanan"
  const [tokenIdToCheck, setTokenIdToCheck] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isCheckingTicket, setIsCheckingTicket] = useState(false);

  // Fungsi untuk mencari penerbangan
  const handleFlightSearch = async (params) => {
    try {
      const response = await fetch('http://localhost:3001/api/flights/search', {
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

  // Fungsi Navigasi
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
  };

  // Fungsi Interaksi Kontrak
  const handleApprove = async () => {
    if (!selectedFlight) return;
    approveContract({
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

  // Fungsi baru untuk mengecek tiket
  const handleCheckBooking = async () => {
    if (!tokenIdToCheck) {
      setSearchError("Silakan masukkan Token ID.");
      return;
    }
    if (!isConnected) {
      setSearchError("Silakan hubungkan dompet Anda terlebih dahulu.");
      return;
    }

    setIsCheckingTicket(true);
    setSearchError('');
    setTicketDetails(null);

    try {
      const ownerAddress = await readContract(config, {
        address: FLIGHT_INSURANCE_ADDRESS,
        abi: FLIGHT_INSURANCE_ABI,
        functionName: 'ownerOf',
        args: [BigInt(tokenIdToCheck)],
      });

      if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
        setSearchError("Anda bukan pemilik tiket dengan ID ini, atau ID tidak valid.");
        return;
      }

      const details = await readContract(config, {
        address: FLIGHT_INSURANCE_ADDRESS,
        abi: FLIGHT_INSURANCE_ABI,
        functionName: 'getTicketInfo', // Pastikan nama fungsi ini sesuai dengan di contract Anda
        args: [BigInt(tokenIdToCheck)],
      });

      setTicketDetails({
        id: tokenIdToCheck,
        passengerName: details.passengerName,
        flightInfo: `Penerbangan dari ${details.departureCity} ke ${details.destinationCity}`,
        departureTime: new Date(Number(details.departureDate) * 1000).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }),
        flightId: details.flightId.toString(),
      });

    } catch (error) {
      console.error("Gagal memeriksa tiket:", error);
      setSearchError("Gagal mengambil data. Pastikan ID benar dan Anda terhubung ke jaringan yang sesuai.");
    } finally {
      setIsCheckingTicket(false);
    }
  };

  // useEffect untuk memantau transaksi
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
            <HeroSection 
              onSearch={handleFlightSearch} 
              tokenIdToCheck={tokenIdToCheck}
              setTokenIdToCheck={setTokenIdToCheck}
              handleCheckBooking={handleCheckBooking}
              ticketDetails={ticketDetails}
              searchError={searchError}
              isCheckingTicket={isCheckingTicket}
            />
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
            isApproved={approveSuccess}
            mintSuccess={mintSuccess}
            mintedTokenId={mintedTokenId}
            txHash={mintHash}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}