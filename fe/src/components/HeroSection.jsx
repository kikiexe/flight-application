import { useState } from 'react';
import { ArrowRight, X, ChevronDown, Plane } from 'lucide-react';

export default function HeroSection({ onSearch }) {
  const [activeTab, setActiveTab] = useState('book');
  const [tripType, setTripType] = useState('round');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [travelClass, setTravelClass] = useState('Kelas Ekonomi');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // Daftar bandara di Indonesia
  const airports = [
    { code: 'CGK', city: 'Jakarta', name: 'Soekarno-Hatta' },
    { code: 'SUB', city: 'Surabaya', name: 'Juanda' },
    { code: 'DPS', city: 'Bali', name: 'Ngurah Rai' },
    { code: 'UPG', city: 'Makassar', name: 'Sultan Hasanuddin' },
    { code: 'KNO', city: 'Medan', name: 'Kualanamu' },
    { code: 'BTH', city: 'Batam', name: 'Hang Nadim' },
    { code: 'JOG', city: 'Yogyakarta', name: 'Adisucipto' },
    { code: 'SRG', city: 'Semarang', name: 'Ahmad Yani' },
    { code: 'BDO', city: 'Bandung', name: 'Husein Sastranegara' },
    { code: 'PLM', city: 'Palembang', name: 'Sultan Mahmud Badaruddin II' },
    { code: 'PKU', city: 'Pekanbaru', name: 'Sultan Syarif Kasim II' },
    { code: 'BPN', city: 'Balikpapan', name: 'Sultan Aji Muhammad Sulaiman' },
    { code: 'MDC', city: 'Manado', name: 'Sam Ratulangi' },
    { code: 'SOC', city: 'Solo', name: 'Adisumarmo' },
    { code: 'BDJ', city: 'Banjarmasin', name: 'Syamsudin Noor' },
  ];

  const filterAirports = (searchTerm) => {
    if (!searchTerm) return airports;
    const search = searchTerm.toLowerCase();
    return airports.filter(airport => 
      airport.city.toLowerCase().includes(search) ||
      airport.code.toLowerCase().includes(search) ||
      airport.name.toLowerCase().includes(search)
    );
  };

  const handleDepartureSelect = (airport) => {
    setDeparture(`${airport.city} (${airport.code})`);
    setShowDepartureDropdown(false);
  };

  const handleDestinationSelect = (airport) => {
    setDestination(`${airport.city} (${airport.code})`);
    setShowDestinationDropdown(false);
  };

  const handleSearch = () => {
    // 1. Kumpulkan semua data dari state ke dalam satu objek
    const searchData = { 
      departure, 
      destination, 
      departureDate, 
      returnDate,
      passengers, // Ini adalah state object yang sudah kita perbaiki, e.g., { adults: 1, children: 0 }
      travelClass,
      tripType
    };
    
    // 2. Panggil fungsi onSearch yang dikirim dari App.jsx dan teruskan datanya
    onSearch(searchData); 
  };

  const handlePassengerChange = (type, amount) => {
    setPassengers(prev => {
      const newCount = prev[type] + amount;
      // Prevent counts from going below 0 (or 1 for adults)
      if (type === 'adults' && newCount < 1) return prev;
      if (type === 'children' && newCount < 0) return prev;
      
      return { ...prev, [type]: newCount };
    });
  };

  return (
    <section className="bg-white">
      {/* Hero Image Area */}
      <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Terbang Tanpa Khawatir
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Asuransi penerbangan otomatis berbasis blockchain
            </p>
            <button 
              onClick={onSearch}
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search/Booking Form */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-6 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('book')}
                className={`pb-3 px-2 text-sm font-medium transition-colors ${
                  activeTab === 'book' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pesan penerbangan
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`pb-3 px-2 text-sm font-medium transition-colors ${
                  activeTab === 'manage' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kelola pemesanan
              </button>
            </div>
          </div>

          {activeTab === 'book' ? (
            <>
              {/* Trip Type Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setTripType('round')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    tripType === 'round'
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pulang-pergi
                </button>
                <button
                  onClick={() => setTripType('oneway')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    tripType === 'oneway'
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Sekali jalan
                </button>
                <button
                  onClick={() => setTripType('multi')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    tripType === 'multi'
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Multikota
                </button>
              </div>

              {/* Booking Form */}
              <div className="grid md:grid-cols-6 gap-4">
                {/* Departure Airport with Dropdown */}
                <div className="md:col-span-2 relative">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Bandara keberangkatan
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={departure}
                      onChange={(e) => {
                        setDeparture(e.target.value);
                        setShowDepartureDropdown(true);
                        setShowDestinationDropdown(false);
                        setShowPassengerDropdown(false);
                        setShowClassDropdown(false);
                      }}
                      onFocus={() => {
                        setShowDepartureDropdown(true);
                        setShowDestinationDropdown(false);
                        setShowPassengerDropdown(false);
                        setShowClassDropdown(false);
                      }}
                      placeholder="Jakarta (CGK)"
                      className="w-full px-4 py-3 pr-8 border border-gray-300 rounded focus:outline-none focus:border-red-600"
                    />
                    {departure && (
                      <button
                        onClick={() => {
                          setDeparture('');
                          setShowDepartureDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Departure Dropdown */}
                    {showDepartureDropdown && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto">
                        {filterAirports(departure).map((airport) => (
                          <button
                            key={airport.code}
                            onClick={() => handleDepartureSelect(airport)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <Plane className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {airport.city} ({airport.code})
                                </div>
                                <div className="text-xs text-gray-500">{airport.name}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Destination Airport with Dropdown */}
                <div className="md:col-span-2 relative">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Bandara kedatangan
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setShowDestinationDropdown(true);
                        setShowDepartureDropdown(false);
                        setShowPassengerDropdown(false);
                        setShowClassDropdown(false);
                      }}
                      onFocus={() => {
                        setShowDestinationDropdown(true);
                        setShowDepartureDropdown(false);
                        setShowPassengerDropdown(false);
                        setShowClassDropdown(false);
                      }}
                      placeholder="Bali (DPS)"
                      className="w-full px-4 py-3 pr-8 border border-gray-300 rounded focus:outline-none focus:border-red-600"
                    />
                    {destination && (
                      <button
                        onClick={() => {
                          setDestination('');
                          setShowDestinationDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Destination Dropdown */}
                    {showDestinationDropdown && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto">
                        {filterAirports(destination).map((airport) => (
                          <button
                            key={airport.code}
                            onClick={() => handleDestinationSelect(airport)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <Plane className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {airport.city} ({airport.code})
                                </div>
                                <div className="text-xs text-gray-500">{airport.name}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className={tripType === 'round' ? 'md:col-span-1' : 'md:col-span-2'}>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Berangkat
                  </label>
                  <input 
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>

                {tripType === 'round' && (
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Pulang
                    </label>
                    <input 
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
                    />
                  </div>
                )}

                {/* Passengers Dropdown */}
                <div className="relative">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                    Penumpang
                </label>
                <button
                    onClick={() => {
                    setShowPassengerDropdown(!showPassengerDropdown);
                    setShowClassDropdown(false);
                    setShowDepartureDropdown(false);
                    setShowDestinationDropdown(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600 flex items-center justify-between text-left"
                >
                    {/* Dynamically display passenger count */}
                    <span className="text-gray-900">
                    {passengers.adults} Dewasa{passengers.children > 0 ? `, ${passengers.children} Anak` : ''}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showPassengerDropdown && (
                    <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-4">
                    <div className="space-y-3">
                        {/* Adult Counter */}
                        <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Dewasa</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handlePassengerChange('adults', -1)} className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100">-</button>
                            <span className="w-8 text-center">{passengers.adults}</span>
                            <button onClick={() => handlePassengerChange('adults', 1)} className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100">+</button>
                        </div>
                        </div>
                        {/* Child Counter */}
                        <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Anak</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handlePassengerChange('children', -1)} className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100">-</button>
                            <span className="w-8 text-center">{passengers.children}</span>
                            <button onClick={() => handlePassengerChange('children', 1)} className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100">+</button>
                        </div>
                        </div>
                        <button
                        onClick={() => setShowPassengerDropdown(false)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                        >
                        Selesai
                        </button>
                    </div>
                    </div>
                )}
                </div>

                {/* Class Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Kelas
                  </label>
                  <button
                    onClick={() => {
                      setShowClassDropdown(!showClassDropdown);
                      setShowPassengerDropdown(false);
                      setShowDepartureDropdown(false);
                      setShowDestinationDropdown(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600 flex items-center justify-between text-left"
                  >
                    <span className="text-gray-900">{travelClass}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {showClassDropdown && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                      {['Kelas Ekonomi', 'Kelas Bisnis', 'First Class'].map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setTravelClass(cls);
                            setShowClassDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-4">
                <button className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1">
                  <span>Gunakan kode promosi</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <button 
                  onClick={handleSearch}
                  className="w-full md:w-auto px-12 py-3 text-base font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Cari penerbangan
                </button>
              </div>
            </>
          ) : (
            /* Manage Booking Tab */
            <div className="py-8 text-center">
              <p className="text-gray-600 mb-4">Kelola pemesanan Anda dengan mudah</p>
              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Kode booking"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
                />
                <input
                  type="text"
                  placeholder="Nama belakang"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
                />
                <button className="w-full px-6 py-3 text-base font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors">
                  Cari Pemesanan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '10,000+', label: 'Penerbangan Terlindungi' },
            { value: '95%', label: 'Kompensasi Otomatis' },
            { value: '<1 Menit', label: 'Proses Klaim' }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}