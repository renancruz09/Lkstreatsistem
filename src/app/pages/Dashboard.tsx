import { DollarSign, TrendingDown, TrendingUp, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../services/database';
import { useNavigate } from 'react-router';
import BackupPanel from '../components/BackupPanel'; // Importe o componente BackupPanel

interface ReportState {
  faturamento: number;
  despesas: number;
  lucro: number;
  totalVendas: number;
  topProdutos: { id: number; nome: string; quantidade: number }[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportState>({
    faturamento: 0,
    despesas: 0,
    lucro: 0,
    totalVendas: 0,
    topProdutos: []
  });

  useEffect(() => {
    loadData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    // Atualizar contagem de compras dos clientes
    db.updateCustomerPurchaseCounts();
    
    const report = db.getReport();
    // const todaySales = db.getSalesToday(); // Esta linha não está sendo usada, pode ser removida se não for necessária
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

          {/* Adicione o componente BackupPanel aqui */}
          <div className="mt-8">
            <BackupPanel />
          </div>

        </div>
      </div>
    </div>
  );
}
