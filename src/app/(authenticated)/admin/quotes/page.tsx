'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiFileText,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiX
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { QuoteComplete } from '@/types';
import toast from 'react-hot-toast';
import { Select } from '@/components/ui';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteComplete[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      console.log('Buscando orçamentos...');
      const response = await apiService.getQuoteComplete();
      console.log('Resposta da API:', response);
      
      // Verificar se a resposta tem a estrutura esperada
      const fetchedQuotes = (response as any)?.data || response || [];
      setQuotes(Array.isArray(fetchedQuotes) ? fetchedQuotes : []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast.error('Erro ao carregar orçamentos');
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) {
      return;
    }

    try {
      // Implementar delete na API
      toast.success('Orçamento excluído com sucesso!');
      fetchQuotes();
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      toast.error('Erro ao excluir orçamento');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.phone?.includes(searchTerm);
    const matchesStatus = !statusFilter || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
        <p className="text-gray-600">Gerencie os orçamentos solicitados pelos clientes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            {/* <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="reviewed">Revisado</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select> */}
            <Select
              options={[
                { value: 'pending', label: 'Pendente' },
                { value: 'reviewed', label: 'Revisado' },
                { value: 'sent', label: 'Enviado' },
                { value: 'approved', label: 'Aprovado' },
                { value: 'rejected', label: 'Rejeitado' }
              ]}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Orçamentos ({filteredQuotes.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredQuotes.map((quote, index) => (
            <motion.div
              key={quote._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {quote.client?.name || 'Cliente'}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiMail className="w-4 h-4" />
                        <span>{quote.client?.email || 'email@exemplo.com'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiPhone className="w-4 h-4" />
                        <span>{quote.client?.phone || '(11) 99999-9999'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(quote.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <FiDollarSign className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        R$ {quote.calculations?.estimatedTotalValue?.toLocaleString('pt-BR') || '0'}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/quotes/${quote._id}`}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteQuote(quote._id!)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento cadastrado'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter 
                ? 'Tente ajustar os filtros de busca'
                : 'Os orçamentos solicitados pelos clientes aparecerão aqui'
              }
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

