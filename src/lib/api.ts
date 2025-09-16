import axios from 'axios';
import { Product, Image, Testimonial } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Imagens
  getImages: async (): Promise<Image[]> => {
    const response = await api.get('/images');
    return response.data;
  },

  getImagesBySection: async (section: string): Promise<Image[]> => {
    const response = await api.get(`/images?section=${section}`);
    return response.data;
  },

  // Produtos
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Depoimentos
  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await api.get('/testimonials');
    return response.data;
  },

  // Envio de orçamento
  sendQuote: async (data: any): Promise<any> => {
    const response = await api.post('/quotes', data);
    return response.data;
  },
};

export default api;
