'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiFileText, 
  FiImage, 
  FiMessageSquare, 
  FiUsers, 
  FiTrendingUp,
  FiEye,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalTestimonials: 0,
    totalImages: 0,
    totalPriceConfigs: 0,
    recentQuotes: [],
    recentTestimonials: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados em paralelo
      const [quotesResponse, testimonials, images, priceConfigs] = await Promise.all([
        apiService.getQuoteComplete(),
        apiService.getTestimonials(),
        apiService.getImages(),
        apiService.getPriceConfigs()
      ]);

      // Extrair dados dos orçamentos da resposta
      const quotes = Array.isArray(quotesResponse) ? quotesResponse : ((quotesResponse as any)?.data || []);
      
      console.log('Dashboard - Resposta dos orçamentos:', quotesResponse);
      console.log('Dashboard - Orçamentos extraídos:', quotes);
      console.log('Dashboard - Total de orçamentos:', Array.isArray(quotes) ? quotes.length : 0);

      setStats({
        totalQuotes: Array.isArray(quotes) ? quotes.length : 0,
        totalTestimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        totalImages: Array.isArray(images) ? images.length : 0,
        totalPriceConfigs: Array.isArray(priceConfigs) ? priceConfigs.length : 0,
        recentQuotes: Array.isArray(quotes) ? (quotes as any[]).slice(0, 5) : [],
        recentTestimonials: Array.isArray(testimonials) ? testimonials.slice(0, 5) : []
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Orçamentos',
      value: stats.totalQuotes,
      icon: FiFileText,
      color: 'bg-blue-500',
      description: 'Total de orçamentos solicitados'
    },
    {
      title: 'Depoimentos',
      value: stats.totalTestimonials,
      icon: FiMessageSquare,
      color: 'bg-green-500',
      description: 'Depoimentos de clientes'
    },
    {
      title: 'Imagens',
      value: stats.totalImages,
      icon: FiImage,
      color: 'bg-purple-500',
      description: 'Imagens na galeria'
    },
    {
      title: 'Configurações',
      value: stats.totalPriceConfigs,
      icon: FiDollarSign,
      color: 'bg-orange-500',
      description: 'Configurações de preço'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema administrativo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Orçamentos Recentes</h3>
            <p className="text-sm text-gray-600">Últimos orçamentos solicitados</p>
          </div>
          <div className="p-6">
            {stats.recentQuotes.length > 0 ? (
              <div className="space-y-4">
                {stats.recentQuotes.map((quote, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {quote.client?.name || 'Cliente'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {quote.client?.email || 'email@exemplo.com'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        R$ {quote.calculations?.estimatedTotalValue?.toLocaleString('pt-BR') || '0'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum orçamento encontrado</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Depoimentos Recentes</h3>
            <p className="text-sm text-gray-600">Últimos depoimentos de clientes</p>
          </div>
          <div className="p-6">
            {stats.recentTestimonials.length > 0 ? (
              <div className="space-y-4">
                {stats.recentTestimonials.map((testimonial, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiTrendingUp
                            key={i}
                            className={`w-4 h-4 ${
                              i < (testimonial.rating || 5)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {testimonial.clientName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {testimonial.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(testimonial.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum depoimento encontrado</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <FiDollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Configurar Preços</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FiImage className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Gerenciar Galeria</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <FiMessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Depoimentos</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <FiFileText className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Orçamentos</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
