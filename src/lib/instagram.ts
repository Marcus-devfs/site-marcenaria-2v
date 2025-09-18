// Instagram Basic Display API Integration
// Documentação: https://developers.facebook.com/docs/instagram-basic-display-api

import { useState, useEffect } from 'react';

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  caption?: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramUser {
  id: string;
  username: string;
  account_type: 'PERSONAL' | 'BUSINESS';
  media_count: number;
}

export class InstagramService {
  private accessToken: string;
  private baseUrl = 'https://graph.instagram.com';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // Buscar informações do usuário
  async getUserInfo(): Promise<InstagramUser> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do usuário: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      throw error;
    }
  }

  // Buscar posts recentes
  async getRecentPosts(limit: number = 12): Promise<InstagramMedia[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/media?fields=id,media_type,media_url,caption,permalink,timestamp,thumbnail_url&limit=${limit}&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erro ao buscar posts do Instagram:', error);
      throw error;
    }
  }

  // Buscar posts com hashtag específica
  async getPostsByHashtag(hashtag: string, limit: number = 12): Promise<InstagramMedia[]> {
    try {
      // Nota: Para buscar por hashtag, você precisa usar a Instagram Graph API
      // Este é um exemplo de como seria com a Basic Display API
      const allPosts = await this.getRecentPosts(50); // Buscar mais posts
      
      // Filtrar posts que contenham a hashtag
      return allPosts.filter(post => 
        post.caption?.toLowerCase().includes(`#${hashtag.toLowerCase()}`)
      ).slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar posts por hashtag:', error);
      throw error;
    }
  }

  // Renovar token de acesso (importante para tokens de longa duração)
  async refreshAccessToken(): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro ao renovar token: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Erro ao renovar token de acesso:', error);
      throw error;
    }
  }

  // Converter dados do Instagram para formato da aplicação
  static transformInstagramData(instagramPosts: InstagramMedia[]): any[] {
    return instagramPosts.map(post => ({
      id: post.id,
      image: post.media_url,
      caption: post.caption || '',
      likes: 0, // Basic Display API não fornece likes
      comments: 0, // Basic Display API não fornece comentários
      date: post.timestamp,
      link: post.permalink,
      mediaType: post.media_type,
      thumbnail: post.thumbnail_url
    }));
  }
}

// Função helper para configurar o Instagram
export const setupInstagram = async () => {
  // 1. Configurar variáveis de ambiente
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('INSTAGRAM_ACCESS_TOKEN não configurado');
    return null;
  }

  // 2. Criar instância do serviço
  const instagramService = new InstagramService(accessToken);

  // 3. Testar conexão
  try {
    const userInfo = await instagramService.getUserInfo();
    console.log('✅ Instagram conectado:', userInfo.username);
    return instagramService;
  } catch (error) {
    console.error('❌ Erro ao conectar com Instagram:', error);
    return null;
  }
};

// Hook personalizado para usar no React
export const useInstagramPosts = (limit: number = 12) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const instagramService = await setupInstagram();
        if (!instagramService) {
          throw new Error('Instagram não configurado');
        }

        const instagramPosts = await instagramService.getRecentPosts(limit);
        const transformedPosts = InstagramService.transformInstagramData(instagramPosts);
        
        setPosts(transformedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar posts do Instagram:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
};
