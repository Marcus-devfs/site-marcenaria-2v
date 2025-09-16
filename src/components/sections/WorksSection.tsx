'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEye, FiFilter } from 'react-icons/fi';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { Image } from '@/types';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ImageModal from '@/components/ui/ImageModal';

const WorksSection = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const fetchedImages = await apiService.getImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        // Fallback para imagens de exemplo
        setImages([
          {
            _id: '1',
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            section: 'Galeria',
            category: 'Cozinha',
            title: 'Cozinha Moderna',
            description: 'Projeto de cozinha planejada com design moderno e funcional'
          },
          {
            _id: '2',
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            section: 'Galeria',
            category: 'Quarto',
            title: 'Quarto Principal',
            description: 'Quarto planejado com guarda-roupa e cama integrados'
          },
          {
            _id: '3',
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            section: 'Galeria',
            category: 'Sala',
            title: 'Sala de Estar',
            description: 'Sala planejada com TV e estante personalizada'
          },
          {
            _id: '4',
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            section: 'Galeria',
            category: 'Cozinha',
            title: 'Cozinha Clássica',
            description: 'Cozinha com design clássico e acabamento em madeira'
          },
          {
            _id: '5',
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            section: 'Galeria',
            category: 'Banheiro',
            title: 'Banheiro Moderno',
            description: 'Banheiro planejado com design moderno e funcional'
          },
          {
            _id: '6',
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            section: 'Galeria',
            category: 'Escritório',
            title: 'Home Office',
            description: 'Escritório planejado para trabalho em casa'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const categories = Array.from(new Set(images.map(img => img.category))).filter(Boolean);
  const filteredImages = selectedCategory 
    ? images.filter(img => img.category === selectedCategory)
    : images.slice(0, 6);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section id="produtos" className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-gradient">Nossos Trabalhos</span>
          </h2>
          <p className="section-subtitle">
            Conheça alguns dos projetos que realizamos com excelência e dedicação
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 text-secondary-600 mb-4 w-full justify-center">
            <FiFilter className="w-5 h-5" />
            <span className="font-medium">Filtrar por categoria:</span>
          </div>
          
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === ''
                ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Todos
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {loading ? (
            // Skeleton loading
            [...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            filteredImages.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group cursor-pointer"
                onClick={() => openModal(index)}
              >
                <div className="relative h-64 bg-cover bg-center rounded-t-xl overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${image.url}')` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <FiEye className="w-6 h-6 text-primary-500" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  {image.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {image.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-secondary-800 mb-2">
                    {image.title || image.category || 'Projeto Personalizado'}
                  </h3>
                  {image.description && (
                    <p className="text-secondary-600 text-sm">
                      {image.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/galeria" className="w-full flex justify-center">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              Ver Todos os Projetos
              <FiArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        images={filteredImages}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
};

export default WorksSection;