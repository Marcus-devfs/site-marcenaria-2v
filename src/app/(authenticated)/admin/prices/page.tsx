'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiDollarSign,
  FiSearch,
  FiSave
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

  useEffect(() => {
    fetchPriceConfigs();
  }, []);

  const fetchPriceConfigs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPriceConfigs();
      const configs = Array.isArray(response) ? response : (response as any)?.data || [];
      
      // Filtrar apenas configurações válidas com nome
      const validConfigs = configs.filter((config: any) => config && config.name);
      setPriceConfigs(validConfigs);
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

  const handleEditPrice = (price: PriceConfig) => {
    setEditingPrice(price);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingPrice(null);
  };

  const filteredConfigs = priceConfigs.filter(config =>
    config.name && config.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de Preços</h1>
          <p className="text-gray-600">Gerencie os preços dos móveis por metro quadrado</p>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Adicionar Móvel
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome do móvel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando configurações...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Móvel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Base/m²
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Regras Especiais
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
                {filteredConfigs.map((config) => (
                  <tr key={config._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {config.name || 'Nome não definido'}
                        </div>
                        {config.description && (
                          <div className="text-sm text-gray-500">
                            {config.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      R$ {(config.basePricePerM2 || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.variations?.length > 0 ? (
                        <div className="space-y-1">
                          {config.variations.map((variation, index) => (
                            <div key={index} className="text-xs">
                              {variation.name}: {variation.priceMultiplier}x
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Nenhuma</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.specialRules?.length > 0 ? (
                        <div className="space-y-1">
                          {config.specialRules.map((rule, index) => (
                            <div key={index} className="text-xs">
                              {rule.condition}: {rule.priceMultiplier}x
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Nenhuma</span>
                      )}
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPrice(config)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePrice(config._id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredConfigs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FiDollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma configuração encontrada</p>
            <button
              onClick={() => setShowFormModal(true)}
              className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Adicionar primeira configuração
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <PriceConfigModal
          config={editingPrice}
          onClose={handleCloseModal}
          onSave={fetchPriceConfigs}
        />
      )}
    </div>
  );
}

interface PriceConfigModalProps {
  config: PriceConfig | null;
  onClose: () => void;
  onSave: () => void;
}

function PriceConfigModal({ config, onClose, onSave }: PriceConfigModalProps) {
  const [formData, setFormData] = useState({
    name: config?.name || '',
    basePricePerM2: config?.basePricePerM2 || 0,
    description: config?.description || '',
    variations: config?.variations || [],
    specialRules: config?.specialRules || [],
    isActive: config?.isActive ?? true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome do móvel é obrigatório');
      return;
    }

    if (formData.basePricePerM2 <= 0) {
      toast.error('Preço por m² deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);
    try {
      if (config) {
        await apiService.updatePriceConfig(config._id!, formData);
        toast.success('Configuração atualizada com sucesso!');
      } else {
        await apiService.createPriceConfig(formData);
        toast.success('Configuração criada com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [...formData.variations, { name: '', priceMultiplier: 1.0, description: '' }]
    });
  };

  const removeVariation = (index: number) => {
    setFormData({
      ...formData,
      variations: formData.variations.filter((_, i) => i !== index)
    });
  };

  const updateVariation = (index: number, field: string, value: any) => {
    const updated = [...formData.variations];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, variations: updated });
  };

  const addSpecialRule = () => {
    setFormData({
      ...formData,
      specialRules: [...formData.specialRules, { condition: '', priceMultiplier: 1.0, description: '' }]
    });
  };

  const removeSpecialRule = (index: number) => {
    setFormData({
      ...formData,
      specialRules: formData.specialRules.filter((_, i) => i !== index)
    });
  };

  const updateSpecialRule = (index: number, field: string, value: any) => {
    const updated = [...formData.specialRules];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, specialRules: updated });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {config ? 'Editar Configuração' : 'Nova Configuração'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Móvel *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: GUARDA ROUPA"
                required
              />
            </div>

            {/* Preço Base */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Base por m² (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.basePricePerM2}
                onChange={(e) => setFormData({ ...formData, basePricePerM2: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 1550"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Descrição do móvel..."
              />
            </div>

            {/* Variações */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Variações (ex: liso/ripado)
                </label>
                <button
                  type="button"
                  onClick={addVariation}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  + Adicionar Variação
                </button>
              </div>
              
              {formData.variations.map((variation, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={variation.name}
                    onChange={(e) => updateVariation(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nome (ex: liso)"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={variation.priceMultiplier}
                    onChange={(e) => updateVariation(index, 'priceMultiplier', parseFloat(e.target.value) || 1.0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1.0"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Regras Especiais */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Regras Especiais (ex: area &gt; 1.0)
                </label>
                <button
                  type="button"
                  onClick={addSpecialRule}
                  className="text-primary-600 hover:text-primary-800 text-sm"
                >
                  + Adicionar Regra
                </button>
              </div>
              
              {formData.specialRules.map((rule, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={rule.condition}
                    onChange={(e) => updateSpecialRule(index, 'condition', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Condição (ex: width > 1.0)"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={rule.priceMultiplier}
                    onChange={(e) => updateSpecialRule(index, 'priceMultiplier', parseFloat(e.target.value) || 1.0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1.0"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecialRule(index)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Configuração ativa
              </label>
            </div>

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
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}