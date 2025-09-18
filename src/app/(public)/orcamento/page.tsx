'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiHome, 
  FiSettings, 
  FiDollarSign, 
  FiArrowRight, 
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiShoppingCart,
  FiUpload,
  FiX
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { Environment, FurnitureItem, ReferenceImage, PriceConfig } from '@/types';
import { Select, SelectOption } from '@/components/ui/Select';
import toast from 'react-hot-toast';

interface QuoteFormData {
  client: {
    name: string;
    email: string;
    phone: string;
    preferredContact: string;
  };
  project: {
    description: string;
    budget: string;
    timeline: string;
    specialRequirements: string;
  };
}

type Step = 'client' | 'environments' | 'review' | 'submit';

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState<Step>('client');
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [priceConfigs, setPriceConfigs] = useState<PriceConfig[]>([]);
  const [calculations, setCalculations] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false);
  const [selectedEnvironmentIndex, setSelectedEnvironmentIndex] = useState<number>(-1);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<QuoteFormData>();

  useEffect(() => {
    const fetchPriceConfigs = async () => {
      try {
        const response = await apiService.getPriceConfigs();
        const configs = Array.isArray(response) ? response : (response as any)?.data || [];
        setPriceConfigs(configs);
      } catch (error) {
        console.error('Erro ao carregar configurações de preço:', error);
        toast.error('Erro ao carregar configurações de preço');
      }
    };

    fetchPriceConfigs();
  }, []);

  // Calcular preços quando ambientes mudarem
  useEffect(() => {
    if (environments.length > 0 && environments.some(env => env.furnitureItems.length > 0)) {
      calculatePrices();
    }
  }, [environments]);

  const addEnvironment = (environmentType: string) => {
    const newEnvironment: Environment = {
      type: environmentType as any,
      name: environmentOptions.find(e => e.value === environmentType)?.label || environmentType,
      furnitureItems: [],
      description: ''
    };
    setEnvironments([...environments, newEnvironment]);
  };

  const removeEnvironment = (index: number) => {
    setEnvironments(environments.filter((_, i) => i !== index));
  };

  const addFurnitureToEnvironment = (environmentIndex: number, furnitureName: string, area: number, variation?: string, measurements?: any, woodType?: string) => {
    const newItem: FurnitureItem = {
      name: furnitureName,
      area: area,
      variation: variation,
      measurements: measurements,
      woodType: woodType,
      description: ''
    };
    
    const updated = [...environments];
    updated[environmentIndex].furnitureItems.push(newItem);
    setEnvironments(updated);
    setShowFurnitureModal(false);
    setSelectedEnvironmentIndex(-1);
  };

  const removeFurnitureFromEnvironment = (environmentIndex: number, furnitureIndex: number) => {
    const updated = [...environments];
    updated[environmentIndex].furnitureItems = updated[environmentIndex].furnitureItems.filter((_, i) => i !== furnitureIndex);
    setEnvironments(updated);
  };


  const calculatePrices = async () => {
    if (environments.length === 0) return;

    setIsCalculating(true);
    try {
      const result = await apiService.calculateEstimatedPrice(environments);
      setCalculations(result.data);
    } catch (error) {
      console.error('Erro ao calcular preços:', error);
      toast.error('Erro ao calcular preços estimados');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiService.uploadFile(formData);
        console.log('Upload response:', response); // Debug log
        
        // Verificar se a resposta tem a estrutura esperada
        if (!response.data || !response.data.url) {
          console.error('Resposta de upload inválida:', response);
          throw new Error('Resposta de upload inválida');
        }
        
        return {
          url: response.data.url,
          description: file.name,
          uploadedAt: new Date()
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setReferenceImages([...referenceImages, ...uploadedImages]);
      toast.success(`${uploadedImages.length} imagem(ns) carregada(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      toast.error('Erro ao fazer upload das imagens');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: QuoteFormData) => {
    if (environments.length === 0) {
      toast.error('Adicione pelo menos um ambiente');
      return;
    }

    if (environments.every(env => env.furnitureItems.length === 0)) {
      toast.error('Adicione pelo menos um móvel em um dos ambientes');
      return;
    }

    setIsSubmitting(true);
    try {
      const quoteData = {
        client: data.client,
        projectDetails: data.project, // Mapear project para projectDetails
        environments,
        referenceImages,
        calculations
      };

      console.log('Dados do orçamento sendo enviados:', quoteData);
      console.log('Dados do projeto:', data.project);

      await apiService.createQuoteComplete(quoteData);
      toast.success('Orçamento enviado com sucesso! Entraremos em contato em breve.');
      
      // Reset form
      setEnvironments([]);
      setReferenceImages([]);
      setCalculations(null);
      setCurrentStep('client');
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      toast.error('Erro ao enviar orçamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 'client':
        // Trigger validation for all client fields
        const isValid = await trigger(['client.name', 'client.email', 'client.phone']);
        if (!isValid) {
          toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
          return false;
        }
        return true;
      case 'environments':
        if (environments.length === 0) {
          toast.error('Por favor, adicione pelo menos um ambiente');
          return false;
        }
        // Verificar se todos os ambientes têm pelo menos um móvel
        for (const env of environments) {
          if (env.furnitureItems.length === 0) {
            toast.error(`Por favor, adicione pelo menos um móvel ao ambiente: ${env.name}`);
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 'client':
        const clientData = watch('client');
        return clientData?.name && clientData?.email && clientData?.phone;
      case 'environments':
        return environments.length > 0 && environments.every(env => env.furnitureItems.length > 0);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      return;
    }
    
    const steps: Step[] = ['client', 'environments', 'review', 'submit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['client', 'environments', 'review', 'submit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const environmentOptions = [
    { value: 'cozinha', label: 'Cozinha', icon: '🍳' },
    { value: 'quarto', label: 'Quarto', icon: '🛏️' },
    { value: 'sala', label: 'Sala', icon: '🛋️' },
    { value: 'banheiro', label: 'Banheiro', icon: '🚿' },
    { value: 'escritorio', label: 'Escritório', icon: '💼' },
    { value: 'area_externa', label: 'Área Externa', icon: '🌳' },
    { value: 'outro', label: 'Outro', icon: '🏠' }
  ];

  return (
    <div className="pt-32 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-6">
              Solicite Seu Orçamento
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Preencha o formulário abaixo e receba um orçamento personalizado para seus móveis planejados
            </p>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {[
                  { step: 'client', label: 'Dados', icon: FiCheck },
                  { step: 'environments', label: 'Ambientes', icon: FiHome },
                  { step: 'review', label: 'Revisão', icon: FiSettings },
                  { step: 'submit', label: 'Envio', icon: FiDollarSign }
                ].map(({ step, label, icon: Icon }, index) => {
                  const isActive = currentStep === step;
                  const isCompleted = ['client', 'environments', 'review', 'submit'].indexOf(currentStep) > index;
                  
                  return (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive 
                          ? 'border-primary-600 bg-primary-600 text-white' 
                          : isCompleted 
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                      {index < 3 && (
                        <div className={`w-8 h-0.5 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Dados do Cliente */}
              {currentStep === 'client' && (
                <motion.div
                  key="client"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                    <FiCheck className="w-6 h-6 text-primary-500" />
                    Dados do Cliente
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        {...register('client.name', { required: 'Nome é obrigatório' })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.client?.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Seu nome completo"
                      />
                      {errors.client?.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.client.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...register('client.email', { 
                          required: 'Email é obrigatório',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido'
                          }
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.client?.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="seu@email.com"
                      />
                      {errors.client?.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.client.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Telefone/WhatsApp *
                      </label>
                      <input
                        {...register('client.phone', { required: 'Telefone é obrigatório' })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.client?.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="(11) 99999-9999"
                      />
                      {errors.client?.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.client.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preferência de Contato
                      </label>
                      <Select
                        options={[
                          { value: 'whatsapp', label: 'WhatsApp' },
                          { value: 'phone', label: 'Telefone' },
                          { value: 'email', label: 'Email' }
                        ]}
                        placeholder="Selecione uma opção"
                        {...register('client.preferredContact')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isCurrentStepValid()}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        isCurrentStepValid()
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Próximo
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Ambientes e Móveis */}
              {currentStep === 'environments' && (
                <motion.div
                  key="environments"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Adicionar Ambiente */}
                  <div className="card p-8">
                    <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                      <FiHome className="w-6 h-6 text-primary-500" />
                      Ambientes do Projeto
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      Selecione os ambientes onde você deseja instalar móveis planejados.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {environmentOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => addEnvironment(option.value)}
                          className="p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                        >
                          <div className="text-3xl mb-2">{option.icon}</div>
                          <div className="font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Ambientes */}
                  {environments.length > 0 && (
                    <div className="space-y-6">
                      {environments.map((environment, envIndex) => (
                        <div key={envIndex} className="card p-8">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-secondary-800 flex items-center gap-2">
                              <span className="text-2xl">
                                {environmentOptions.find(e => e.value === environment.type)?.icon}
                              </span>
                              {environment.name}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEnvironmentIndex(envIndex);
                                  setShowFurnitureModal(true);
                                }}
                                className="btn-primary flex items-center gap-2"
                              >
                                <FiPlus className="w-4 h-4" />
                                Adicionar Móvel
                              </button>
                              <button
                                type="button"
                                onClick={() => removeEnvironment(envIndex)}
                                className="btn-secondary text-red-600 hover:bg-red-50"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {environment.furnitureItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <FiShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p>Nenhum móvel adicionado ainda</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEnvironmentIndex(envIndex);
                                  setShowFurnitureModal(true);
                                }}
                                className="btn-primary mt-4"
                              >
                                Adicionar Primeiro Móvel
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {environment.furnitureItems.map((item, itemIndex) => {
                                const priceConfig = priceConfigs.find(p => p.name === item.name);
                                const itemValue = priceConfig && priceConfig.calculatePrice ? priceConfig.calculatePrice(item.area, item.variation) : (priceConfig ? item.area * priceConfig.basePricePerM2 : 0);

                                return (
                                  <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        {item.variation && (
                                          <p className="text-sm text-gray-600">Variação: {item.variation}</p>
                                        )}
                                        {item.woodType && (
                                          <p className="text-sm text-gray-600">
                                            Madeira: {item.woodType === 'madeirado' ? 'Madeirado (+10%)' : 'Branca'}
                                          </p>
                                        )}
                                        <p className="text-sm text-gray-600">
                                          Área: {item.area.toFixed(2)} m²
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <div className="text-sm text-gray-600">
                                          {item.area.toFixed(2)} m²
                                        </div>
                                        <p className="text-xs text-gray-500">Área calculada</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFurnitureFromEnvironment(envIndex, itemIndex)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                      >
                                        <FiTrash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={environments.length === 0 || environments.every(env => env.furnitureItems.length === 0)}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Revisar
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Revisão e Cálculo */}
              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="card p-8">
                    <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                      <FiSettings className="w-6 h-6 text-primary-500" />
                      Revisão do Projeto
                    </h2>

                    {/* Resumo dos Ambientes */}
                    <div className="space-y-6">
                      {environments.map((environment, envIndex) => (
                        <div key={envIndex} className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-xl">
                              {environmentOptions.find(e => e.value === environment.type)?.icon}
                            </span>
                            {environment.name}
                          </h3>
                          
                          <div className="space-y-3">
                            {environment.furnitureItems.map((item, itemIndex) => {
                              const priceConfig = priceConfigs.find(p => p.name === item.name);
                              const itemValue = priceConfig && priceConfig.calculatePrice ? priceConfig.calculatePrice(item.area, item.variation) : (priceConfig ? item.area * priceConfig.basePricePerM2 : 0);
                              
                              return (
                                <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    {item.variation && (
                                      <p className="text-sm text-gray-600">Variação: {item.variation}</p>
                                    )}
                                    {item.woodType && (
                                      <p className="text-sm text-gray-600">
                                        Madeira: {item.woodType === 'madeirado' ? 'Madeirado (+10%)' : 'Branca'}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">{item.area}m²</p>
                                    <p className="font-semibold">R$ {itemValue.toLocaleString('pt-BR')}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Estimativa de Preços */}
                    {calculations && (
                      <div className="mt-8 p-6 bg-primary-50 rounded-lg">
                        <h3 className="text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
                          <FiDollarSign className="w-6 h-6" />
                          Estimativa de Preços
                        </h3>
                        
                        <div className="space-y-4">
                          {calculations.breakdown?.map((envBreakdown: any, index: number) => (
                            <div key={index} className="border-b border-primary-200 pb-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-primary-700">{envBreakdown.environmentName}</h4>
                                <span className="font-bold text-primary-800">
                                  R$ {envBreakdown.totalValue.toLocaleString('pt-BR')}
                                </span>
                              </div>
                              
                              {envBreakdown.items?.map((item: any, itemIndex: number) => (
                                <div key={itemIndex} className="flex justify-between text-sm text-primary-600 ml-4">
                                  <span>
                                    {item.name} 
                                    {item.variation && ` (${item.variation})`}
                                    {item.woodType && ` - ${item.woodType === 'madeirado' ? 'Madeirado' : 'Branca'}`}
                                    - {item.area}m²
                                  </span>
                                  <span>R$ {item.totalValue.toLocaleString('pt-BR')}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                          
                          <div className="border-t-2 border-primary-300 pt-4">
                            <div className="flex justify-between items-center text-xl font-bold text-primary-800">
                              <span>Total Estimado:</span>
                              <span>R$ {calculations.estimatedTotalValue.toLocaleString('pt-BR')}</span>
                            </div>
                            <p className="text-sm text-primary-600 mt-2">
                              * Valor estimado baseado nos preços por metro quadrado. Valor final pode variar.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary flex items-center gap-2"
                    >
                      Continuar
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Detalhes do Projeto e Envio */}
              {currentStep === 'submit' && (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                    <FiDollarSign className="w-6 h-6 text-primary-500" />
                    Detalhes do Projeto
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Descrição do Projeto
                      </label>
                      <textarea
                        {...register('project.description')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                        placeholder="Descreva seu projeto, preferências de estilo, cores, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Orçamento Estimado
                        </label>
                        <Select
                          options={[
                            { value: '', label: 'Selecione uma faixa' },
                            { value: 'ate_10k', label: 'Até R$ 10.000' },
                            { value: '10k_25k', label: 'R$ 10.000 - R$ 25.000' },
                            { value: '25k_50k', label: 'R$ 25.000 - R$ 50.000' },
                            { value: '50k_100k', label: 'R$ 50.000 - R$ 100.000' },
                            { value: 'acima_100k', label: 'Acima de R$ 100.000' },
                            { value: 'nao_definido', label: 'Não definido' }
                          ]}
                          value={watch('project.budget')}
                          onChange={(e) => setValue('project.budget', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Prazo Desejado
                        </label>
                        <Select
                          options={[
                            { value: '', label: 'Selecione um prazo' },
                            { value: 'urgente', label: 'Urgente (até 1 mês)' },
                            { value: '1_mes', label: '1 mês' },
                            { value: '2_3_meses', label: '2-3 meses' },
                            { value: '3_6_meses', label: '3-6 meses' },
                            { value: 'sem_pressa', label: 'Sem pressa' }
                          ]}
                          value={watch('project.timeline')}
                          onChange={(e) => setValue('project.timeline', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Requisitos Especiais
                      </label>
                      <textarea
                        {...register('project.specialRequirements')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Acessibilidade, instalação específica, materiais especiais, etc."
                      />
                    </div>

                    {/* Upload de Imagens */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Imagens de Referência
                      </label>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-gray-600">
                            {uploadingImages ? 'Enviando imagens...' : 'Clique para adicionar imagens'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            PNG, JPG até 10MB cada
                          </p>
                        </label>
                      </div>

                      {referenceImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {referenceImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.url}
                                alt={image.description}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeReferenceImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Orçamento'}
                      <FiDollarSign className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* Modal de Seleção de Móveis */}
      {showFurnitureModal && (
        <FurnitureSelectionModal
          priceConfigs={priceConfigs}
          environmentName={selectedEnvironmentIndex >= 0 ? environments[selectedEnvironmentIndex]?.name || 'Ambiente' : 'Ambiente'}
          environmentIcon={selectedEnvironmentIndex >= 0 ? environmentOptions.find(e => e.value === environments[selectedEnvironmentIndex]?.type)?.icon || '🏠' : '🏠'}
          onClose={() => {
            setShowFurnitureModal(false);
            setSelectedEnvironmentIndex(-1);
          }}
          onSelect={(name, area, variation, measurements, woodType) => {
            if (selectedEnvironmentIndex >= 0) {
              addFurnitureToEnvironment(selectedEnvironmentIndex, name, area, variation, measurements, woodType);
            }
          }}
        />
      )}
    </div>
  );
}

interface FurnitureSelectionModalProps {
  priceConfigs: PriceConfig[];
  environmentName: string;
  environmentIcon: string;
  onClose: () => void;
  onSelect: (name: string, area: number, variation?: string, measurements?: any, woodType?: string) => void;
}

function FurnitureSelectionModal({ priceConfigs, environmentName, environmentIcon, onClose, onSelect }: FurnitureSelectionModalProps) {
  const [selectedFurniture, setSelectedFurniture] = useState<PriceConfig | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 1.0,
    height: 2.0,
    depth: 0.6
  });
  const [variation, setVariation] = useState('');
  const [woodType, setWoodType] = useState('branca'); // 'branca' ou 'madeirado'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFurniture && dimensions.width > 0 && dimensions.height > 0) {
      // Calcular área automaticamente (largura × altura)
      const area = dimensions.width * dimensions.height;
      onSelect(selectedFurniture.name, area, variation || undefined, dimensions, woodType);
    }
  };

  // Calcular área automaticamente
  const calculatedArea = dimensions.width * dimensions.height;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{environmentIcon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Adicionar Móvel</h2>
                <p className="text-sm text-primary-700 font-medium">Ambiente: {environmentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção do Móvel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Móvel *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {priceConfigs.map((config) => (
                  <button
                    key={config._id}
                    type="button"
                    onClick={() => setSelectedFurniture(config)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedFurniture?._id === config._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{config.name}</div>
                    {config.description && (
                      <div className="text-sm text-gray-600">
                        {config.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Variações */}
            {selectedFurniture && selectedFurniture.variations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variação
                </label>
                <Select
                  options={[
                    { value: '', label: 'Selecione uma variação' },
                    ...selectedFurniture.variations.map((variation, index) => ({
                      value: variation.name,
                      label: `${variation.name} (${variation.priceMultiplier}x)`
                    }))
                  ]}
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* Tipo de Madeira */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Madeira *
              </label>
              <Select
                options={[
                  { value: 'branca', label: 'Madeira Branca (Padrão)' },
                  { value: 'madeirado', label: 'Madeirado' }
                ]}
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Dimensões */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dimensões do Móvel *
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Largura (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={dimensions.width}
                    onChange={(e) => setDimensions(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: 1.0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Altura (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={dimensions.height}
                    onChange={(e) => setDimensions(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: 2.0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Profundidade (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions(prev => ({ ...prev, depth: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: 0.6"
                    required
                  />
                </div>
              </div>
              {calculatedArea > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Área calculada: <span className="font-medium">{calculatedArea.toFixed(2)} m²</span>
                </p>
              )}
            </div>

            {/* Preview do Cálculo */}
            {selectedFurniture && calculatedArea > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Estimativa:</h4>
                <p className="text-sm text-gray-600">
                  {selectedFurniture.name} {variation && `(${variation})`} - {woodType === 'madeirado' ? 'Madeirado' : 'Madeira Branca'}
                </p>
                <p className="text-sm text-gray-600">
                  {calculatedArea.toFixed(2)}m² × R$ {selectedFurniture.basePricePerM2.toLocaleString('pt-BR')}/m²
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!selectedFurniture || dimensions.width <= 0 || dimensions.height <= 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar Móvel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}