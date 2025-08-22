import React, { useState, useEffect } from 'react';
import googleMyBusinessService from '../lib/googleMyBusiness';
import toast from 'react-hot-toast';

interface GoogleIntegrationProps {
  onReviewsUpdated?: () => void;
}

const GoogleIntegration: React.FC<GoogleIntegrationProps> = ({ onReviewsUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [syncStats, setSyncStats] = useState<{ imported: number; skipped: number } | null>(null);

  useEffect(() => {
    // Verifica se já está autenticado
    const { accessToken } = googleMyBusinessService.getStoredTokens();
    if (accessToken) {
      setIsAuthenticated(true);
      loadLocations();
    }
  }, []);

  const handleAuthenticate = () => {
    const authUrl = googleMyBusinessService.getAuthUrl();
    window.location.href = authUrl;
  };

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const { accessToken, refreshToken } = googleMyBusinessService.getStoredTokens();
      
      if (!accessToken) return;

      let currentAccessToken = accessToken;

      try {
        const locationsList = await googleMyBusinessService.getLocations(currentAccessToken);
        setLocations(locationsList);
      } catch (error) {
        // Tenta renovar o token se expirou
        if (refreshToken) {
          try {
            currentAccessToken = await googleMyBusinessService.refreshAccessToken(refreshToken);
            googleMyBusinessService.saveTokens(currentAccessToken);
            const locationsList = await googleMyBusinessService.getLocations(currentAccessToken);
            setLocations(locationsList);
          } catch (refreshError) {
            console.error('Erro ao renovar token:', refreshError);
            setIsAuthenticated(false);
            googleMyBusinessService.clearTokens();
            toast.error('Sessão expirada. Faça login novamente.');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
      toast.error('Erro ao carregar localizações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncReviews = async () => {
    if (!selectedLocationId && locations.length > 1) {
      toast.error('Selecione uma localização');
      return;
    }

    try {
      setIsLoading(true);
      const { accessToken, refreshToken } = googleMyBusinessService.getStoredTokens();
      
      if (!accessToken) {
        toast.error('Não autenticado');
        return;
      }

      let currentAccessToken = accessToken;

      try {
        const stats = await googleMyBusinessService.syncReviewsToSupabase(
          currentAccessToken, 
          selectedLocationId || locations[0]?.name?.split('/').pop()
        );
        setSyncStats(stats);
        toast.success(`Sincronização concluída! ${stats.imported} novas avaliações importadas.`);
        onReviewsUpdated?.();
      } catch (error) {
        // Tenta renovar o token se expirou
        if (refreshToken) {
          try {
            currentAccessToken = await googleMyBusinessService.refreshAccessToken(refreshToken);
            googleMyBusinessService.saveTokens(currentAccessToken);
            const stats = await googleMyBusinessService.syncReviewsToSupabase(
              currentAccessToken, 
              selectedLocationId || locations[0]?.name?.split('/').pop()
            );
            setSyncStats(stats);
            toast.success(`Sincronização concluída! ${stats.imported} novas avaliações importadas.`);
            onReviewsUpdated?.();
          } catch (refreshError) {
            console.error('Erro ao renovar token:', refreshError);
            setIsAuthenticated(false);
            googleMyBusinessService.clearTokens();
            toast.error('Sessão expirada. Faça login novamente.');
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar avaliações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    googleMyBusinessService.clearTokens();
    setIsAuthenticated(false);
    setLocations([]);
    setSelectedLocationId('');
    setSyncStats(null);
    toast.success('Desconectado do Google My Business');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">🔗 Integração Google My Business</h3>
      
      {!isAuthenticated ? (
        <div>
          <p className="text-gray-600 mb-4">
            Conecte sua conta do Google My Business para importar avaliações automaticamente.
          </p>
          <button
            onClick={handleAuthenticate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : '🔗 Conectar com Google'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-600 font-medium">✅ Conectado ao Google My Business</span>
            <button
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Desconectar
            </button>
          </div>

          {locations.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione a localização:
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecionar...</option>
                {locations.map((location) => (
                  <option key={location.name} value={location.name.split('/').pop()}>
                    {location.title || location.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSyncReviews}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading || (locations.length > 1 && !selectedLocationId)}
            >
              {isLoading ? '⏳ Sincronizando...' : '🔄 Sincronizar Avaliações'}
            </button>
          </div>

          {syncStats && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                ✅ Última sincronização: <strong>{syncStats.imported}</strong> importadas, <strong>{syncStats.skipped}</strong> ignoradas (já existentes)
              </p>
            </div>
          )}

          {locations.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                📍 {locations.length} localização(ões) encontrada(s)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleIntegration;
