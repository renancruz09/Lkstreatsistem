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