'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiUsers, FiAward, FiClock } from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { Image } from '@/types';
import { SkeletonHero } from '@/components/ui/Skeleton';

const HeroSection = () => {
  const [backgroundImages, setBackgroundImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const stats = [
    { icon: FiUsers, value: '500+', label: 'Projetos Realizados' },
    { icon: FiAward, value: '15+', label: 'Anos de Experiência' },
    { icon: FiStar, value: '98%', label: 'Clientes Satisfeitos' },
    { icon: FiClock, value: '24h', label: 'Resposta Rápida' },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const images = await apiService.getImages();
        setBackgroundImages(images);
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        // Fallback para imagem padrão
        setBackgroundImages([{
          _id: 'fallback',
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2016&q=80',
          section: 'Hero',
          category: 'Default',
          title: 'Imagem Padrão',
          description: 'Imagem de fallback'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Rotação automática das imagens de fundo
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backgroundImages.length]);

  if (loading) {
    return <SkeletonHero />;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.length > 0 && (
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${backgroundImages[currentImageIndex]?.url}')`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="animate-fade-in"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-shadow-lg">
            Realize seu sonho com a{' '}
            <span className="text-primary-400">M&F Planejados</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed text-shadow">
            Transforme seus sonhos em realidade com móveis planejados sob medida. 
            Qualidade, inovação e design exclusivo para seu lar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              Ver Nossos Projetos
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-lg px-8 py-4"
            >
              Solicitar Orçamento
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 text-shadow">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm md:text-base text-shadow">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;