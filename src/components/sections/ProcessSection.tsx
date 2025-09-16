'use client';

import { motion } from 'framer-motion';
import { FiMessageCircle, FiEdit, FiTool, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { TfiRuler  } from 'react-icons/tfi';

const ProcessSection = () => {
  const steps = [
    {
      icon: FiMessageCircle,
      title: '1. Consulta Inicial',
      description: 'Entramos em contato para entender suas necessidades, preferências de estilo e orçamento disponível.',
      details: ['Conversa sobre o projeto', 'Definição do estilo', 'Orçamento preliminar']
    },
    {
      icon: TfiRuler,
      title: '2. Medição e Projeto',
      description: 'Nossa equipe vai até sua casa para fazer as medições precisas e criar o projeto 3D personalizado.',
      details: ['Visita técnica', 'Medições precisas', 'Projeto 3D detalhado']
    },
    {
      icon: FiEdit,
      title: '3. Aprovação do Projeto',
      description: 'Apresentamos o projeto final com todos os detalhes, materiais e valores para sua aprovação.',
      details: ['Apresentação do projeto', 'Escolha de materiais', 'Contrato assinado']
    },
    {
      icon: FiTool,
      title: '4. Produção',
      description: 'Iniciamos a fabricação dos seus móveis com materiais selecionados e acabamento de primeira qualidade.',
      details: ['Fabricação especializada', 'Controle de qualidade', 'Acabamento impecável']
    },
    {
      icon: FiTruck,
      title: '5. Entrega e Instalação',
      description: 'Entregamos e instalamos seus móveis no prazo combinado, com toda a atenção aos detalhes.',
      details: ['Entrega agendada', 'Instalação profissional', 'Limpeza final']
    },
    {
      icon: FiCheckCircle,
      title: '6. Pós-Venda',
      description: 'Oferecemos suporte completo após a entrega, garantindo sua total satisfação com o resultado.',
      details: ['Garantia estendida', 'Suporte técnico', 'Manutenção preventiva']
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
            Como funciona nosso <span className="text-gradient">processo</span>
          </h2>
          <p className="section-subtitle">
            Do primeiro contato até a entrega final, acompanhamos cada etapa do seu projeto
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card p-8 text-center relative z-10 bg-white">
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2 text-left">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-secondary-600">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <h3 className="text-2xl lg:text-3xl font-bold text-secondary-800 mb-4">
              Pronto para começar seu projeto?
            </h3>
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e dê o primeiro passo para transformar seu ambiente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-lg px-8 py-4"
              >
                Solicitar Orçamento
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/5511940718032?text=Olá, gostaria de saber mais sobre o processo de orçamento', '_blank')}
                className="btn-outline text-lg px-8 py-4"
              >
                Falar no WhatsApp
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;