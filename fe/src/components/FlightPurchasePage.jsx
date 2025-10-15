// fe/src/components/FlightPurchasePage.jsx

import { useState } from 'react';
import { ArrowLeft, User, Ticket, ShieldCheck, Wallet } from 'lucide-react';

export default function FlightPurchasePage({
  flight,
  searchParams,
  onBack,
  onApprove,
  onMint,
  isApproving,
  isMinting,
  mintError,
  approveError,
  mintSuccess,
  mintedTokenId
}) {
  const [passengerName, setPassengerName] = useState('');

  // Handler untuk memastikan nama penumpang diisi sebelum approve/mint
  const handleApprove = () => {
    if (!passengerName.trim()) {
      alert('Silakan masukkan nama penumpang.');
      return;
    }
    onApprove();
  };

  const handleMint = () => {
    if (!passengerName.trim()) {
      alert('Silakan masukkan nama penumpang.');
      return;
    }
    onMint(passengerName);
  };


  if (!flight || !searchParams) return null;

  const { departure, destination, departureDate } = searchParams;
  const departureAirport = departure.split('(')[1].replace(')', '');
  const destinationAirport = destination.split('(')[1].replace(')', '');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Hasil Pencarian
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Kiri: Detail Penerbangan & Input Nama */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Detail Pemesanan</h1>

            {/* Detail Penerbangan */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{flight.airline}</span>
                <span className="text-sm text-gray-500">{flight.flightNumber}</span>
              </div>
              <div className="flex items-center justify-between text-center">
                <div>
                  <p className="text-xl font-semibold">{flight.departureTime}</p>
                  <p className="text-sm text-gray-500">{departureAirport}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <p className="text-xs text-gray-500">{flight.duration}</p>
                  <p className="text-xs text-gray-500">Langsung</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{flight.arrivalTime}</p>
                  <p className="text-sm text-gray-500">{destinationAirport}</p>
                </div>
              </div>
               <p className="text-sm text-gray-600 mt-2 text-center">
                {new Date(departureDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            </div>

            {/* Input Nama Penumpang */}
            <div className="mt-6">
              <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Penumpang (Sesuai KTP/Paspor)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="passengerName"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  disabled={mintSuccess}
                />
              </div>
            </div>
             {/* Asuransi */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-blue-800">Asuransi Penerbangan Otomatis</p>
                    <p className="text-sm text-blue-700">
                        Tiket ini sudah termasuk asuransi keterlambatan dan pembatalan berbasis *smart contract*. Klaim dan kompensasi diproses secara otomatis dan transparan.
                    </p>
                </div>
            </div>
          </div>

          {/* Kolom Kanan: Rincian Harga & Aksi */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold border-b pb-3 mb-3">Rincian Harga</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Harga Tiket (1 Dewasa)</span>
              <span className="font-semibold text-gray-900">
                {new Intl.NumberFormat('id-ID').format(flight.price)} IDRS
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-red-700 pt-3 border-t">
              <span>Total Pembayaran</span>
              <span>{new Intl.NumberFormat('id-ID').format(flight.price)} IDRS</span>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 space-y-3">
                {!mintSuccess ? (
                <>
                {/* Langkah 1: Approve */}
                <button
                    onClick={handleApprove}
                    disabled={isApproving || isMinting}
                    className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Wallet className="w-5 h-5" />
                    {isApproving ? 'Menyetujui...' : '1. Approve IDRS'}
                </button>
                 {approveError && (
                    <p className="text-xs text-red-600 text-center break-words">Approval Gagal: {approveError.shortMessage || approveError.message}</p>
                )}


                {/* Langkah 2: Mint Ticket */}
                <button
                    onClick={handleMint}
                    disabled={isApproving || isMinting}
                    className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Ticket className="w-5 h-5" />
                    {isMinting ? 'Mencetak Tiket...' : '2. Bayar & Mint Ticket'}
                </button>
                 {mintError && (
                    <p className="text-xs text-red-600 text-center break-words">Minting Gagal: {mintError.shortMessage || mintError.message}</p>
                )}
                </>
                ) : (
                <div className="text-center bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-800">Tiket Berhasil Dibuat!</h3>
                    <p className="text-sm text-green-700 mt-1">
                        Tiket digital Anda (NFT) dengan Token ID <strong>#{mintedTokenId.toString()}</strong> telah berhasil dicetak di blockchain.
                    </p>
                     <a
                        href={`https://sepolia.etherscan.io/`} // Ganti dengan URL explorer yang sesuai
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Lihat di Explorer
                    </a>
                </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}