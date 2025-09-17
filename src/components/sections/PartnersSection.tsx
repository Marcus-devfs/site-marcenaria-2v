'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const PartnersSection = () => {
  const partners = [
    {
      name: 'Arq. Lura',
      image: '/parceiros/arq_lura.jpeg',
      specialty: 'Design de Interiores'
    },
    {
      name: 'Arquiteia',
      image: '/parceiros/arquiteia.jpeg',
      specialty: 'Arquitetura Residencial'
    },
    {
      name: 'Cachi',
      image: '/parceiros/cachi.jpeg',
      specialty: 'Projetos Comerciais'
    },
    {
      name: 'Meyer',
      image: '/parceiros/meyer.jpeg',
      specialty: 'Design Contemporâneo'
    },
    {
      name: 'Paula Vaini',
      image: '/parceiros/paula_vaini.jpeg',
      specialty: 'Arquitetura de Interiores'
    },
    {
      name: 'Raquel N.',
      image: '/parceiros/raquel_n.jpeg',
      specialty: 'Projetos Residenciais'
    },
    {
      name: 'Samaia',
      image: '/parceiros/samaia.jpeg',
      specialty: 'Design Funcional'
    },
    {
      name: 'Studio D',
      image: '/parceiros/studio_d.jpeg',
      specialty: 'Arquitetura Moderna'
    }
  ];

  const benefits = [
    {
      icon: FiUsers,
      title: 'Rede de Parceiros',
      description: 'Trabalhamos com arquitetas renomadas para garantir projetos únicos e personalizados.'
    },
    {
      icon: FiAward,
      title: 'Qualidade Garantida',
      description: 'Cada parceira é cuidadosamente selecionada por sua excelência e experiência.'
    },
    {
      icon: FiHeart,
      title: 'Visão Completa',
      description: 'Do conceito à execução, oferecemos uma experiência completa e integrada.'
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
            Nossas <span className="text-gradient">Arquitetas Parceiras</span>
          </h2>
          <p className="section-subtitle">
            Trabalhamos em parceria com profissionais renomados para criar projetos únicos e personalizados
          </p>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Partners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card p-6 text-center group-hover:shadow-lg transition-all duration-300">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-primary-500 font-medium">
                  {partner.specialty}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="gradient-bg rounded-2xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-secondary-800 mb-4">
              Quer trabalhar conosco?
            </h3>
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
              Se você é uma arquiteta ou designer e gostaria de fazer parte da nossa rede de parceiros, entre em contato conosco.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              onClick={() => window.open('https://wa.me/5511940718032?text=Olá, sou arquiteta/designer e gostaria de fazer parte da rede de parceiros da MF Planejados. Podem me enviar mais informações?', '_blank')}
            >
              Seja nossa Parceira
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
