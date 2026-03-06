# 🏪 LK STREET - TODO O CÓDIGO WEB (HTML/JSX) EM UM SÓ ARQUIVO

**Sistema Completo de Gestão para Loja de Roupas**

🔑 **Login:** admin / admin123 ou gerente / gerente123

---

## 📋 SUMÁRIO

Este arquivo contém **TODOS OS 11 ARQUIVOS** do sistema em um só lugar:

1. [App.tsx](#1-apptsx) - Aplicação principal
2. [routes.tsx](#2-routestsx) - Rotas do sistema
3. [Layout.tsx](#3-layouttsx) - Menu e navegação (130 linhas)
4. [ProtectedRoute.tsx](#4-protectedroutetsx) - Proteção de rotas
5. [Login.tsx](#5-logintsx) - Tela de login (132 linhas)
6. [Dashboard.tsx](#6-dashboardtsx) - Dashboard (106 linhas)
7. [NewSale.tsx](#7-newsaletsx) - Sistema de vendas (372 linhas)
8. [ProductRegister.tsx](#8-productregistertsx) - Cadastro de produtos (371 linhas)
9. [CustomerRegister.tsx](#9-customerregistertsx) - Cadastro de clientes (305 linhas)
10. [SalesHistory.tsx](#10-saleshistorytsx) - Histórico de vendas (185 linhas)
11. [Reports.tsx](#11-reportstsx) - Relatórios completos (477 linhas)

**TOTAL: 2.079 linhas de código JSX/TSX**

---

## 1. App.tsx

**Caminho:** `/src/app/App.tsx`

```tsx
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}
```

---

## 2. routes.tsx

**Caminho:** `/src/app/routes.tsx`

```tsx
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { NewSale } from "./pages/NewSale";
import { ProductRegister } from "./pages/ProductRegister";
import { CustomerRegister } from "./pages/CustomerRegister";
import { Reports } from "./pages/Reports";
import { Login } from "./pages/Login";
import { SalesHistory } from "./pages/SalesHistory";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "nova-venda", Component: NewSale },
      { path: "historico-vendas", Component: SalesHistory },
      { path: "cadastro-produto", Component: ProductRegister },
      { path: "cadastro-cliente", Component: CustomerRegister },
      { path: "relatorios", Component: Reports },
    ],
  },
]);
```

---

## 3. Layout.tsx

**Caminho:** `/src/app/components/Layout.tsx`

```tsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, History, LogOut } from 'lucide-react';
import { auth } from '../services/auth';
import { toast } from 'sonner';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.getCurrentUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      auth.logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-[#0f4fa8]">LK Street</h1>
              <p className="text-gray-600">Sistema de Gestão</p>
            </div>
            {currentUser && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">@{currentUser.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <nav className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/') 
                  ? 'bg-[#0f4fa8] text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            
            <Link
              to="/nova-venda"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/nova-venda') 
                  ? 'bg-[#0f4fa8] text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Nova Venda
            </Link>

            <Link
              to="/historico-vendas"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/historico-vendas') 
                  ? 'bg-[#0f4fa8] text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              Histórico
            </Link>
            
            <Link
              to="/cadastro-produto"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/cadastro-produto') 
                  ? 'bg-[#0f4fa8] text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Produtos
            </Link>
            
            <Link
              to="/cadastro-cliente"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/cadastro-cliente') 
                  ? 'bg-[#0f4fa8] text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Clientes
            </Link>
            
            <Link
              to="/relatorios"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/relatorios') 
                  ? 'bg-[#0f4fa8] text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Relatórios
            </Link>
          </div>
        </nav>
        
        <Outlet />
      </div>
    </div>
  );
}
```

---

## 4. ProtectedRoute.tsx

**Caminho:** `/src/app/components/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router';
import { auth } from '../services/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

## 5. Login.tsx

**Caminho:** `/src/app/pages/Login.tsx`

```tsx
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
```

---

## 6. Dashboard.tsx

**Caminho:** `/src/app/pages/Dashboard.tsx`

```tsx
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
          {/* Cards de métricas */}
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
          
          {/* Top Produtos */}
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

**CONTINUA... (Arquivo muito longo, dividi em partes)**

---

Devido ao limite de tamanho do arquivo, criei a primeira parte. Quer que eu continue com os arquivos restantes (NewSale, ProductRegister, CustomerRegister, SalesHistory e Reports) em arquivos adicionais ou em partes menores?

Ou prefere que eu crie um arquivo compactado ou em formato diferente?
