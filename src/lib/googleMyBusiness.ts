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

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      locationId: import.meta.env.VITE_GOOGLE_MY_BUSINESS_LOCATION_ID || '',
    };
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
        redirect_uri: `${window.location.origin}/admin/google-auth`
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

      return response.data.access_token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw new Error('Falha ao renovar token de acesso');
    }
  }

  /**
   * Lista as localizações do Google My Business
   */
  async getLocations(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/accounts/-/locations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.locations || [];
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      throw new Error('Falha ao buscar localizações do Google My Business');
    }
  }

  /**
   * Busca avaliações do Google My Business
   */
  async getReviews(accessToken: string, locationId?: string): Promise<GoogleReview[]> {
    const targetLocationId = locationId || this.config.locationId;
    
    if (!targetLocationId) {
      throw new Error('ID da localização não configurado');
    }

    try {
      const response = await axios.get(
        `https://mybusiness.googleapis.com/v4/accounts/-/locations/${targetLocationId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
  async syncReviewsToSupabase(accessToken: string, locationId?: string): Promise<{ imported: number; skipped: number }> {
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
   * Remove tokens armazenados
   */
  clearTokens() {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
  }
}

// Exportar instância única
const googleMyBusinessService = new GoogleMyBusinessService();
export default googleMyBusinessService;