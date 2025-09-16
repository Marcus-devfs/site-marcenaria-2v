'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUpload, FiX, FiCheck, FiArrowLeft, FiImage } from 'react-icons/fi';
import { TfiRuler  } from 'react-icons/tfi';
import { PiCalculator } from "react-icons/pi";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/api';
import { Environment, ReferenceImage, PriceConfig } from '@/types';

interface QuoteFormData {
  client: {
    name: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
  };
  projectDetails: {
    description: string;
    budget: string;
    timeline: string;
    specialRequirements: string;
  };
}

export default function QuotePage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [priceConfigs, setPriceConfigs] = useState<PriceConfig[]>([]);
  const [calculations, setCalculations] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<QuoteFormData>();

  useEffect(() => {
    const fetchPriceConfigs = async () => {
      try {
        const configs = await apiService.getPriceConfigs();
        setPriceConfigs(configs);
      } catch (error) {
        console.error('Erro ao carregar configurações de preço:', error);
      }
    };

    fetchPriceConfigs();
  }, []);

  // Calcular preços quando ambientes mudarem
  useEffect(() => {
    if (environments.length > 0) {
      calculatePrices();
    }
  }, [environments]);

  const addEnvironment = () => {
    const newEnvironment: Environment = {
      type: 'cozinha',
      measurements: {
        width: 0,
        height: 0,
        depth: 0,
        area: 0
      },
      description: '',
      woodType: 'branca',
      thickness: '18mm'
    };
    setEnvironments([...environments, newEnvironment]);
  };

  const removeEnvironment = (index: number) => {
    setEnvironments(environments.filter((_, i) => i !== index));
  };

  const updateEnvironment = (index: number, field: string, value: any) => {
    const updated = [...environments];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index][parent as keyof Environment][child as string] = value;
    } else {
      updated[index][field as keyof Environment] = value;
    }

    // Calcular área automaticamente
    if (field === 'measurements.width' || field === 'measurements.height') {
      const width = field === 'measurements.width' ? value : updated[index].measurements.width;
      const height = field === 'measurements.height' ? value : updated[index].measurements.height;
      updated[index].measurements.area = width * height;
    }

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
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const result = await apiService.uploadReferenceImages(formData);
      setReferenceImages([...referenceImages, ...result.images]);
      toast.success('Imagens enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
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

    setIsSubmitting(true);
    try {
      const quoteData = {
        ...data,
        environments,
        referenceImages,
        calculations
      };

      await apiService.createQuoteComplete(quoteData);
      toast.success('Orçamento enviado com sucesso! Entraremos em contato em breve.');
      
      // Reset form
      setEnvironments([]);
      setReferenceImages([]);
      setCalculations(null);
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      toast.error('Erro ao enviar orçamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const environmentOptions = [
    { value: 'cozinha', label: 'Cozinha' },
    { value: 'quarto', label: 'Quarto' },
    { value: 'sala', label: 'Sala' },
    { value: 'banheiro', label: 'Banheiro' },
    { value: 'escritorio', label: 'Escritório' },
    { value: 'area_externa', label: 'Área Externa' },
    { value: 'outro', label: 'Outro' }
  ];

  const woodTypeOptions = [
    { value: 'branca', label: 'Madeira Branca' },
    { value: 'madeirada', label: 'Madeira Madeirada' },
    { value: 'laminada', label: 'Laminada' },
    { value: 'mdf', label: 'MDF' },
    { value: 'outro', label: 'Outro' }
  ];

  const thicknessOptions = [
    { value: '15mm', label: '15mm' },
    { value: '18mm', label: '18mm' },
    { value: '25mm', label: '25mm' }
  ];

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
              Solicite seu <span className="text-gradient">Orçamento</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Preencha os dados abaixo e receba um orçamento personalizado e detalhado 
              para seu projeto de móveis planejados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            {/* Dados do Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-8 mb-8"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  <select
                    {...register('client.preferredContact')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Telefone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Ambientes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary-800 flex items-center gap-2">
                  <TfiRuler className="w-6 h-6 text-primary-500" />
                  Ambientes do Projeto
                </h2>
                <button
                  type="button"
                  onClick={addEnvironment}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Adicionar Ambiente
                </button>
              </div>

              {environments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TfiRuler className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Adicione pelo menos um ambiente para calcular o orçamento</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {environments.map((env, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-secondary-800">
                          Ambiente {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeEnvironment(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Tipo de Ambiente
                          </label>
                          <select
                            value={env.type}
                            onChange={(e) => updateEnvironment(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            {environmentOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Largura (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={env.measurements.width}
                            onChange={(e) => updateEnvironment(index, 'measurements.width', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Altura (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={env.measurements.height}
                            onChange={(e) => updateEnvironment(index, 'measurements.height', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Profundidade (m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={env.measurements.depth}
                            onChange={(e) => updateEnvironment(index, 'measurements.depth', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Tipo de Madeira
                          </label>
                          <select
                            value={env.woodType}
                            onChange={(e) => updateEnvironment(index, 'woodType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            {woodTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Espessura
                          </label>
                          <select
                            value={env.thickness}
                            onChange={(e) => updateEnvironment(index, 'thickness', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          >
                            {thicknessOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Descrição do Ambiente
                        </label>
                        <textarea
                          value={env.description}
                          onChange={(e) => updateEnvironment(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          rows={3}
                          placeholder="Descreva o que você imagina para este ambiente..."
                        />
                      </div>

                      {env.measurements.area > 0 && (
                        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                          <p className="text-sm text-primary-700">
                            <strong>Área calculada:</strong> {env.measurements.area.toFixed(2)} m²
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Cálculo de Preços */}
            {calculations && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card p-8 mb-8 bg-gradient-to-r from-primary-50 to-primary-100"
              >
                <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                    <PiCalculator className="w-6 h-6 text-primary-500" />
                  Estimativa de Preços
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">
                      {calculations.totalArea.toFixed(2)} m²
                    </p>
                    <p className="text-sm text-gray-600">Área Total</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">
                      R$ {calculations.averagePricePerM2.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Preço Médio/m²</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">
                      R$ {calculations.estimatedTotalValue.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">Valor Estimado</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-secondary-800">Detalhamento por Ambiente:</h3>
                  {calculations.breakdown.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium capitalize">{item.environment}</span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{item.area.toFixed(2)} m² × R$ {item.pricePerM2.toFixed(2)}</p>
                        <p className="font-semibold text-primary-600">R$ {item.totalValue.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Imagens de Referência */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                <FiImage className="w-6 h-6 text-primary-500" />
                Imagens de Referência (Pinterest, Instagram, etc.)
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="reference-images"
                />
                <label
                  htmlFor="reference-images"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <FiUpload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {uploadingImages ? 'Enviando imagens...' : 'Clique para enviar imagens'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF até 5MB cada (máximo 5 imagens)
                    </p>
                  </div>
                </label>
              </div>

              {referenceImages.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {referenceImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Referência ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeReferenceImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Detalhes do Projeto */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-secondary-800 mb-6">
                Detalhes do Projeto
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Descrição do Projeto
                  </label>
                  <textarea
                    {...register('projectDetails.description')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                    placeholder="Conte-nos mais sobre seu projeto, suas expectativas e necessidades..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Faixa de Orçamento
                    </label>
                    <select
                      {...register('projectDetails.budget')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="nao_definido">Não definido</option>
                      <option value="ate_10k">Até R$ 10.000</option>
                      <option value="10k_25k">R$ 10.000 - R$ 25.000</option>
                      <option value="25k_50k">R$ 25.000 - R$ 50.000</option>
                      <option value="50k_100k">R$ 50.000 - R$ 100.000</option>
                      <option value="acima_100k">Acima de R$ 100.000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Prazo Desejado
                    </label>
                    <select
                      {...register('projectDetails.timeline')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="sem_pressa">Sem pressa</option>
                      <option value="urgente">Urgente (até 1 mês)</option>
                      <option value="1_mes">1 mês</option>
                      <option value="2_3_meses">2-3 meses</option>
                      <option value="3_6_meses">3-6 meses</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Requisitos Especiais
                  </label>
                  <textarea
                    {...register('projectDetails.specialRequirements')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Alguma necessidade especial, acessibilidade, funcionalidades específicas..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <button
                type="submit"
                disabled={isSubmitting || environments.length === 0}
                className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Orçamento Completo'}
              </button>
              
              <p className="text-sm text-gray-600 mt-4">
                * Campos obrigatórios. Entraremos em contato em até 24 horas.
              </p>
            </motion.div>
          </form>
        </div>
      </section>
    </div>
  );
}