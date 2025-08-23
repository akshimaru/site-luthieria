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

export interface GoogleMyBusinessConfig {
  clientId: string;
  clientSecret: string;
  locationId: string;
  accessToken?: string;
  refreshToken?: string;
}

class GoogleMyBusinessService {
  private config: GoogleMyBusinessConfig;
  private baseUrl = 'https://mybusinessbusinessinformation.googleapis.com/v1';
  private lastRequestTime = 0;
  private readonly REQUEST_COOLDOWN = 2000; // 2 segundos entre requisições

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      locationId: import.meta.env.VITE_GOOGLE_MY_BUSINESS_LOCATION_ID || '',
    };
  }

  /**
   * Aplica cooldown entre requisições para evitar rate limiting
   */
  private async applyCooldown(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.REQUEST_COOLDOWN) {
      const waitTime = this.REQUEST_COOLDOWN - timeSinceLastRequest;
      console.log(`⏳ Aguardando ${waitTime}ms para evitar rate limiting...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
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
  async getLocations(accessToken?: string): Promise<any[]> {
    // Verifica se ainda estamos em rate limit
    if (this.isRateLimited()) {
      throw new Error('Rate limit ativo. Aguarde alguns minutos antes de tentar novamente.');
    }

    try {
      // Aplica cooldown para evitar rate limiting
      await this.applyCooldown();
      
      let validToken = accessToken;
      
      // Se não foi passado um token, obtém um válido
      if (!validToken) {
        const token = await this.getValidAccessToken();
        if (!token) {
          throw new Error('Token de acesso não disponível');
        }
        validToken = token;
      }

      const response = await axios.get(
        `${this.baseUrl}/accounts/-/locations`,
        {
          headers: {
            Authorization: `Bearer ${validToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 segundos de timeout
        }
      );

      return response.data.locations || [];
    } catch (error: any) {
      console.error('Erro ao buscar localizações:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response) {
        const status = error.response.status;
        
        if (status === 429) {
          this.setRateLimit(5); // 5 minutos de cooldown
          throw new Error('Muitas requisições. Aguarde 5 minutos antes de tentar novamente.');
        } else if (status === 401 || status === 403) {
          throw new Error('Token expirado ou inválido');
        } else {
          throw new Error(`Erro da API Google (${status}): ${error.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        throw new Error('Erro de conexão com Google. Verifique sua internet.');
      } else {
        throw new Error('Falha ao buscar localizações do Google My Business');
      }
    }
  }

  /**
   * Busca avaliações do Google My Business
   */
  async getReviews(accessToken?: string, locationId?: string): Promise<GoogleReview[]> {
    let targetLocationId = locationId || this.config.locationId;
    
    if (!targetLocationId) {
      throw new Error('ID da localização não configurado');
    }

    // Normaliza o locationId para diferentes formatos possíveis
    targetLocationId = this.normalizeLocationId(targetLocationId);

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

      const response = await axios.get(
        `https://mybusiness.googleapis.com/v4/accounts/-/locations/${targetLocationId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${validToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.reviews || [];
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw new Error('Falha ao buscar avaliações do Google My Business');
    }
  }

  /**
   * Descobre automaticamente o Location ID correto
   */
  async discoverLocationId(accessToken?: string): Promise<string | null> {
    try {
      const locations = await this.getLocations(accessToken);
      
      if (locations.length === 0) {
        console.warn('Nenhuma localização encontrada');
        return null;
      }
      
      // Se há apenas uma localização, usa ela
      if (locations.length === 1) {
        const locationId = locations[0].name.split('/').pop();
        console.log('🎯 Location ID descoberto automaticamente:', locationId);
        return locationId;
      }
      
      // Se há múltiplas, tenta encontrar a que corresponde ao ID configurado
      const configuredId = this.config.locationId;
      if (configuredId) {
        const matchingLocation = locations.find(loc => {
          const locId = loc.name.split('/').pop();
          return locId === configuredId || locId === this.normalizeLocationId(configuredId);
        });
        
        if (matchingLocation) {
          const locationId = matchingLocation.name.split('/').pop();
          console.log('✅ Location ID encontrado nas localizações:', locationId);
          return locationId;
        }
      }
      
      // Lista todas as localizações disponíveis
      console.log('📍 Localizações disponíveis:');
      locations.forEach((loc, index) => {
        const locId = loc.name.split('/').pop();
        console.log(`  ${index + 1}. ${loc.title || loc.displayName || 'Sem nome'} (ID: ${locId})`);
      });
      
      // Retorna a primeira como fallback
      const firstLocationId = locations[0].name.split('/').pop();
      console.log('⚠️ Usando primeira localização como fallback:', firstLocationId);
      return firstLocationId;
      
    } catch (error) {
      console.error('Erro ao descobrir Location ID:', error);
      return null;
    }
  }
   */
  private normalizeLocationId(locationId: string): string {
    // Remove prefixos se existirem
    if (locationId.startsWith('locations/')) {
      return locationId.substring(10);
    }
    
    // Se já contém accounts/, usa como está
    if (locationId.includes('accounts/')) {
      return locationId.split('/locations/')[1] || locationId;
    }
    
    // Retorna o ID numérico limpo
    return locationId;
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
  async syncReviewsToSupabase(accessToken?: string, locationId?: string): Promise<{ imported: number; skipped: number }> {
    try {
      const reviews = await this.getReviews(accessToken, locationId);
      let imported = 0;
      let skipped = 0;

      for (const review of reviews) {
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
            display_order: 0
          });

        if (error) {
          console.error('Erro ao inserir avaliação:', error);
          skipped++;
        } else {
          imported++;
        }
      }

      return { imported, skipped };
    } catch (error) {
      console.error('Erro na sincronização:', error);
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
    localStorage.removeItem('google_rate_limit_until'); // Remove também rate limit
  }

  /**
   * Verifica se ainda estamos em rate limit
   */
  isRateLimited(): boolean {
    const rateLimitUntil = localStorage.getItem('google_rate_limit_until');
    if (!rateLimitUntil) return false;
    
    return Date.now() < parseInt(rateLimitUntil);
  }

  /**
   * Define período de rate limit
   */
  setRateLimit(minutes: number = 5) {
    const rateLimitUntil = Date.now() + (minutes * 60 * 1000);
    localStorage.setItem('google_rate_limit_until', rateLimitUntil.toString());
  }
}

// Exportar instância única
const googleMyBusinessService = new GoogleMyBusinessService();
export default googleMyBusinessService;