import { Plane } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-semibold mb-4">Tentang Kami</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Tentang kami</a></li>
              <li><a href="#" className="hover:text-white">Karier</a></li>
              <li><a href="#" className="hover:text-white">Pusat Media</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Bantuan dan Kontak</a></li>
              <li><a href="#" className="hover:text-white">Pertanyaan umum</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Pesan</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Pesan penerbangan</a></li>
              <li><a href="#" className="hover:text-white">Layanan perjalanan</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kelola</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Kelola perjalanan Anda</a></li>
              <li><a href="#" className="hover:text-white">Status penerbangan</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-red-600 p-2 rounded">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">FlightGuard</span>
          </div>
          
          <p className="text-sm text-gray-400">
            © 2025 FlightGuard. Powered by Blockchain Technology
          </p>
        </div>
      </div>
    </footer>
  );
}