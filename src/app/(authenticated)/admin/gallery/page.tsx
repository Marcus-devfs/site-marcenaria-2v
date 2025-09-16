'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUpload,
  FiImage,
  FiTrash2,
  FiEdit,
  FiEye,
  FiPlus,
  FiSearch,
  FiFilter,
  FiX
} from 'react-icons/fi';
import { apiService } from '@/lib/api';
import { Image } from '@/types';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const fetchedImages = await apiService.getImages();
      setImages(Array.isArray(fetchedImages) ? fetchedImages : []);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      toast.error('Erro ao carregar imagens');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) {
      return;
    }

    try {
      await apiService.deleteImage(imageId);
      toast.success('Imagem excluída com sucesso!');
      fetchImages();
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const handleUploadImage = async (uploadData: {
    file: File;
    title: string;
    description: string;
    category: string;
    section: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);

      // Usar valores padrão para os parâmetros da API
      const categoryId = '1'; // ID da categoria (pode ser configurável)
      const namePerfil = 'admin'; // Nome do perfil
      const level = '1'; // Nível
      const section = uploadData.section || 'Galeria';

      await apiService.uploadImage(formData, categoryId, namePerfil, level, section);
      toast.success('Imagem enviada com sucesso!');
      setShowUploadModal(false);
      fetchImages();
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error('Erro ao enviar imagem');
    }
  };

  const categories = Array.from(new Set(images.map(img => img.category))).filter(Boolean);
  const filteredImages = images.filter(img => {
    const matchesSearch = searchTerm ? img.title?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = !selectedCategory || img.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('images', images);
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Galeria de Imagens</h1>
          <p className="text-gray-600">Gerencie as imagens da galeria do site</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiUpload className="w-4 h-4" />
          Enviar Imagem
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
                placeholder="Buscar imagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={image.url}
                alt={image.title || 'Imagem'}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/300';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setSelectedImage(image)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FiEye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
              {image.category && (
                <div className="absolute top-2 left-2">
                  <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {image.category}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">
                {decodeURIComponent(image?.key?.split('-').pop() || '') || 'Sem título'}
              </h3>
              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {image.description}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{image.category}</span>
                <span>{new Date((image as any).createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory ? 'Nenhuma imagem encontrada' : 'Nenhuma imagem cadastrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory
              ? 'Tente ajustar os filtros de busca'
              : 'Comece enviando sua primeira imagem'
            }
          </p>
          {!searchTerm && !selectedCategory && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              Enviar Primeira Imagem
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadImage}
        />
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

// Componente do Modal de Upload
function UploadModal({ onClose, onUpload }: {
  onClose: () => void;
  onUpload: (data: {
    file: File;
    title: string;
    description: string;
    category: string;
    section: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    section: 'Galeria'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Selecione uma imagem');
      return;
    }

    if (!formData.category) {
      toast.error('Selecione uma categoria');
      return;
    }

    setIsUploading(true);

    await onUpload({
      file: selectedFile,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      section: formData.section
    });

    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Enviar Imagem</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Título da imagem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Descrição da imagem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Cozinha">Cozinha</option>
              <option value="Quarto">Quarto</option>
              <option value="Sala">Sala</option>
              <option value="Banheiro">Banheiro</option>
              <option value="Escritório">Escritório</option>
              <option value="Área Externa">Área Externa</option>
            </select>
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
              disabled={isUploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente do Modal de Preview
function ImagePreviewModal({ image, onClose }: { image: Image; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-75 flex items-center justify-center z-50">
      <div className="max-w-4xl max-h-[90vh] w-full mx-4">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {image.title || 'Visualização da Imagem'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="p-4">
            <img
              src={image.url}
              alt={image.title || 'Imagem'}
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/400/300';
              }}
            />
            {image.description && (
              <p className="mt-4 text-gray-600">{image.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
