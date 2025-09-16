'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiSettings, 
  FiDollarSign, 
  FiFileText, 
  FiImage, 
  FiMessageSquare, 
  FiUsers, 
  FiLogOut,
  FiMenu,
  FiX,
  FiHome
} from 'react-icons/fi';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    setIsAuthenticated(true);
    
    // Carregar dados do usuário
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || 'Administrador',
          email: parsedUser.email || 'admin@mfplanejados.com',
          role: 'Admin'
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setUser({
          name: 'Administrador',
          email: 'admin@mfplanejados.com',
          role: 'Admin'
        });
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiHome,
      href: '/admin',
      description: 'Visão geral do sistema'
    },
    {
      id: 'prices',
      label: 'Configurações de Preço',
      icon: FiDollarSign,
      href: '/admin/prices',
      description: 'Gerenciar preços por m²'
    },
    {
      id: 'quotes',
      label: 'Orçamentos',
      icon: FiFileText,
      href: '/admin/quotes',
      description: 'Visualizar orçamentos solicitados'
    },
    {
      id: 'gallery',
      label: 'Galeria de Imagens',
      icon: FiImage,
      href: '/admin/gallery',
      description: 'Gerenciar imagens da galeria'
    },
    {
      id: 'testimonials',
      label: 'Depoimentos',
      icon: FiMessageSquare,
      href: '/admin/testimonials',
      description: 'Gerenciar depoimentos de clientes'
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: FiUsers,
      href: '/admin/users',
      description: 'Gerenciar usuários do sistema'
    }
  ];

  // Mostrar loading enquanto verifica autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FiSettings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MF Admin</h1>
              <p className="text-xs text-gray-500">Painel Administrativo</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <p>{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {menuItems.find(item => item.href === pathname)?.description || 'Painel administrativo'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#FF7C7C',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
