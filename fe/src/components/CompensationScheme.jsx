import { AlertCircle, XCircle, Clock, CheckCircle } from 'lucide-react';

export default function CompensationScheme() {
  const schemes = [
    {
      title: 'Penerbangan Dibatalkan',
      percentage: '95%',
      icon: XCircle,
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Delay ≥ 6 Jam',
      percentage: '95%',
      icon: AlertCircle,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Delay 3-5 Jam',
      percentage: '15%',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'Delay 1-2 Jam',
      percentage: '5%',
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Skema Kompensasi
          </h2>
          <p className="text-lg text-gray-600">Dapatkan kompensasi sesuai kondisi penerbangan Anda</p>
        </div>
        
        <div className="space-y-4">
          {schemes.map((scheme, index) => {
            const Icon = scheme.icon;
            
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-red-600 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${scheme.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-900 text-lg">{scheme.title}</span>
                  </div>
                  
                  <span className="text-3xl font-bold text-red-600">
                    {scheme.percentage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-700 text-center">
            💡 Kompensasi otomatis ditransfer ke wallet Anda melalui smart contract
          </p>
        </div>
      </div>
    </section>
  );
}