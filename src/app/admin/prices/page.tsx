'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiDollarSign,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { PriceConfig } from '@/types';
import toast from 'react-hot-toast';

export default function AdminPrices() {
  const [priceConfigs, setPriceConfigs] = useState<PriceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<PriceConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('');

  useEffect(() => {
    fetchPriceConfigs();
  }, []);

  const fetchPriceConfigs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPriceConfigs();
      const configs = Array.isArray(response) ? response : response?.data || [];
      setPriceConfigs(configs);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações de preço');
      setPriceConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrice = async (priceId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta configuração?')) {
      return;
    }

    try {
      await apiService.deletePriceConfig(priceId);
      toast.success('Configuração excluída com sucesso!');
      fetchPriceConfigs();
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
      toast.error('Erro ao excluir configuração');
    }
  };

  const handleSavePrice = async (priceData: any) => {
    try {
      if (editingPrice) {
        await apiService.updatePriceConfig(editingPrice._id!, priceData);
        toast.success('Configuração atualizada com sucesso!');
      } else {
        await apiService.createPriceConfig(priceData);
        toast.success('Configuração criada com sucesso!');
      }
      setShowFormModal(false);
      setEditingPrice(null);
      fetchPriceConfigs();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração');
    }
  };

  const environments = Array.from(new Set(priceConfigs.map(config => config.environment))).filter(Boolean);
  const filteredConfigs = priceConfigs.filter(config => {
    const matchesSearch = 
      config.environment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.woodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.thickness?.includes(searchTerm);
    const matchesEnvironment = !environmentFilter || config.environment === environmentFilter;
    return matchesSearch && matchesEnvironment;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="animate-pulse">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de Preço</h1>
          <p className="text-gray-600">Gerencie os preços por m² para diferentes ambientes e materiais</p>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Nova Configuração
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar configurações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os ambientes</option>
              {environments.map(environment => (
                <option key={environment} value={environment}>
                  {environment.charAt(0).toUpperCase() + environment.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Configs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Configurações ({filteredConfigs.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ambiente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Madeira
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espessura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço/m²
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConfigs.map((config, index) => (
                <motion.tr
                  key={config._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {config.environment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {config.woodType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {config.thickness}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    R$ {config.pricePerM2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      config.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {config.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPrice(config);
                          setShowFormModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrice(config._id!)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConfigs.length === 0 && (
          <div className="text-center py-12">
            <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || environmentFilter ? 'Nenhuma configuração encontrada' : 'Nenhuma configuração cadastrada'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || environmentFilter 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira configuração de preço'
              }
            </p>
            {!searchTerm && !environmentFilter && (
              <button
                onClick={() => setShowFormModal(true)}
                className="btn-primary"
              >
                Criar Primeira Configuração
              </button>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <PriceConfigModal
          config={editingPrice}
          onClose={() => {
            setShowFormModal(false);
            setEditingPrice(null);
          }}
          onSave={handleSavePrice}
        />
      )}
    </div>
  );
}

// Componente do Modal de Configuração de Preço
function PriceConfigModal({ 
  config, 
  onClose, 
  onSave 
}: { 
  config: PriceConfig | null; 
  onClose: () => void; 
  onSave: (data: any) => void; 
}) {
  const [formData, setFormData] = useState({
    environment: config?.environment || 'cozinha',
    woodType: config?.woodType || 'branca',
    thickness: config?.thickness || '18mm',
    pricePerM2: config?.pricePerM2 || 0,
    complexityMultipliers: {
      basic: config?.complexityMultipliers?.basic || 1.0,
      medium: config?.complexityMultipliers?.medium || 1.2,
      complex: config?.complexityMultipliers?.complex || 1.5,
    },
    notes: config?.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {config ? 'Editar Configuração' : 'Nova Configuração de Preço'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ambiente
              </label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                {environmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Madeira
              </label>
              <select
                value={formData.woodType}
                onChange={(e) => setFormData({ ...formData, woodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                {woodTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Espessura
              </label>
              <select
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                {thicknessOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço por m² (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.pricePerM2}
              onChange={(e) => setFormData({ ...formData, pricePerM2: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multiplicadores por Complexidade
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Básico</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.complexityMultipliers.basic}
                  onChange={(e) => setFormData({
                    ...formData,
                    complexityMultipliers: {
                      ...formData.complexityMultipliers,
                      basic: parseFloat(e.target.value) || 1.0
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Médio</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.complexityMultipliers.medium}
                  onChange={(e) => setFormData({
                    ...formData,
                    complexityMultipliers: {
                      ...formData.complexityMultipliers,
                      medium: parseFloat(e.target.value) || 1.2
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Complexo</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.complexityMultipliers.complex}
                  onChange={(e) => setFormData({
                    ...formData,
                    complexityMultipliers: {
                      ...formData.complexityMultipliers,
                      complex: parseFloat(e.target.value) || 1.5
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Observações sobre esta configuração..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : (config ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
