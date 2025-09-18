'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiHome,
  FiEdit,
  FiX,
  FiImage,
  FiPackage
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { QuoteComplete } from '@/types';
import toast from 'react-hot-toast';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchQuote();
    }
  }, [params.id]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      console.log('Buscando orçamento com ID:', params.id);
      const response = await apiService.getQuoteById(params.id as string);
      console.log('Resposta da API:', response);
      
      // Verificar se a resposta tem a estrutura esperada
      const quoteData = (response as any)?.data || response;
      console.log('Dados do orçamento:', quoteData);
      
      if (!quoteData) {
        throw new Error('Orçamento não encontrado');
      }
      
      setQuote(quoteData);
      setSelectedStatus(quoteData.status);
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
      toast.error('Erro ao carregar orçamento');
      router.push('/admin/quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!quote || !quote._id || selectedStatus === quote.status) return;

    try {
      await apiService.updateQuoteStatus(quote._id, selectedStatus);
      setQuote({ ...quote, status: selectedStatus as any });
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'reviewed': return 'Revisado';
      case 'sent': return 'Enviado';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'cozinha': return '🍳';
      case 'quarto': return '🛏️';
      case 'sala': return '🛋️';
      case 'banheiro': return '🚿';
      case 'escritorio': return '💼';
      case 'area_externa': return '🌳';
      default: return '🏠';
    }
  };

  const getWoodTypeLabel = (woodType: string) => {
    switch (woodType) {
      case 'branca': return 'Madeira Branca';
      case 'madeirado': return 'Madeirado (+10%)';
      default: return woodType;
    }
  };

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case 'ate_10k': return 'Até R$ 10.000';
      case '10k_25k': return 'R$ 10.000 - R$ 25.000';
      case '25k_50k': return 'R$ 25.000 - R$ 50.000';
      case '50k_100k': return 'R$ 50.000 - R$ 100.000';
      case 'acima_100k': return 'Acima de R$ 100.000';
      case 'nao_definido': return 'Não definido';
      default: return budget;
    }
  };

  const getTimelineLabel = (timeline: string) => {
    switch (timeline) {
      case 'urgente': return 'Urgente';
      case '1_mes': return '1 mês';
      case '2_3_meses': return '2-3 meses';
      case '3_6_meses': return '3-6 meses';
      case 'sem_pressa': return 'Sem pressa';
      default: return timeline;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Orçamento não encontrado</h2>
          <p className="text-gray-600 mb-4">O orçamento solicitado não foi encontrado.</p>
          <button
            onClick={() => router.push('/admin/quotes')}
            className="btn-primary"
          >
            Voltar para Orçamentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/quotes')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Orçamento #{quote._id ? quote._id.slice(-8) : 'N/A'}
                </h1>
                <p className="text-sm text-gray-600">
                  Criado em {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(quote.status || 'pending')}`}>
                {getStatusLabel(quote.status || 'pending')}
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="reviewed">Revisado</option>
                  <option value="sent">Enviado</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={selectedStatus === (quote.status || 'pending')}
                  className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                Informações do Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900">{quote.client?.name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    {quote.client?.email || 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    {quote.client?.phone || 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contato Preferido</label>
                  <p className="text-gray-900 capitalize">{quote.client?.preferredContact || 'Não informado'}</p>
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiEdit className="w-5 h-5" />
                Detalhes do Projeto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento</label>
                  <p className="text-gray-900">{getBudgetLabel(quote.projectDetails?.budget || 'nao_definido')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                  <p className="text-gray-900">{getTimelineLabel(quote.projectDetails?.timeline || 'sem_pressa')}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <p className="text-gray-900">{quote.projectDetails?.description || 'Não informado'}</p>
              </div>
              {quote.projectDetails?.specialRequirements && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos Especiais</label>
                  <p className="text-gray-900">{quote.projectDetails.specialRequirements}</p>
                </div>
              )}
            </motion.div>

            {/* Environments and Furniture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiHome className="w-5 h-5" />
                Ambientes e Móveis
              </h2>
              <div className="space-y-6">
                {quote.environments?.map((environment, envIndex) => (
                  <div key={envIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{getEnvironmentIcon(environment.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {environment.name || environment.type}
                        </h3>
                        {environment.description && (
                          <p className="text-sm text-gray-600">{environment.description}</p>
                        )}
                      </div>
                    </div>

                    {environment.furnitureItems && environment.furnitureItems.length > 0 ? (
                      <div className="space-y-3">
                        {environment.furnitureItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Móvel</label>
                                <p className="text-gray-900 font-medium">{item.name}</p>
                                {item.variation && (
                                  <p className="text-sm text-gray-600">({item.variation})</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Madeira</label>
                                <p className="text-gray-900">{getWoodTypeLabel(item.woodType || 'branca')}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensões</label>
                                <p className="text-gray-900 text-sm">
                                  {item.measurements?.width && item.measurements?.height && item.measurements?.depth
                                    ? `${item.measurements.width}m × ${item.measurements.height}m × ${item.measurements.depth}m`
                                    : 'Não informado'
                                  }
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                                <p className="text-gray-900 font-medium">{item.area.toFixed(2)} m²</p>
                              </div>
                            </div>
                            {item.description && (
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <p className="text-gray-900 text-sm">{item.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhum móvel adicionado</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reference Images */}
            {quote.referenceImages && quote.referenceImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiImage className="w-5 h-5" />
                  Imagens de Referência
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quote.referenceImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.description || `Imagem ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {image.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg">
                          <p className="text-sm">{image.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calculations Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiDollarSign className="w-5 h-5" />
                Resumo Financeiro
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área Total</label>
                  <p className="text-2xl font-bold text-primary-600">{(quote.calculations?.totalArea).toFixed(2) || 0} m²</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Médio/m²</label>
                  <p className="text-2xl font-bold text-primary-600">
                    R$ {((quote.calculations?.averagePricePerM2) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total Estimado</label>
                  <p className="text-3xl font-bold text-primary-600">
                    R$ {(quote.calculations?.estimatedTotalValue || 0).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Detailed Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Detalhamento por Ambiente
              </h2>
              <div className="space-y-4">
                {quote.calculations?.breakdown?.map((breakdown, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {breakdown.environmentName}
                      </h4>
                      <span className="font-semibold text-primary-600">
                        R$ {breakdown.totalValue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                        {breakdown.items && breakdown.items.length > 0 && (
                          <div className="space-y-2">
                            {breakdown.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    {item.variation && (
                                      <span className="text-gray-500 ml-1">({item.variation})</span>
                                    )}
                                    {item.woodType === 'madeirado' && (
                                      <span className="text-orange-600 ml-1 font-medium">- Madeirado</span>
                                    )}
                                  </div>
                                  <span className="font-bold text-primary-600">R$ {item.totalValue.toLocaleString('pt-BR')}</span>
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                  <div>
                                    {item.area} m² × R$ {item.basePricePerM2.toLocaleString('pt-BR')}/m²
                                    {item.woodType === 'madeirado' && ' (+10%)'}
                                  </div>
                                  {item.priceConfig && (
                                    <div className="mt-2 p-2 bg-white rounded border-l-2 border-primary-200">
                                      <div className="font-medium text-gray-700 mb-1">Detalhes do Móvel:</div>
                                      <div className="text-xs text-gray-600">
                                        <div>Nome: {item.priceConfig.name}</div>
                                        <div>Preço Base: R$ {item.priceConfig.basePricePerM2.toLocaleString('pt-BR')}/m²</div>
                                        {item.priceConfig.description && (
                                          <div>Descrição: {item.priceConfig.description}</div>
                                        )}
                                        {item.priceConfig.variations && item.priceConfig.variations.length > 0 && (
                                          <div className="mt-1">
                                            <div className="font-medium">Variações disponíveis:</div>
                                            {item.priceConfig.variations.map((variation, vIndex) => (
                                              <div key={vIndex} className="ml-2">
                                                • {variation.name}: {variation.priceMultiplier}x
                                                {variation.description && ` (${variation.description})`}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        {item.priceConfig.specialRules && item.priceConfig.specialRules.length > 0 && (
                                          <div className="mt-1">
                                            <div className="font-medium">Regras especiais:</div>
                                            {item.priceConfig.specialRules.map((rule, rIndex) => (
                                              <div key={rIndex} className="ml-2">
                                                • {rule.condition}: {rule.priceMultiplier}x
                                                {rule.description && ` (${rule.description})`}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
