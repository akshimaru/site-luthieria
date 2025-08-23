import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LocationFinder: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<{accessToken: string, refreshToken: string} | null>(null);

  const checkStoredTokens = () => {
    const stored = localStorage.getItem('google_my_business_tokens');
    if (stored) {
      const parsedTokens = JSON.parse(stored);
      setTokens(parsedTokens);
      toast.success('Tokens encontrados no localStorage!');
      return parsedTokens;
    }
    toast.error('Você precisa se conectar primeiro com Google My Business');
    return null;
  };

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const storedTokens = checkStoredTokens();
      if (!storedTokens) return;

      const response = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations', {
        headers: {
          'Authorization': `Bearer ${storedTokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit atingido. Aguarde alguns minutos e tente novamente.');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Localizações encontradas:', data);
      
      if (data.locations) {
        setLocations(data.locations);
        toast.success(`${data.locations.length} localização(ões) encontrada(s)!`);
      } else {
        toast.error('Nenhuma localização encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      toast.error('Erro ao buscar localizações: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyLocationId = (location: any) => {
    const locationId = location.name.split('/').pop();
    navigator.clipboard.writeText(locationId);
    toast.success('Location ID copiado para área de transferência!');
    console.log('Location ID:', locationId);
    console.log('Nome da localização:', location.title);
    console.log('Endereço:', location.storefrontAddress);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">🔍 Descobrir Location ID</h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Instruções:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Primeiro conecte com Google My Business (botão acima)</li>
            <li>2. Depois clique em "Buscar Localizações" abaixo</li>
            <li>3. Copie o Location ID da sua luthieria</li>
            <li>4. Configure no Easypanel: VITE_GOOGLE_MY_BUSINESS_LOCATION_ID</li>
          </ol>
        </div>

        <button
          onClick={fetchLocations}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            loading 
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Buscando...' : '🔍 Buscar Localizações'}
        </button>

        {tokens && (
          <div className="bg-green-50 p-3 rounded text-sm text-green-800">
            ✅ Conectado com Google My Business
          </div>
        )}

        {locations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Suas Localizações:</h4>
            {locations.map((location, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{location.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {location.storefrontAddress?.addressLines?.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      Location ID: {location.name.split('/').pop()}
                    </p>
                  </div>
                  <button
                    onClick={() => copyLocationId(location)}
                    className="bg-amber-900 text-white px-3 py-1 rounded text-sm hover:bg-amber-800"
                  >
                    📋 Copiar ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {locations.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-semibold text-yellow-900 mb-2">⚙️ Configuração:</h5>
            <p className="text-sm text-yellow-800 mb-2">
              Copie o Location ID e configure no Easypanel:
            </p>
            <code className="bg-yellow-100 px-2 py-1 rounded text-sm">
              VITE_GOOGLE_MY_BUSINESS_LOCATION_ID={locations[0]?.name.split('/').pop()}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFinder;
