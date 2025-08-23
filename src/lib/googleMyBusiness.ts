import axios from 'axios';
import { supabase } from './supabase';

export interface GoogleReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: string;
  updateTime: string;
}

export interface GoogleLocation {
  name: string;
  title?: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    regionCode?: string;
  };
  primaryPhone?: string;
  websiteUri?: string;
}

export interface GoogleMyBusinessConfig {
  clientId: string;
  clientSecret: string;
  locationId: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface SyncStats {
  imported: number;
  skipped: number;
  errors: number;
  lastSync: Date;
}

class GoogleMyBusinessService {
  private config: GoogleMyBusinessConfig;
  private baseUrl = 'https://mybusinessbusinessinformation.googleapis.com/v1';
  private maxRetries = 3;
  private retryDelay = 1000; // 1 segundo

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      locationId: import.meta.env.VITE_GOOGLE_MY_BUSINESS_LOCATION_ID || '',
    };

    if (!this.config.clientId || !this.config.clientSecret) {
      console.warn('Google My Business credentials not configured');
    }
  }

  /**
   * Método auxiliar para retry de requisições
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`Tentativa falhou, tentando novamente... (${retries} tentativas restantes)`);
        await this.delay(this.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Verifica se o erro é passível de retry
   */
  private isRetryableError(error: any): boolean {
    if (error?.response?.status) {
      const status = error.response.status;
      // Retry para erros de rede, rate limit, ou erros temporários do servidor
      return status >= 500 || status === 429 || status === 408;
    }
    return false;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Trata erros de autenticação
   */
  private handleAuthError(error: any): void {
    if (error?.response?.status === 401) {
      console.warn('Token expirado, limpando tokens armazenados');
      this.clearTokens();
    }
  }

  /**
   * Inicia o processo de autenticação OAuth2
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: `${window.location.origin}/admin/google/callback`,
      scope: scopes,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Troca o código de autorização por tokens de acesso
   */
  async exchangeCodeForTokens(code: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${window.location.origin}/admin/google/callback`
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao trocar código por tokens:', error);
      throw new Error('Falha na autenticação com Google');
    }
  }

  /**
   * Renova o token de acesso usando o refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      // Salva o novo token com timestamp
      this.saveTokens(response.data.access_token, refreshToken);
      return response.data.access_token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw new Error('Falha ao renovar token de acesso');
    }
  }

  /**
   * Obtém um token válido, renovando se necessário
   */
  async getValidAccessToken(): Promise<string | null> {
    const { accessToken, refreshToken } = this.getStoredTokens();
    
    if (!accessToken) return null;
    
    // Se o token não expirou, retorna ele
    if (!this.isTokenExpired()) {
      return accessToken;
    }
    
    // Se expirou mas temos refresh token, renova
    if (refreshToken) {
      try {
        return await this.refreshAccessToken(refreshToken);
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        this.clearTokens();
        return null;
      }
    }
    
    // Se não tem refresh token, limpa tudo
    this.clearTokens();
    return null;
  }

  /**
   * Lista as localizações do Google My Business
   */
  async getLocations(accessToken?: string): Promise<GoogleLocation[]> {
    try {
      let validToken = accessToken;
      
      // Se não foi passado um token, obtém um válido
      if (!validToken) {
        const token = await this.getValidAccessToken();
        if (!token) {
          throw new Error('Token de acesso não disponível');
        }
        validToken = token;
      }

      const response = await this.retryRequest(async () => {
        return await axios.get(
          `${this.baseUrl}/accounts/-/locations`,
          {
            headers: {
              Authorization: `Bearer ${validToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      const locations = response.data.locations || [];
      console.log(`✅ ${locations.length} localizações encontradas`);
      return locations;
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      this.handleAuthError(error);
      throw new Error('Falha ao buscar localizações do Google My Business');
    }
  }

  /**
   * Busca avaliações do Google My Business
   */
  async getReviews(accessToken?: string, locationId?: string): Promise<GoogleReview[]> {
    const targetLocationId = locationId || this.config.locationId;
    
    if (!targetLocationId) {
      throw new Error('ID da localização não configurado');
    }

    try {
      let validToken = accessToken;
      
      // Se não foi passado um token, obtém um válido
      if (!validToken) {
        const token = await this.getValidAccessToken();
        if (!token) {
          throw new Error('Token de acesso não disponível');
        }
        validToken = token;
      }

      const response = await this.retryRequest(async () => {
        return await axios.get(
          `https://mybusiness.googleapis.com/v4/accounts/-/locations/${targetLocationId}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${validToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      const reviews = response.data.reviews || [];
      console.log(`✅ ${reviews.length} avaliações encontradas para localização ${targetLocationId}`);
      return reviews;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      this.handleAuthError(error);
      throw new Error('Falha ao buscar avaliações do Google My Business');
    }
  }

  /**
   * Converte rating do Google para número
   */
  private convertStarRating(starRating: string): number {
    const ratingMap: { [key: string]: number } = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    };
    return ratingMap[starRating] || 5;
  }

  /**
   * Sincroniza avaliações do Google com o Supabase
   */
  async syncReviewsToSupabase(accessToken?: string, locationId?: string): Promise<SyncStats> {
    try {
      const startTime = new Date();
      console.log('🔄 Iniciando sincronização de avaliações...');
      
      const reviews = await this.getReviews(accessToken, locationId);
      let imported = 0;
      let skipped = 0;
      let errors = 0;

      if (reviews.length === 0) {
        console.log('📝 Nenhuma avaliação encontrada no Google My Business');
        return { imported, skipped, errors, lastSync: startTime };
      }

      console.log(`📋 Processando ${reviews.length} avaliações...`);

      // Processa as avaliações em lotes para melhor performance
      const batchSize = 10;
      for (let i = 0; i < reviews.length; i += batchSize) {
        const batch = reviews.slice(i, i + batchSize);
        
        for (const review of batch) {
          try {
            // Verifica se a avaliação já existe
            const { data: existingReview } = await supabase
              .from('testimonials')
              .select('id')
              .eq('google_review_id', review.reviewId)
              .single();

            if (existingReview) {
              skipped++;
              continue;
            }

            // Valida dados da avaliação
            if (!review.reviewer?.displayName) {
              console.warn(`⚠️ Avaliação sem nome do revisor: ${review.reviewId}`);
              errors++;
              continue;
            }

            // Insere nova avaliação
            const { error } = await supabase
              .from('testimonials')
              .insert({
                client_name: review.reviewer.displayName || 'Cliente Google',
                client_photo: review.reviewer.profilePhotoUrl || null,
                testimonial_text: review.comment || '',
                rating: this.convertStarRating(review.starRating),
                google_review_id: review.reviewId,
                is_featured: false,
                display_order: 0,
                created_at: new Date(review.createTime),
                updated_at: new Date(review.updateTime || review.createTime)
              });

            if (error) {
              console.error('❌ Erro ao inserir avaliação:', error);
              errors++;
            } else {
              imported++;
              console.log(`✅ Avaliação importada: ${review.reviewer.displayName} (${this.convertStarRating(review.starRating)} estrelas)`);
            }
          } catch (reviewError) {
            console.error('❌ Erro ao processar avaliação:', reviewError);
            errors++;
          }
        }

        // Pequeno delay entre lotes para não sobrecarregar
        if (i + batchSize < reviews.length) {
          await this.delay(100);
        }
      }

      const syncStats = { imported, skipped, errors, lastSync: new Date() };
      
      // Salva estatísticas da sincronização no localStorage
      localStorage.setItem('google_sync_stats', JSON.stringify(syncStats));
      
      console.log(`🎉 Sincronização concluída: ${imported} importadas, ${skipped} ignoradas, ${errors} erros`);
      return syncStats;
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      this.handleAuthError(error);
      throw new Error('Falha na sincronização das avaliações');
    }
  }

  /**
   * Salva os tokens no localStorage
   */
  saveTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem('google_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('google_refresh_token', refreshToken);
    }
    // Salva timestamp de quando o token foi criado para controle de expiração
    localStorage.setItem('google_token_timestamp', Date.now().toString());
  }

  /**
   * Recupera tokens do localStorage
   */
  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('google_access_token'),
      refreshToken: localStorage.getItem('google_refresh_token')
    };
  }

  /**
   * Verifica se o token de acesso está expirado (Google tokens duram 1 hora)
   */
  isTokenExpired(): boolean {
    const timestamp = localStorage.getItem('google_token_timestamp');
    if (!timestamp) return true;
    
    const tokenAge = Date.now() - parseInt(timestamp);
    const oneHour = 60 * 60 * 1000; // 1 hora em ms
    return tokenAge > oneHour;
  }

  /**
   * Remove tokens armazenados
   */
  clearTokens() {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_token_timestamp');
    localStorage.removeItem('google_sync_stats');
    console.log('🧹 Tokens do Google removidos');
  }

  /**
   * Obtém estatísticas da última sincronização
   */
  getLastSyncStats(): SyncStats | null {
    try {
      const stats = localStorage.getItem('google_sync_stats');
      if (stats) {
        const parsed = JSON.parse(stats);
        parsed.lastSync = new Date(parsed.lastSync);
        return parsed;
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas de sincronização:', error);
    }
    return null;
  }

  /**
   * Verifica se a conexão com Google está ativa
   */
  async isConnected(): Promise<boolean> {
    try {
      const token = await this.getValidAccessToken();
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações do usuário conectado
   */
  async getUserInfo(): Promise<any> {
    try {
      const token = await this.getValidAccessToken();
      if (!token) return null;

      const response = await this.retryRequest(async () => {
        return await axios.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  }
}

// Exportar instância única
const googleMyBusinessService = new GoogleMyBusinessService();
export default googleMyBusinessService;