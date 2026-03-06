import { useState, useEffect } from 'react';
import { db, Sale } from '../services/database';
import { toast } from 'sonner';
import { Trash2, DollarSign, Calendar, CreditCard, Banknote, User, MessageSquare, Filter } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type FilterPeriod = 'all' | 'week' | 'month' | 'year';

export function SalesHistory() {
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    filterSalesByPeriod();
  }, [filterPeriod, allSales]);

  const loadSales = () => {
    const allSalesData = db.getAllSales();
    // Ordenar por data (mais recente primeiro)
    const sorted = allSalesData.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    setAllSales(sorted);
  };

  const filterSalesByPeriod = () => {
    const now = new Date();
    let filtered: Sale[] = [];

    switch (filterPeriod) {
      case 'week':
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
        filtered = allSales.filter(sale => 
          isWithinInterval(new Date(sale.data), { start: weekStart, end: weekEnd })
        );
        break;
      
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        filtered = allSales.filter(sale =>
          isWithinInterval(new Date(sale.data), { start: monthStart, end: monthEnd })
        );
        break;
      
      case 'year':
        const yearStart = startOfYear(now);
        const yearEnd = endOfYear(now);
        filtered = allSales.filter(sale =>
          isWithinInterval(new Date(sale.data), { start: yearStart, end: yearEnd })
        );
        break;
      
      case 'all':
      default:
        filtered = allSales;
        break;
    }

    setSales(filtered);
  };

  const handleDelete = (id: number, productName: string) => {
    if (!confirm(`Deseja realmente excluir a venda de "${productName}"?\n\nO estoque do produto será restaurado.`)) {
      return;
    }

    const result = db.deleteSale(id);
    
    if (result.success) {
      toast.success('Venda excluída com sucesso! Estoque restaurado.');
      loadSales();
    } else {
      toast.error(result.error || 'Erro ao excluir venda');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const totalVendas = sales.reduce((sum, sale) => sum + sale.total, 0);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'dinheiro':
        return <Banknote className="w-4 h-4 text-green-600" />;
      case 'cartao':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'pix':
        return <span className="text-xs font-bold text-purple-600">PIX</span>;
      default:
        return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'dinheiro':
        return 'Dinheiro';
      case 'cartao':
        return 'Cartão';
      case 'pix':
        return 'PIX';
      default:
        return method;
    }
  };

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'week':
        return 'desta semana';
      case 'month':
        return 'deste mês';
      case 'year':
        return 'deste ano';
      default:
        return 'total';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
        <div className="bg-[#0f4fa8] text-white text-center py-3 md:py-4 px-4 font-bold text-base md:text-lg">
          Histórico de Vendas
        </div>

        <div className="p-4 md:p-5">
          {/* Filtros de Período */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar por Período
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setFilterPeriod('all')}
                className={`py-2 px-3 text-xs md:text-sm rounded-lg font-medium transition-all ${
                  filterPeriod === 'all'
                    ? 'bg-[#0f4fa8] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tudo
              </button>
              <button
                onClick={() => setFilterPeriod('week')}
                className={`py-2 px-3 text-xs md:text-sm rounded-lg font-medium transition-all ${
                  filterPeriod === 'week'
                    ? 'bg-[#0f4fa8] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setFilterPeriod('month')}
                className={`py-2 px-3 text-xs md:text-sm rounded-lg font-medium transition-all ${
                  filterPeriod === 'month'
                    ? 'bg-[#0f4fa8] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setFilterPeriod('year')}
                className={`py-2 px-3 text-xs md:text-sm rounded-lg font-medium transition-all ${
                  filterPeriod === 'year'
                    ? 'bg-[#0f4fa8] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ano
              </button>
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-gradient-to-r from-[#27ae60] to-[#2ecc71] text-white p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total de Vendas {getPeriodLabel()}</p>
                <p className="text-2xl md:text-3xl font-bold">R$ {totalVendas.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Quantidade</p>
                <p className="text-2xl md:text-3xl font-bold">{sales.length}</p>
              </div>
            </div>
          </div>

          {/* Lista de Vendas */}
          {sales.length > 0 ? (
            <div className="space-y-3 max-h-[500px] md:max-h-[600px] overflow-y-auto">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-3 md:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base">{sale.produto_nome}</h3>
                      {sale.tamanho && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded inline-block mt-1">
                          Tamanho: {sale.tamanho}
                        </span>
                      )}
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-base md:text-lg font-bold text-green-600">R$ {sale.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">Qtd: {sale.quantidade}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-xs md:text-sm">{formatDate(sale.data)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(sale.formaPagamento)}
                      <span className="text-gray-600 text-xs md:text-sm">{getPaymentLabel(sale.formaPagamento)}</span>
                    </div>
                  </div>

                  {sale.cliente_nome && (
                    <div className="flex items-center gap-2 text-sm mb-2 p-2 bg-blue-50 rounded">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 font-medium text-xs md:text-sm">{sale.cliente_nome}</span>
                    </div>
                  )}

                  {sale.observacoes && (
                    <div className="flex items-start gap-2 text-sm mb-2 p-2 bg-gray-50 rounded">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-xs md:text-sm">{sale.observacoes}</span>
                    </div>
                  )}

                  {sale.desconto > 0 && (
                    <div className="text-xs text-orange-600 mb-2">
                      Desconto aplicado: {sale.desconto}%
                    </div>
                  )}

                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDelete(sale.id, sale.produto_nome)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden md:inline">Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Nenhuma venda encontrada</p>
              <p className="text-sm mt-1">
                {filterPeriod === 'all' 
                  ? 'Ainda não há vendas registradas'
                  : `Não há vendas ${getPeriodLabel()}`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
