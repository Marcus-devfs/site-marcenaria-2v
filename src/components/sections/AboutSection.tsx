'use client';

import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiClock, FiShield, FiHeart, FiTrendingUp } from 'react-icons/fi';

const AboutSection = () => {
  const features = [
    {
      icon: FiAward,
      title: 'Qualidade Premium',
      description: 'Utilizamos apenas materiais de primeira qualidade e acabamento impecável em todos os nossos projetos.'
    },
    {
      icon: FiUsers,
      title: 'Atendimento Personalizado',
      description: 'Cada projeto é único. Nossa equipe trabalha diretamente com você para entender suas necessidades.'
    },
    {
      icon: FiClock,
      title: 'Pontualidade Garantida',
      description: 'Cumprimos prazos rigorosamente. Seu projeto será entregue no prazo combinado, sem surpresas.'
    },
    {
      icon: FiShield,
      title: 'Garantia Estendida',
      description: 'Oferecemos garantia completa em todos os nossos móveis, com suporte técnico especializado.'
    },
    {
      icon: FiHeart,
      title: 'Design Exclusivo',
      description: 'Criamos móveis únicos que refletem sua personalidade e se adaptam perfeitamente ao seu espaço.'
    },
    {
      icon: FiTrendingUp,
      title: 'Inovação Constante',
      description: 'Sempre atualizados com as últimas tendências e tecnologias em móveis planejados.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Por que escolher a <span className="text-gradient">MF Planejados</span>?
          </h2>
          <p className="section-subtitle">
            Mais de 15 anos transformando sonhos em realidade com móveis planejados de alta qualidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="gradient-bg rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-secondary-800 mb-4">
              Números que comprovam nossa excelência
            </h3>
            <p className="text-lg text-secondary-600">
              Resultados que falam por si só
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Projetos Realizados' },
              { number: '15+', label: 'Anos de Experiência' },
              { number: '98%', label: 'Clientes Satisfeitos' },
              { number: '24h', label: 'Resposta Rápida' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-700 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

