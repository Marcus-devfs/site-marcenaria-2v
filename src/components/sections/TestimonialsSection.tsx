'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUsers, FiAward, FiCheckCircle, FiArrowLeft, FiArrowRight, FiImage, FiX, FiZoomIn } from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { Testimonial } from '@/types';
import { SkeletonTestimonial } from '@/components/ui/Skeleton';
import Image from 'next/image';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Breakpoint md do Tailwind
    };

    handleResize(); // Verificar no carregamento inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const fetchedTestimonials = await apiService.getTestimonials();
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error('Erro ao carregar depoimentos:', error);
        // Fallback para depoimentos de exemplo
        setTestimonials([
          {
            _id: '1',
            clientName: 'Maria Silva',
            message: 'Excelente trabalho! Os móveis ficaram exatamente como eu imaginava. Qualidade impecável e atendimento de primeira. Recomendo de olhos fechados!',
            rating: 5,
            project: 'Cozinha Planejada',
            isActive: true,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15'
          },
          {
            _id: '2',
            clientName: 'João Santos',
            message: 'Profissionais muito competentes. Entregaram no prazo e com qualidade superior. O projeto ficou ainda melhor que o esperado. Parabéns!',
            rating: 5,
            project: 'Quarto Completo',
            isActive: true,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10'
          },
          {
            _id: '3',
            clientName: 'Ana Costa',
            message: 'Transformaram completamente meu ambiente. Design moderno e funcional. Muito satisfeita com o resultado final e o atendimento!',
            rating: 5,
            project: 'Sala de Estar',
            isActive: true,
            createdAt: '2024-01-05',
            updatedAt: '2024-01-05'
          },
          {
            _id: '4',
            clientName: 'Carlos Oliveira',
            message: 'Atendimento excepcional desde o primeiro contato. O projeto foi entregue no prazo e com qualidade impecável. Super recomendo!',
            rating: 5,
            project: 'Escritório',
            isActive: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const features = [
    {
      icon: FiStar,
      title: 'Qualidade Garantida',
      description: 'Materiais premium e acabamento impecável'
    },
    {
      icon: FiUsers,
      title: 'Atendimento Personalizado',
      description: 'Cada projeto é único e feito sob medida'
    },
    {
      icon: FiAward,
      title: '15+ Anos de Experiência',
      description: 'Tradição e inovação em cada móvel'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            O que nossos <span className="text-gradient">clientes</span> dizem
          </h2>
          <p className="section-subtitle">
            Veja o que nossos clientes estão falando sobre o jeito que a MF Planejados realizam seus sonhos!
          </p>
        </motion.div>

        {/* Features Section - Top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials Carousel - Focus on Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          {loading ? (
            <SkeletonTestimonial />
          ) : (
            <div className="relative">
              {/* Cards Container */}
              <div className="flex items-center justify-center gap-6 overflow-hidden px-4 py-8">
                  {testimonials.map((testimonial, index) => {
                    const isCenter = index === currentIndex;
                    const isLeft = !isMobile && index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                    const isRight = !isMobile && index === (currentIndex + 1) % testimonials.length;
                    const isVisible = isMobile ? isCenter : (isCenter || isLeft || isRight);

                  // URLs do S3 já são completas, não precisam de concatenação

                  console.log('testimonial.image?.url: ', testimonial.image?.url);

                  if (!isVisible) return null;

                  return (
                    <motion.div
                      key={testimonial._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isCenter ? 1 : 0.6,
                        scale: isCenter ? 1 : 0.85,
                        y: isCenter ? 0 : 20
                      }}
                      transition={{ duration: 0.2 }}
                        className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${
                          isMobile
                            ? 'w-72 h-80 z-10' // Mobile: card único
                            : isCenter 
                              ? 'w-92 h-112 z-10' // Desktop: card central
                              : 'w-64 h-80 z-0'  // Desktop: cards laterais
                        }`}
                    >
                      {/* Image Section */}
                      {testimonial.image?.url && (
                        <div 
                          className="relative group cursor-pointer" 
                          onClick={() => setSelectedImage(testimonial.image?.url || null)}
                        >
                          <Image
                          width={150}
                          height={350}
                            src={testimonial.image?.url}
                            alt={testimonial.image?.description || 'Imagem do depoimento'}
                            className={`w-full object-cover transition-transform group-hover:scale-105 ${
                              isMobile ? 'h-48' : isCenter ? 'h-64' : 'h-48'
                            }`}
                            onLoad={(e) => {
                              console.log('✅ Imagem carregada com sucesso:', testimonial.image?.url);
                            }}
                            onError={(e) => {
                              console.error('❌ Erro ao carregar imagem:', testimonial.image?.url);
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDAgMTAwSDExMFYxNDBIMTQwVjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2MCAxMDBIMTkwVjE0MEgxNjBWMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTQwIDEyMEgxNjBWMTQwSDE0MFYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTgwIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbSBu4oOjbyBlbmNvbnRyYWRhPC90ZXh0Pgo8L3N2Zz4K';
                            }}
                          />
                          
                          {/* Overlay de zoom - apenas no hover */}
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <FiZoomIn className="w-5 h-5 text-primary-500" />
                            </div>
                          </div>
                          
                          {/* Ícone de imagem - canto superior direito */}
                          <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1.5">
                            <FiImage className="w-3 h-3 text-primary-500" />
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className={`text-center ${isMobile ? 'p-4' : isCenter ? 'p-6' : 'p-4'}`}>
                        {/* Stars */}
                        <div className="flex justify-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`text-yellow-400 fill-current ${
                                isMobile ? 'w-4 h-4' : isCenter ? 'w-5 h-5' : 'w-4 h-4'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <FiCheckCircle className={`text-green-500 ${
                            isMobile ? 'w-4 h-4' : isCenter ? 'w-5 h-5' : 'w-4 h-4'
                          }`} />
                          <span className={`font-semibold text-secondary-800 ${
                            isMobile ? 'text-base' : isCenter ? 'text-lg' : 'text-base'
                          }`}>
                            {testimonial.clientName}
                          </span>
                        </div>
                        
                        {testimonial.project && (
                          <p className={`text-primary-600 font-medium ${
                            isMobile ? 'text-sm' : isCenter ? 'text-base' : 'text-sm'
                          }`}>
                            {testimonial.project}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 bg-white hover:bg-primary-50 rounded-full flex items-center justify-center transition-colors shadow-md"
                  >
                    <FiArrowLeft className="w-5 h-5 text-secondary-600" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentIndex
                            ? 'bg-primary-500'
                            : 'bg-secondary-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 bg-white hover:bg-primary-50 rounded-full flex items-center justify-center transition-colors shadow-md"
                  >
                    <FiArrowRight className="w-5 h-5 text-secondary-600" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
              <img
                src={selectedImage}
                alt="Imagem do depoimento"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;