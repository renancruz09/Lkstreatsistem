import { Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">StartupTech</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Recursos
            </a>
            <a href="#precos" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Preços
            </a>
            <a href="#sobre" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Sobre
            </a>
            <a href="#contato" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Contato
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Entrar
            </button>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Começar grátis
            </button>
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
