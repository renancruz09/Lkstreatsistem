import { useState } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../services/auth';
import { toast } from 'sonner';
import { Lock, User, LogIn } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      const result = auth.login(username, password);
      
      if (result.success) {
        toast.success(`Bem-vindo, ${result.user?.name}!`);
        navigate('/');
      } else {
        toast.error(result.error || 'Erro ao fazer login');
      }
      
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f4fa8] to-[#1e73d8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#0f4fa8]">LK</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LK Street</h1>
          <p className="text-blue-100">Sistema de Gestão</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Fazer Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8] focus:border-transparent"
                  placeholder="Digite seu usuário"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8] focus:border-transparent"
                  placeholder="Digite sua senha"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f4fa8] text-white py-3 rounded-lg font-bold hover:bg-[#0d3f8a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Credenciais de teste */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Credenciais de teste:
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👤 <strong>admin</strong> / senha: <strong>admin123</strong></p>
              <p>👤 <strong>gerente</strong> / senha: <strong>gerente123</strong></p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-100 text-sm mt-6">
          © 2026 LK Street. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
