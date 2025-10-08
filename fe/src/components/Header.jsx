import { Plane } from 'lucide-react';

export default function Header({ isConnected, address, onConnect }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-2 rounded">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">FlightGuard</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-red-600 transition-colors">Pesan</a>
          <a href="#" className="hover:text-red-600 transition-colors">Kelola</a>
          <a href="#" className="hover:text-red-600 transition-colors">Pengalaman</a>
          <a href="#" className="hover:text-red-600 transition-colors">Bantuan</a>
        </nav>
        
        <button
          onClick={onConnect}
          className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          {isConnected ? formatAddress(address) : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}