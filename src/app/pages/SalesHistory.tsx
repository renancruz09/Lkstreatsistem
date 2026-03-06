import { useState, useEffect } from 'react';
import { db, Sale } from '../services/database';
import { toast } from 'sonner';
import { Trash2, DollarSign, Calendar, CreditCard, Banknote, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = () => {
    const allSales = db.getAllSales();
    // Ordenar por data (mais recente primeiro)
    const sorted = allSales.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    setSales(sorted);
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
        <div className="bg-[#0f4fa8] text-white text-center py-4 px-4 font-bold text-lg">
          Histórico de Vendas
        </div>

        <div className="p-5">
          {/* Resumo */}
          <div className="bg-gradient-to-r from-[#27ae60] to-[#2ecc71] text-white p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total de Vendas</p>
                <p className="text-3xl font-bold">R$ {totalVendas.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Quantidade</p>
                <p className="text-3xl font-bold">{sales.length}</p>
              </div>
            </div>
          </div>

          {/* Lista de Vendas */}
          {sales.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {sale.produto_nome}
                      </h3>
                      {sale.tamanho && (
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1">
                          Tamanho: {sale.tamanho}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(sale.data)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(sale.id, sale.produto_nome)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Excluir venda"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>

                  {sale.cliente_nome && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Cliente: <strong>{sale.cliente_nome}</strong></span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Quantidade</p>
                      <p className="font-bold text-gray-900">{sale.quantidade} un</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Valor Total</p>
                      <p className="font-bold text-green-600">R$ {sale.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {sale.desconto > 0 && (
                    <div className="mb-3">
                      <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded">
                        Desconto: {sale.desconto}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm mb-2">
                    {getPaymentIcon(sale.formaPagamento)}
                    <span className="text-gray-700">{getPaymentLabel(sale.formaPagamento)}</span>
                  </div>

                  {sale.observacoes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Observações:</p>
                          <p className="text-gray-700 italic">{sale.observacoes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma venda registrada</p>
              <p className="text-gray-400 text-sm mt-2">
                As vendas realizadas aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}