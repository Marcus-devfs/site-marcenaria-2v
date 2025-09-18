'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiStar,
  FiMessageSquare,
  FiUser,
  FiCalendar,
  FiSearch,
  FiImage,
  FiX,
  FiUpload
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { Testimonial } from '@/types';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const fetchedTestimonials = await apiService.getTestimonials();
      setTestimonials(Array.isArray(fetchedTestimonials) ? fetchedTestimonials : []);
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      toast.error('Erro ao carregar depoimentos');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) {
      return;
    }

    try {
      await apiService.deleteTestimonial(testimonialId);
      toast.success('Depoimento excluído com sucesso!');
      fetchTestimonials();
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error);
      toast.error('Erro ao excluir depoimento');
    }
  };

  const handleSaveTestimonial = async (testimonialData: any, image?: File) => {
    try {
      if (editingTestimonial) {
        await apiService.updateTestimonial(editingTestimonial._id, testimonialData, image);
        toast.success('Depoimento atualizado com sucesso!');
      } else {
        await apiService.createTestimonial(testimonialData, image);
        toast.success('Depoimento criado com sucesso!');
      }
      setShowFormModal(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      toast.error('Erro ao salvar depoimento');
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.project?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depoimentos</h1>
          <p className="text-gray-600">Gerencie os depoimentos dos clientes</p>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Novo Depoimento
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar depoimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.clientName}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingTestimonial(testimonial);
                      setShowFormModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.message}"
                </p>
              </div>

              {/* Image */}
              {testimonial.image?.url && (
                <div className="mb-4">
                  <div className="relative group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${testimonial.image.url}`}
                      alt={testimonial.image.description || 'Imagem do depoimento'}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <FiImage className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )}

              {/* Project and Date */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                {testimonial.project && (
                  <div className="flex items-center gap-1">
                    <FiMessageSquare className="w-4 h-4" />
                    <span>{testimonial.project}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(testimonial.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum depoimento encontrado' : 'Nenhum depoimento cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Tente ajustar o termo de busca'
              : 'Comece adicionando seu primeiro depoimento'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowFormModal(true)}
              className="btn-primary"
            >
              Adicionar Primeiro Depoimento
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          onClose={() => {
            setShowFormModal(false);
            setEditingTestimonial(null);
          }}
          onSave={handleSaveTestimonial}
        />
      )}
    </div>
  );
}

// Componente do Modal de Formulário
function TestimonialFormModal({ 
  testimonial, 
  onClose, 
  onSave 
}: { 
  testimonial: Testimonial | null; 
  onClose: () => void; 
  onSave: (data: any, image?: File) => void; 
}) {
  const [formData, setFormData] = useState({
    clientName: testimonial?.clientName || '',
    message: testimonial?.message || '',
    rating: testimonial?.rating || 5,
    project: testimonial?.project || '',
    imageDescription: testimonial?.image?.description || ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    testimonial?.image?.url ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${testimonial.image.url}` : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData, selectedImage || undefined);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {testimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    rating <= formData.rating
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  <FiStar className="w-4 h-4" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating} estrela{formData.rating !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projeto (opcional)
            </label>
            <input
              type="text"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Cozinha Planejada, Quarto Completo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depoimento
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Digite o depoimento do cliente..."
              required
            />
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Depoimento (opcional)
            </label>
            <div className="space-y-4">
              {/* Preview da imagem */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input de upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FiUpload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {imagePreview ? 'Trocar imagem' : 'Clique para adicionar uma imagem'}
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF até 5MB
                  </span>
                </label>
              </div>

              {/* Descrição da imagem */}
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Imagem (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.imageDescription}
                    onChange={(e) => setFormData({ ...formData, imageDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Print do WhatsApp, Foto do projeto..."
                  />
                </div>
              )}
            </div>
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
              {isSubmitting ? 'Salvando...' : (testimonial ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
