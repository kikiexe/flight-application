import { Shield, Clock, CheckCircle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Otomatis & Aman',
      description: 'Smart contract blockchain memastikan klaim Anda diproses secara otomatis dan transparan.'
    },
    {
      icon: Clock,
      title: 'Klaim Instan',
      description: 'Dapatkan kompensasi langsung ke wallet Anda tanpa perlu menunggu berhari-hari.'
    },
    {
      icon: CheckCircle,
      title: 'Harga Transparan',
      description: 'Tidak ada biaya tersembunyi. Ketahui persis berapa kompensasi yang akan Anda terima.'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kenapa FlightGuard?
          </h2>
          <p className="text-lg text-gray-600">Solusi asuransi penerbangan berbasis blockchain</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}