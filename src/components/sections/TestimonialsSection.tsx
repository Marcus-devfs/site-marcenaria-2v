'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUsers, FiAward, FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      _id: '1',
      clientName: 'Maria Silva',
      message: 'Excelente trabalho! Os móveis ficaram exatamente como eu imaginava. Qualidade impecável e atendimento de primeira. Recomendo de olhos fechados!',
      rating: 5,
      project: 'Cozinha Planejada',
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      clientName: 'João Santos',
      message: 'Profissionais muito competentes. Entregaram no prazo e com qualidade superior. O projeto ficou ainda melhor que o esperado. Parabéns!',
      rating: 5,
      project: 'Quarto Completo',
      createdAt: '2024-01-10'
    },
    {
      _id: '3',
      clientName: 'Ana Costa',
      message: 'Transformaram completamente meu ambiente. Design moderno e funcional. Muito satisfeita com o resultado final e o atendimento!',
      rating: 5,
      project: 'Sala de Estar',
      createdAt: '2024-01-05'
    },
    {
      _id: '4',
      clientName: 'Carlos Oliveira',
      message: 'Atendimento excepcional desde o primeiro contato. O projeto foi entregue no prazo e com qualidade impecável. Super recomendo!',
      rating: 5,
      project: 'Escritório',
      createdAt: '2024-01-01'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
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
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-800">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right side - Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card p-8 text-center min-h-[400px] flex flex-col justify-center">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col justify-center"
              >
                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="text-6xl text-primary-500 mb-4">"</div>
                
                <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial]?.message}"
                </p>
                
                <div className="flex items-center justify-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-secondary-800">
                    {testimonials[currentTestimonial]?.clientName}
                  </span>
                </div>
                
                {testimonials[currentTestimonial]?.project && (
                  <p className="text-sm text-secondary-500 mt-2">
                    Projeto: {testimonials[currentTestimonial]?.project}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-secondary-100 hover:bg-secondary-200 rounded-full flex items-center justify-center transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-secondary-600" />
              </button>
              
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? 'bg-primary-500'
                        : 'bg-secondary-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-secondary-100 hover:bg-secondary-200 rounded-full flex items-center justify-center transition-colors"
              >
                <FiArrowRight className="w-5 h-5 text-secondary-600" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;