'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiHome } from 'react-icons/fi';
import { TfiRuler  } from 'react-icons/tfi';
import { PiCalculator } from "react-icons/pi";

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  project: string;
  budget: string;
  timeline: string;
  message: string;
}

interface CalculatorData {
  environment: string;
  area: number;
  materials: string[];
  extras: string[];
}

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    environment: '',
    area: 0,
    materials: [],
    extras: []
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<QuoteFormData>();

  const environments = [
    { id: 'cozinha', name: 'Cozinha', basePrice: 800, icon: '🍳' },
    { id: 'quarto', name: 'Quarto', basePrice: 600, icon: '🛏️' },
    { id: 'sala', name: 'Sala de Estar', basePrice: 700, icon: '🛋️' },
    { id: 'banheiro', name: 'Banheiro', basePrice: 500, icon: '🚿' },
    { id: 'escritorio', name: 'Escritório', basePrice: 650, icon: '💻' },
    { id: 'lavanderia', name: 'Lavanderia', basePrice: 400, icon: '🧺' }
  ];

  const materials = [
    { id: 'mdf', name: 'MDF', price: 1.0 },
    { id: 'melamina', name: 'Melamina', price: 0.8 },
    { id: 'madeira_macica', name: 'Madeira Maciça', price: 1.5 },
    { id: 'laminado', name: 'Laminado', price: 1.2 },
    { id: 'acrilico', name: 'Acrílico', price: 1.8 }
  ];

  const extras = [
    { id: 'iluminacao', name: 'Iluminação LED', price: 200 },
    { id: 'puxadores', name: 'Puxadores Premium', price: 150 },
    { id: 'gavetas', name: 'Sistema de Gavetas', price: 300 },
    { id: 'portas', name: 'Portas de Vidro', price: 400 },
    { id: 'organizadores', name: 'Organizadores', price: 250 }
  ];

  const calculatePrice = () => {
    const selectedEnv = environments.find(env => env.id === calculatorData.environment);
    if (!selectedEnv) return 0;

    let basePrice = selectedEnv.basePrice * calculatorData.area;
    
    // Apply material multiplier
    const selectedMaterials = materials.filter(mat => calculatorData.materials.includes(mat.id));
    if (selectedMaterials.length > 0) {
      const avgMaterialPrice = selectedMaterials.reduce((sum, mat) => sum + mat.price, 0) / selectedMaterials.length;
      basePrice *= avgMaterialPrice;
    }

    // Add extras
    const selectedExtras = extras.filter(extra => calculatorData.extras.includes(extra.id));
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

    return Math.round(basePrice + extrasPrice);
  };

  const handleEnvironmentSelect = (envId: string) => {
    setCalculatorData(prev => ({ ...prev, environment: envId }));
  };

  const handleMaterialToggle = (materialId: string) => {
    setCalculatorData(prev => ({
      ...prev,
      materials: prev.materials.includes(materialId)
        ? prev.materials.filter(id => id !== materialId)
        : [...prev.materials, materialId]
    }));
  };

  const handleExtraToggle = (extraId: string) => {
    setCalculatorData(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: QuoteFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Orçamento enviado com sucesso! Entraremos em contato em breve.');
      reset();
      setCurrentStep(1);
      setCalculatorData({
        environment: '',
        area: 0,
        materials: [],
        extras: []
      });
    } catch (error) {
      toast.error('Erro ao enviar orçamento. Tente novamente.');
    }
  };

  const steps = [
    { number: 1, title: 'Ambiente', icon: FiHome },
    { number: 2, title: 'Materiais', icon: TfiRuler },
    { number: 3, title: 'Extras', icon: FiCheckCircle },
    { number: 4, title: 'Contato', icon: PiCalculator },
  ];

  return (
    <div className="pt-32 pb-16">
      {/* Hero Section */}
      <section className="py-16 gradient-bg">
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
              Calculadora de <span className="text-gradient">Orçamento</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Receba uma estimativa personalizada para seu projeto de móveis planejados. 
              Simples, rápido e sem compromisso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-center">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <FiCheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <span className={`text-sm font-medium mt-2 ${
                        isActive ? 'text-primary-500' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="card p-8 lg:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Step 1: Environment Selection */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                      Qual ambiente você quer planejar?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {environments.map((env) => (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => handleEnvironmentSelect(env.id)}
                          className={`p-6 border-2 rounded-xl text-center transition-all duration-300 ${
                            calculatorData.environment === env.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          <div className="text-4xl mb-3">{env.icon}</div>
                          <h3 className="font-semibold text-secondary-800 mb-2">{env.name}</h3>
                          <p className="text-sm text-secondary-600">
                            A partir de R$ {env.basePrice}/m²
                          </p>
                        </button>
                      ))}
                    </div>

                    {calculatorData.environment && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Área aproximada (m²)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={calculatorData.area}
                          onChange={(e) => setCalculatorData(prev => ({ ...prev, area: Number(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          placeholder="Ex: 12"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Materials */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                      Escolha os materiais
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {materials.map((material) => (
                        <button
                          key={material.id}
                          type="button"
                          onClick={() => handleMaterialToggle(material.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                            calculatorData.materials.includes(material.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-secondary-800">{material.name}</span>
                            <span className="text-sm text-secondary-600">
                              {material.price === 1.0 ? 'Padrão' : `${(material.price * 100).toFixed(0)}%`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Extras */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                      Adicione extras (opcional)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {extras.map((extra) => (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => handleExtraToggle(extra.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                            calculatorData.extras.includes(extra.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-secondary-800">{extra.name}</span>
                            <span className="text-sm text-primary-600 font-semibold">
                              +R$ {extra.price}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Price Estimate */}
                    {calculatorData.environment && calculatorData.area > 0 && (
                      <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                        <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                          Estimativa do Projeto
                        </h3>
                        <div className="text-3xl font-bold text-primary-500">
                          R$ {calculatePrice().toLocaleString('pt-BR')}
                        </div>
                        <p className="text-sm text-secondary-600 mt-2">
                          *Valor estimado baseado nas suas escolhas. Orçamento final pode variar.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Contact Information */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                      Seus dados para contato
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          {...register('name', { required: 'Nome é obrigatório' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          placeholder="João Silva"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          {...register('email', { 
                            required: 'E-mail é obrigatório',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'E-mail inválido'
                            }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          placeholder="joão@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Telefone é obrigatório' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        placeholder="(11) 99999-9999"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Observações adicionais
                      </label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Conte-nos mais sobre seu projeto, preferências de estilo, cores, etc..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={currentStep === 1 && !calculatorData.environment}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                      <FiArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      Enviar Orçamento
                      <FiArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
