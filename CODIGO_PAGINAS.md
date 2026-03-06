# LK Street - Páginas do Sistema (Parte 2)

---

## 🔑 3. PÁGINA DE LOGIN
### `/src/app/pages/Login.tsx`

```typescript
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
    
    setTimeout(() => {
      const result = auth.login(username, password);
      
      if (result.success) {
        toast.success(\`Bem-vindo, \${result.user?.name}!\`);
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
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-[#0f4fa8]">LK</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LK Street</h1>
          <p className="text-blue-100">Sistema de Gestão</p>
        </div>

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
```

---

## 📊 4. DASHBOARD
### `/src/app/pages/Dashboard.tsx`

```typescript
import { DollarSign, TrendingDown, TrendingUp, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../services/database';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    faturamento: 0,
    despesas: 0,
    lucro: 0,
    totalVendas: 0,
    topProdutos: [] as { id: number; nome: string; quantidade: number }[]
  });

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    db.updateCustomerPurchaseCounts();
    const report = db.getReport();
    setReport(report);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
        <div className="bg-[#0f4fa8] text-white text-center py-4 px-4 font-bold text-lg">
          LK Street - Dashboard
        </div>
        
        <div className="p-5">
          <div className="space-y-4 mb-6">
            <div className="bg-[#1e73d8] text-white p-4 rounded-[10px] font-bold flex items-center justify-between">
              <span>Faturamento</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>R$ {report.faturamento.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-[#e74c3c] text-white p-4 rounded-[10px] font-bold flex items-center justify-between">
              <span>Despesas</span>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                <span>R$ {report.despesas.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-[#27ae60] text-white p-4 rounded-[10px] font-bold flex items-center justify-between">
              <span>Lucro Líquido</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>R$ {report.lucro.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-[#f39c12] text-white p-4 rounded-[10px] font-bold flex items-center justify-between">
              <span>Vendas do Mês</span>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>{report.totalVendas}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-gray-800">Top Produtos</h4>
            <div className="space-y-0">
              {report.topProdutos.length > 0 ? (
                report.topProdutos.map((product, index) => (
                  <div 
                    key={product.id}
                    className="py-3 border-b border-gray-200 text-sm text-gray-700 flex justify-between items-center"
                  >
                    <span>{index + 1}. {product.nome}</span>
                    <span className="text-gray-500">{product.quantidade} vendas</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-3">Nenhuma venda registrada</p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/relatorios')}
            className="w-full mt-6 py-3 bg-[#0f4fa8] text-white rounded-lg font-bold hover:bg-[#0d3f8a] transition-colors"
          >
            Ver Relatório Completo
          </button>
        </div>
      </div>
    </div>
  );
}
```

Devido ao tamanho, vou criar arquivos adicionais para as demais páginas. Você quer que eu continue criando arquivos separados para cada página, ou prefere que eu forneça links para download dos arquivos completos?
