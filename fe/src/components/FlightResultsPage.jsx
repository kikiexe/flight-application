// fe/src/components/FlightResultsPage.jsx

import { ArrowLeft, Plane } from 'lucide-react';

export default function FlightResultsPage({ searchParams, flights, onBack, onSelectFlight }) {
  if (!searchParams) return null;

  const { departure, destination, departureDate } = searchParams;

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 mb-4 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Ubah Pencarian
          </button>
          <div className="flex flex-wrap items-center gap-x-4">
            <h1 className="text-3xl font-bold text-gray-900">{departure.split('(')[0]}</h1>
            <Plane className="w-6 h-6 text-gray-400" />
            <h1 className="text-3xl font-bold text-gray-900">{destination.split('(')[0]}</h1>
          </div>
          <p className="text-gray-600 mt-1">
            {new Date(departureDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-4">
          {flights && flights.length > 0 ? (
            flights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4 transition hover:shadow-lg">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-lg">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-center">
                    <div>
                      <p className="text-xl font-semibold">{flight.departureTime}</p>
                      <p className="text-sm text-gray-500">{departure.split('(')[1].replace(')', '')}</p>
                    </div>
                    <div className="flex-1 mx-4">
                      <p className="text-xs text-gray-500">{flight.duration}</p>
                      <p className="text-xs text-gray-500">Langsung</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{flight.arrivalTime}</p>
                      <p className="text-sm text-gray-500">{destination.split('(')[1].replace(')', '')}</p>
                    </div>
                  </div>
                </div>
                <div className="md:border-l md:pl-6 border-gray-200 w-full md:w-auto text-center mt-4 md:mt-0">
                  <p className="text-2xl font-bold text-red-700">
                    {new Intl.NumberFormat('id-ID').format(flight.price)} IDRS
                  </p>
                  <p className="text-xs text-gray-500 mb-3">/orang</p>
                  <button 
                    onClick={() => onSelectFlight(flight)}
                    className="w-full px-8 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Pilih
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="font-semibold text-gray-800">Penerbangan tidak ditemukan.</p>
              <p className="text-sm text-gray-600">Silakan coba ubah tanggal atau rute pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}