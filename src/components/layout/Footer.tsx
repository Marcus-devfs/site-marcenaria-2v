'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiMessageCircle } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">MF</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">MF Planejados</h3>
                <p className="text-secondary-400 text-sm">Móveis sob medida</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-6 max-w-md">
              Transformamos seus sonhos em realidade com móveis planejados de alta qualidade. 
              Mais de 15 anos de experiência criando ambientes únicos e funcionais.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/m.f.planejados/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5511940718032?text=Olá, gostaria de solicitar um orçamento"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FiMessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              {/*<li>
                <Link href="/produtos" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  Produtos
                </Link>
              </li>*/}
              <li>
                <Link href="/galeria" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="/orcamento" className="text-secondary-300 hover:text-primary-400 transition-colors">
                  Orçamento
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <FiMail className="w-4 h-4" />
                </div>
                <a
                  href="mailto:edermarce1@yahoo.com.br"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  edermarce1@yahoo.com.br
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <FiPhone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+5511940718032"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  +55 (11) 94071-8032
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mt-1">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <a
                  href="https://www.google.com.br/maps/place/Av.+Guarapiranga,+3300+-+Jardim+Sao+Joaquim,+S%C3%A3o+Paulo+-+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  AV. Guarapiranga, 3.300 – JD. Alfredo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-secondary-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {currentYear} MF Planejados. Todos os direitos reservados.
            </p>
            <p className="text-secondary-400 text-sm mt-2 md:mt-0">
              Desenvolvido com ❤️ por Marcus-devfs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
