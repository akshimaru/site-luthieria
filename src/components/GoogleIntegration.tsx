import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// Import dinâmico para evitar problemas no build
const loadGoogleService = async () => {
  try {
    const module = await import('../lib/googleMyBusiness');
    return module.default;
  } catch (error) {
    console.error('Erro ao carregar serviço Google:', error);
    return null;
  }
};

interface GoogleIntegrationProps {
  onReviewsUpdated?: () => void;
}

interface SyncStats {
  imported: number;
  skipped: number;
  errors: number;
  lastSync: Date;
}

interface UserInfo {
  name: string;
  email: string;
  picture?: string;
}

const GoogleIntegration: React.FC<GoogleIntegrationProps> = ({ onReviewsUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [googleService, setGoogleService] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);

  const initializeService = useCallback(async () => {
    const service = await loadGoogleService();
    if (service) {
      setGoogleService(service);
      
      // Carrega estatísticas da última sincronização
      const lastStats = service.getLastSyncStats();
      if (lastStats) {
        setSyncStats(lastStats);
      }
      
      // Verifica se há um token válido
      const validToken = await service.getValidAccessToken();
      if (validToken) {
        setIsAuthenticated(true);
        await loadLocations(service);
        await loadUserInfo(service);
      }
    }
  }, []);

  const loadUserInfo = async (service = googleService) => {
    if (!service) return;
    
    try {
      const info = await service.getUserInfo();
      if (info) {
        setUserInfo({
          name: info.name || info.email,
          email: info.email,
          picture: info.picture
        });
      }
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error);
    }
  };

  useEffect(() => {
    initializeService();
  }, [initializeService]);

  // Auto-sincronização opcional (a cada 24 horas)
  useEffect(() => {
    if (!isAutoSyncEnabled || !isAuthenticated || !googleService) return;

    const checkAutoSync = () => {
      const lastStats = googleService.getLastSyncStats();
      if (!lastStats) return;

      const now = new Date();
      const lastSync = new Date(lastStats.lastSync);
      const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

      // Se passou mais de 24 horas, faz sincronização automática
      if (hoursSinceSync >= 24 && !syncInProgress) {
        console.log('🔄 Iniciando sincronização automática...');
        handleSyncReviews();
      }
    };

    // Verifica a cada hora se precisa sincronizar
    const interval = setInterval(checkAutoSync, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAutoSyncEnabled, isAuthenticated, googleService, syncInProgress]);

  const handleAuthenticate = () => {
    if (!googleService) {
      toast.error('Serviço Google não disponível');
      return;
    }
    
    try {
      const authUrl = googleService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      toast.error('Erro ao iniciar autenticação');
    }
  };

  const loadLocations = async (service = googleService) => {
    if (!service) return;
    
    try {
      setIsLoading(true);
      const locationsList = await service.getLocations();
      setLocations(locationsList);
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
      // Se deu erro, pode ser que o token expirou
      setIsAuthenticated(false);
      service.clearTokens();
      toast.error('Sessão expirada. Faça login novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncReviews = async () => {
    if (!googleService) {
      toast.error('Serviço Google não disponível');
      return;
    }
    
    if (!selectedLocationId && locations.length > 1) {
      toast.error('Selecione uma localização');
      return;
    }

    try {
      setSyncInProgress(true);
      setIsLoading(true);
      
      const loadingToast = toast.loading('Sincronizando avaliações...');
      
      const stats = await googleService.syncReviewsToSupabase(
        undefined,
        selectedLocationId || locations[0]?.name?.split('/').pop()
      );
      
      setSyncStats(stats);
      toast.dismiss(loadingToast);
      
      if (stats.errors > 0) {
        toast.success(
          `Sincronização concluída com avisos!\n` +
          `✅ ${stats.imported} importadas\n` +
          `⚠️ ${stats.errors} erros\n` +
          `ℹ️ ${stats.skipped} já existiam`,
          { duration: 5000 }
        );
      } else if (stats.imported === 0) {
        toast.success(`Nenhuma nova avaliação encontrada.\n${stats.skipped} avaliações já existiam.`);
      } else {
        toast.success(
          `🎉 Sincronização concluída!\n` +
          `✅ ${stats.imported} novas avaliações importadas\n` +
          `ℹ️ ${stats.skipped} já existiam`
        );
      }
      
      onReviewsUpdated?.();
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar avaliações. Verifique sua conexão e tente novamente.');
      
      // Se for erro de autenticação, desconecta
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Token') || errorMessage.includes('401')) {
        setIsAuthenticated(false);
        setUserInfo(null);
        googleService.clearTokens();
        toast.error('Sessão expirada. Faça login novamente.');
      }
    } finally {
      setSyncInProgress(false);
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (googleService) {
      googleService.clearTokens();
    }
    setIsAuthenticated(false);
    setLocations([]);
    setSelectedLocationId('');
    setSyncStats(null);
    setUserInfo(null);
    toast.success('Desconectado do Google My Business');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        🔗 Integração Google My Business
        {isAuthenticated && (
          <span className="ml-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Conectado
          </span>
        )}
      </h3>
      
      {!isAuthenticated ? (
        <div>
          <p className="text-gray-600 mb-4">
            Conecte sua conta do Google My Business para importar avaliações automaticamente.
          </p>
          <button
            onClick={handleAuthenticate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Carregando...
              </>
            ) : (
              '🔗 Conectar com Google'
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="text-green-600 font-medium">✅ Conectado ao Google My Business</span>
              </div>
              {userInfo && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {userInfo.picture && (
                    <img 
                      src={userInfo.picture} 
                      alt={userInfo.name} 
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{userInfo.name}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-700 text-sm transition-colors"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleSyncReviews}
              className={`px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 ${
                syncInProgress 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              disabled={isLoading || syncInProgress || (locations.length > 1 && !selectedLocationId)}
            >
              {syncInProgress ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sincronizando...
                </>
              ) : (
                '🔄 Sincronizar Avaliações'
              )}
            </button>
          </div>

          {/* Toggle Auto-Sincronização */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">Sincronização Automática</label>
              <p className="text-xs text-gray-500">Sincroniza automaticamente a cada 24 horas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={isAutoSyncEnabled}
                onChange={(e) => setIsAutoSyncEnabled(e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                isAutoSyncEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                  isAutoSyncEnabled ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}></div>
              </div>
            </label>
          </div>

          {syncStats && (
            <div className={`p-3 border rounded-md ${
              syncStats.errors > 0 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm font-medium ${
                syncStats.errors > 0 ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {syncStats.errors > 0 ? '⚠️' : '✅'} Última sincronização: {syncStats.lastSync.toLocaleString()}
              </p>
              <div className="mt-1 text-sm text-gray-600 space-y-1">
                <div>📊 <strong>{syncStats.imported}</strong> importadas, <strong>{syncStats.skipped}</strong> já existiam</div>
                {syncStats.errors > 0 && (
                  <div className="text-yellow-700">⚠️ <strong>{syncStats.errors}</strong> erros encontrados</div>
                )}
              </div>
            </div>
          )}

          {locations.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                📍 <strong>{locations.length}</strong> localização(ões) encontrada(s)
              </p>
              {locations.length === 1 && locations[0].title && (
                <p className="text-sm text-blue-700 mt-1">
                  🏢 {locations[0].title}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleIntegration;
