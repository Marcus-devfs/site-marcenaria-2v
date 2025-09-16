/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Product, Image, Testimonial } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  // Imagens - usando endpoint /filesweb
  getImages: async (): Promise<Image[]> => {
    const response = await api.get('/filesweb/all');
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

  // Envio de orçamento (antigo)
  sendQuote: async (data: any): Promise<any> => {
    const response = await api.post('/budget', { budget: data });
    return response.data;
  },

  // Orçamentos completos
  createQuoteComplete: async (data: any): Promise<any> => {
    const response = await api.post('/quote-complete', data);
    return response.data;
  },

  getQuoteComplete: async (): Promise<any[]> => {
    const response = await api.get('/quote-complete');
    return response.data;
  },

  uploadReferenceImages: async (formData: FormData): Promise<any> => {
    const response = await api.post('/quote-complete/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Configurações de preço
  getPriceConfigs: async (): Promise<any[]> => {
    const response = await api.get('/price-config');
    return response.data;
  },

  getPriceConfigsByEnvironment: async (environment: string): Promise<any[]> => {
    const response = await api.get(`/price-config/environment/${environment}`);
    return response.data;
  },

  calculateEstimatedPrice: async (environments: any[]): Promise<any> => {
    const response = await api.post('/price-config/calculate', { environments });
    return response.data;
  },

  // Admin - Price Config
  createPriceConfig: async (data: any): Promise<any> => {
    const response = await api.post('/price-config', data);
    return response.data;
  },

  updatePriceConfig: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/price-config/${id}`, data);
    return response.data;
  },

  deletePriceConfig: async (id: string): Promise<any> => {
    const response = await api.delete(`/price-config/${id}`);
    return response.data;
  },
};

export default api;
