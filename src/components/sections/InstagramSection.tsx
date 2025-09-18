'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiHeart, FiMessageCircle, FiShare2, FiExternalLink } from 'react-icons/fi';
import { useInstagramPosts } from '@/lib/instagram';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  link: string;
}

const InstagramSection = () => {
  // Usar hook personalizado para buscar posts reais do Instagram
  const { posts: realPosts, loading: realLoading, error: realError } = useInstagramPosts(8);
  
  // Posts de fallback caso não consiga conectar com Instagram
  const fallbackPosts: InstagramPost[] = [
    {
      id: '1',
      image: '/parceiros/arq_lura.jpeg',
      caption: 'Projeto de cozinha planejada finalizado! ✨ Madeira nobre com acabamento perfeito. #marcenaria #cozinhaplanejada',
      likes: 45,
      comments: 12,
      date: '2024-01-15',
      link: 'https://instagram.com/p/example1'
    },
    {
      id: '2',
      image: '/parceiros/arquiteia.jpeg',
      caption: 'Quarto completo com guarda-roupa sob medida. Cada detalhe pensado para otimizar o espaço! 🏠 #quarto #guardaroupa',
      likes: 38,
      comments: 8,
      date: '2024-01-12',
      link: 'https://instagram.com/p/example2'
    },
    {
      id: '3',
      image: '/parceiros/cachi.jpeg',
      caption: 'Sala de estar com móveis rústicos. Tradição e qualidade em cada peça! 🌿 #sala #rustico #madeira',
      likes: 52,
      comments: 15,
      date: '2024-01-10',
      link: 'https://instagram.com/p/example3'
    },
    {
      id: '4',
      image: '/parceiros/meyer.jpeg',
      caption: 'Escritório moderno e funcional. Produtividade e estilo em harmonia! 💼 #escritorio #moderno',
      likes: 29,
      comments: 6,
      date: '2024-01-08',
      link: 'https://instagram.com/p/example4'
    }
  ];

  // Usar posts reais se disponíveis, senão usar fallback
  const posts = realPosts.length > 0 ? realPosts : fallbackPosts;
  const loading = realLoading;
  const error = realError;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateCaption = (caption: string, maxLength: number = 100) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Mostrar aviso se houver erro na conexão com Instagram
  if (error && realPosts.length === 0) {
    console.warn('⚠️ Instagram não conectado, usando posts de exemplo:', error);
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <FiInstagram className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-800">
              Conheça Nosso Instagram
            </h2>
          </div>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Acompanhe nossos projetos em tempo real, dicas de decoração e muito mais!
          </p>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {posts.map((post: InstagramPost, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={'https://www.instagram.com/m.f.planejados/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-colors"
                    >
                      <FiExternalLink className="w-5 h-5 text-primary-500" />
                    </a>
                  </div>
                </div>

                {/* Instagram Icon */}
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-1.5">
                  <FiInstagram className="w-4 h-4 text-primary-500" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Caption */}
                <p className="text-sm text-secondary-700 mb-3 line-clamp-3">
                  {truncateCaption(post.caption)}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-secondary-500 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FiHeart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <span>{formatDate(post.date)}</span>
                </div>

                {/* Action Button */}
                <a
                  href={'https://www.instagram.com/m.f.planejados/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiInstagram className="w-4 h-4" />
                  Ver no Instagram
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiInstagram className="w-8 h-8 text-primary-500" />
              <h3 className="text-2xl font-bold text-secondary-800">
                Siga-nos no Instagram
              </h3>
            </div>
            <p className="text-secondary-600 mb-6 max-w-xl mx-auto">
              Não perca nenhum projeto! Siga nossa conta para ver trabalhos exclusivos, 
              dicas de decoração e bastidores da nossa marcenaria.
            </p>
            <a
              href="https://www.instagram.com/m.f.planejados/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiInstagram className="w-5 h-5" />
              @mfplanejados
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;
