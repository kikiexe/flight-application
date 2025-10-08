import { ArrowRight } from 'lucide-react';

export default function HeroSection({ onStart }) {
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
              onClick={onStart}
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
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <div className="flex gap-6 border-b border-gray-200">
              <button className="pb-3 px-2 text-sm font-medium text-red-600 border-b-2 border-red-600">
                Pesan penerbangan
              </button>
              <button className="pb-3 px-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Kelola pemesanan
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Dari</label>
              <input 
                type="text" 
                placeholder="Bandara keberangkatan"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Ke</label>
              <input 
                type="text" 
                placeholder="Bandara tujuan"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Tanggal</label>
              <input 
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-6 py-3 text-base font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors">
                Cari penerbangan
              </button>
            </div>
          </div>
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