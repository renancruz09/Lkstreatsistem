import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-white">StartupTech</span>
            </div>
            <p className="text-gray-400 mb-6">
              Acelerando startups de tecnologia com as melhores ferramentas do mercado.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrações</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Parceiros</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Comunidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 StartupTech. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              Termos
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
