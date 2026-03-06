import { DollarSign, TrendingDown, TrendingUp, ShoppingBag, Package, Users, Calendar, Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db, Expense } from '../services/database';
import { toast } from 'sonner';

type FilterType = 'today' | 'month' | 'year' | 'all';

export function Reports() {
  const [report, setReport] = useState({
    faturamento: 0,
    despesas: 0,
    lucro: 0,
    totalVendas: 0,
    ticketMedio: 0,
    vendasPorDia: {} as { [key: number]: { vendas: number; receita: number } },
    topProdutos: [] as { id: number; nome: string; quantidade: number }[]
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<FilterType>('month');
  
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editExpenseData, setEditExpenseData] = useState({ descricao: '', valor: '' });
  
  const [newExpense, setNewExpense] = useState({ descricao: '', valor: '' });

  useEffect(() => {
    loadReport();
  }, [filter]);

  const loadReport = () => {
    const data = db.getReport();
    const products = db.getAllProducts();
    const customers = db.getAllCustomers();
    const allExpenses = db.getAllExpenses();

    setReport(data);
    setTotalProducts(products.reduce((sum, p) => sum + p.estoque, 0));
    setTotalCustomers(customers.length);
    setExpenses(allExpenses);
  };

  const getSalesForFilter = () => {
    const sales = db.getAllSales();
    const now = new Date();

    switch (filter) {
      case 'today':
        return sales.filter(s => {
          const saleDate = new Date(s.data);
          return saleDate.toDateString() === now.toDateString();
        });
      
      case 'month':
        return sales.filter(s => {
          const saleDate = new Date(s.data);
          return saleDate.getMonth() === now.getMonth() && 
                 saleDate.getFullYear() === now.getFullYear();
        });
      
      case 'year':
        return sales.filter(s => {
          const saleDate = new Date(s.data);
          return saleDate.getFullYear() === now.getFullYear();
        });
      
      case 'all':
      default:
        return sales;
    }
  };

  const getFilteredStats = () => {
    const sales = getSalesForFilter();
    const faturamento = sales.reduce((sum, s) => sum + s.total, 0);
    const despesas = expenses.reduce((sum, e) => sum + e.valor, 0);
    const lucro = faturamento - despesas;
    const totalVendas = sales.length;
    const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

    return { faturamento, despesas, lucro, totalVendas, ticketMedio };
  };

  const stats = getFilteredStats();

  const handleAddExpense = () => {
    if (!newExpense.descricao || !newExpense.valor) {
      toast.error('Preencha descrição e valor');
      return;
    }

    db.addExpense({
      descricao: newExpense.descricao,
      valor: Number(newExpense.valor)
    });

    toast.success('Despesa adicionada!');
    setNewExpense({ descricao: '', valor: '' });
    loadReport();
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditExpenseData({
      descricao: expense.descricao,
      valor: expense.valor.toString()
    });
  };

  const handleSaveExpense = () => {
    if (!editExpenseData.descricao || !editExpenseData.valor) {
      toast.error('Preencha todos os campos');
      return;
    }

    const success = db.updateExpense(editingExpenseId!, {
      descricao: editExpenseData.descricao,
      valor: Number(editExpenseData.valor)
    });

    if (success) {
      toast.success('Despesa atualizada!');
      setEditingExpenseId(null);
      loadReport();
    } else {
      toast.error('Erro ao atualizar despesa');
    }
  };

  const handleDeleteExpense = (id: number, descricao: string) => {
    if (!confirm(`Deseja realmente excluir a despesa "${descricao}"?`)) {
      return;
    }

    const success = db.deleteExpense(id);
    
    if (success) {
      toast.success('Despesa excluída!');
      loadReport();
    } else {
      toast.error('Erro ao excluir despesa');
    }
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const salesByDay = [1, 2, 3, 4, 5, 6].map(day => ({
    day: diasSemana[day],
    sales: report.vendasPorDia[day]?.vendas || 0,
    revenue: report.vendasPorDia[day]?.receita || 0
  }));

  const maxSales = Math.max(...salesByDay.map(d => d.sales), 1);
  
  const topCategories = report.topProdutos.slice(0, 3).map((p) => {
    const total = report.topProdutos.reduce((sum, prod) => sum + prod.quantidade, 0);
    const percentage = total > 0 ? (p.quantidade / total) * 100 : 0;
    return {
      name: p.nome,
      sales: p.quantidade,
      percentage: Math.round(percentage)
    };
  });

  const getFilterLabel = () => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return `Hoje - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      case 'month':
        return `Mês Atual - ${now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
      case 'year':
        return `Ano Atual - ${now.getFullYear()}`;
      case 'all':
        return 'Todos os Registros';
      default:
        return '';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Filtro de Período */}
      <div className="bg-white rounded-[20px] shadow-lg p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Período de Análise</h3>
            <p className="text-sm text-gray-600">{getFilterLabel()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'today'
                  ? 'bg-[#0f4fa8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'month'
                  ? 'bg-[#0f4fa8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setFilter('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'year'
                  ? 'bg-[#0f4fa8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ano
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[#0f4fa8] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento */}
        <div className="bg-gradient-to-br from-[#27ae60] to-[#2ecc71] text-white rounded-[20px] shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Faturamento</p>
            <p className="text-2xl font-bold">R$ {stats.faturamento.toFixed(2)}</p>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-gradient-to-br from-[#e74c3c] to-[#c0392b] text-white rounded-[20px] shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingDown className="w-8 h-8" />
            <Calendar className="w-5 h-5 opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Despesas</p>
            <p className="text-2xl font-bold">R$ {stats.despesas.toFixed(2)}</p>
          </div>
        </div>

        {/* Lucro */}
        <div className={`bg-gradient-to-br ${
          stats.lucro >= 0 
            ? 'from-[#3498db] to-[#2980b9]' 
            : 'from-[#e67e22] to-[#d35400]'
        } text-white rounded-[20px] shadow-lg p-5`}>
          <div className="flex items-center justify-between mb-3">
            <ShoppingBag className="w-8 h-8" />
            {stats.lucro >= 0 ? (
              <TrendingUp className="w-5 h-5 opacity-80" />
            ) : (
              <TrendingDown className="w-5 h-5 opacity-80" />
            )}
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Lucro Líquido</p>
            <p className="text-2xl font-bold">R$ {stats.lucro.toFixed(2)}</p>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-gradient-to-br from-[#9b59b6] to-[#8e44ad] text-white rounded-[20px] shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8" />
            <Package className="w-5 h-5 opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Ticket Médio</p>
            <p className="text-2xl font-bold">R$ {stats.ticketMedio.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vendas por Dia da Semana */}
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="bg-[#0f4fa8] text-white text-center py-4 px-4 font-bold">
            Vendas por Dia da Semana
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {salesByDay.map(item => (
                <div key={item.day}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.day}</span>
                    <span className="text-gray-600">{item.sales} vendas - R$ {item.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0f4fa8] h-2 rounded-full transition-all"
                      style={{ width: `${(item.sales / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Produtos */}
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="bg-[#27ae60] text-white text-center py-4 px-4 font-bold">
            Top Produtos Vendidos
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {topCategories.length > 0 ? (
                topCategories.map((cat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-gray-600">{cat.sales} vendas ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#27ae60] h-2 rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma venda registrada</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gerenciamento de Despesas */}
      <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
        <div className="bg-[#e74c3c] text-white text-center py-4 px-4 font-bold">
          Gerenciar Despesas
        </div>
        <div className="p-5">
          {/* Adicionar Nova Despesa */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Nova Despesa</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={newExpense.descricao}
                onChange={(e) => setNewExpense({ ...newExpense, descricao: e.target.value })}
                placeholder="Descrição"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
              />
              <input
                type="number"
                step="0.01"
                value={newExpense.valor}
                onChange={(e) => setNewExpense({ ...newExpense, valor: e.target.value })}
                placeholder="Valor"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
              />
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Lista de Despesas */}
          <div className="space-y-3">
            {expenses.map(expense => (
              <div key={expense.id} className="p-4 border border-gray-200 rounded-lg">
                {editingExpenseId === expense.id ? (
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={editExpenseData.descricao}
                      onChange={(e) => setEditExpenseData({ ...editExpenseData, descricao: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editExpenseData.valor}
                      onChange={(e) => setEditExpenseData({ ...editExpenseData, valor: e.target.value })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                    />
                    <button
                      onClick={handleSaveExpense}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingExpenseId(null)}
                      className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">{expense.descricao}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-red-600">
                        R$ {expense.valor.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id, expense.descricao)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-[20px] shadow-lg p-5 text-center">
          <Package className="w-12 h-12 text-[#0f4fa8] mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Produtos em Estoque</p>
          <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-[20px] shadow-lg p-5 text-center">
          <Users className="w-12 h-12 text-[#27ae60] mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Clientes Cadastrados</p>
          <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
        </div>
        
        <div className="bg-white rounded-[20px] shadow-lg p-5 text-center">
          <ShoppingBag className="w-12 h-12 text-[#e74c3c] mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Total de Vendas</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalVendas}</p>
        </div>
      </div>
    </div>
  );
}
