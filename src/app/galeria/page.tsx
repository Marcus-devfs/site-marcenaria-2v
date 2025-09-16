'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiEye, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { Image } from '@/types';

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const allImages = await apiService.getImagesBySection('Galeria');
        setImages(allImages);
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        // Fallback data para demonstração
        setImages([
          {
            _id: '1',
            url: '/api/placeholder/400/300',
            section: 'Galeria',
            category: 'Cozinha',
            title: 'Cozinha Moderna',
            description: 'Projeto de cozinha planejada com design moderno e funcional'
          },
          {
            _id: '2',
            url: '/api/placeholder/400/300',
            section: 'Galeria',
            category: 'Quarto',
            title: 'Quarto Principal',
            description: 'Quarto planejado com guarda-roupa e cama integrados'
          },
          {
            _id: '3',
            url: '/api/placeholder/400/300',
            section: 'Galeria',
            category: 'Sala',
            title: 'Sala de Estar',
            description: 'Sala planejada com TV e estante personalizada'
          },
          {
            _id: '4',
            url: '/api/placeholder/400/300',
            section: 'Galeria',
            category: 'Cozinha',
            title: 'Cozinha Clássica',
            description: 'Cozinha com design clássico e acabamento em madeira'
          },
          {
            _id: '5',
            url: '/api/placeholder/400/300',
            section: 'Galeria',
            category: 'Banheiro',
            title: 'Banheiro Moderno',
            description: 'Banheiro planejado com design moderno e funcional'
          },
          {
            _id: '6',
            url: '/api/placeholder/400/300',
            section: 'Galeria',
            category: 'Escritório',
            title: 'Home Office',
            description: 'Escritório planejado para trabalho em casa'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const categories = Array.from(new Set(images.map(img => img.category))).filter(Boolean);
  const filteredImages = selectedCategory 
    ? images.filter(img => img.category === selectedCategory)
    : images;

  if (isLoading) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded-lg mb-8 max-w-2xl mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-800 mb-6">
              Nossa <span className="text-gradient">Galeria</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Explore nossa galeria completa de móveis planejados. Cada projeto é único, 
              criado com paixão e atenção aos detalhes para transformar seu ambiente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <FiFilter className="w-5 h-5 text-secondary-600" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === ''
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-600">Visualização:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container-custom">
          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <FiEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500">
                Tente selecionar uma categoria diferente.
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
            }>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`card group cursor-pointer ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                >
                  <div className={`relative bg-cover bg-center rounded-t-xl overflow-hidden ${
                    viewMode === 'list' ? 'w-48 h-32' : 'h-64'
                  }`}>
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
                  
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
