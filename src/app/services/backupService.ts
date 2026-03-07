// Definição das chaves usadas no localStorage
const CHAVES = {
  produtos:   'lk_street_produtos',
  clientes:   'lk_street_clientes',
  vendas:     'lk_street_vendas',
  despesas:   'lk_street_despesas',
  categorias: 'lk_street_categorias',
  usuarios:   'lk_street_users',
  relatorios: 'lk_street_monthly_reports',
} as const; // 'as const' para garantir que as chaves são strings literais

// Tipagens para os dados do sistema (simplificadas para o exemplo)
interface Produto { id: number; nome: string; [key: string]: any; }
interface Cliente { id: number; nome: string; [key: string]: any; }
interface Venda   { id: number; total: number; produto_id: number; quantidade: number; formaPagamento: string; data: string; [key: string]: any; }
interface Despesa { id: number; descricao: string; valor: number; data: string; [key: string]: any; }
interface Categoria extends String {}
interface RelatorioMensal { month: string; year: number; [key: string]: any; }

// Tipagem para o objeto de backup
interface BackupData {
  versao: string;
  sistema: string;
  dataBackup: string;
  produtos: Produto[];
  clientes: Cliente[];
  vendas: Venda[];
  despesas: Despesa[];
  categorias: Categoria[];
  relatorios: RelatorioMensal[];
}

/**
 * Função auxiliar para carregar dados do localStorage.
 * @param key A chave do localStorage.
 * @returns Os dados parseados ou um array vazio.
 */
const carregarDoLocalStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

/**
 * Exporta todos os dados do localStorage para um arquivo .json
 * O arquivo é salvo automaticamente na pasta Downloads do dispositivo.
 */
export const exportarBackup = (): boolean => {
  try {
    const backup: BackupData = {
      versao:     '2.0',
      sistema:    'LK STREAT SISTEM',
      dataBackup: new Date().toLocaleString('pt-BR'),
      produtos:   carregarDoLocalStorage<Produto>(CHAVES.produtos),
      clientes:   carregarDoLocalStorage<Cliente>(CHAVES.clientes),
      vendas:     carregarDoLocalStorage<Venda>(CHAVES.vendas),
      despesas:   carregarDoLocalStorage<Despesa>(CHAVES.despesas),
      categorias: carregarDoLocalStorage<Categoria>(CHAVES.categorias),
      relatorios: carregarDoLocalStorage<RelatorioMensal>(CHAVES.relatorios),
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');

    link.href     = url;
    link.download = `backup_lk_street_${data}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('✅ Backup salvo com sucesso na pasta Downloads!');
    return true;
  } catch (error: any) {
    alert('❌ Erro ao gerar backup: ' + error.message);
    console.error('Erro ao gerar backup:', error);
    return false;
  }
};

/**
 * Importa dados de um arquivo .json de backup e restaura o localStorage.
 * @param evento - Evento do input type="file"
 */
export const importarBackup = (evento: React.ChangeEvent<HTMLInputElement>): void => {
  const arquivo = evento.target.files?.[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = (e) => {
    try {
      const dados: BackupData = JSON.parse(e.target?.result as string);

      // Valida se é um backup válido do sistema
      if (!dados.versao || !dados.produtos) {
        alert('❌ Arquivo inválido! Selecione um backup gerado pelo LK Street.');
        return;
      }

      // Restaura cada coleção de dados
      localStorage.setItem(CHAVES.produtos,   JSON.stringify(dados.produtos));
      localStorage.setItem(CHAVES.clientes,   JSON.stringify(dados.clientes));
      localStorage.setItem(CHAVES.vendas,     JSON.stringify(dados.vendas));
      localStorage.setItem(CHAVES.despesas,   JSON.stringify(dados.despesas));
      localStorage.setItem(CHAVES.categorias, JSON.stringify(dados.categorias));
      localStorage.setItem(CHAVES.relatorios, JSON.stringify(dados.relatorios));

      alert(`✅ Dados restaurados com sucesso!\nBackup de: ${dados.dataBackup}\nA página será recarregada.`);
      window.location.reload();
    } catch (err: any) {
      alert('❌ Erro ao ler o arquivo. Verifique se o arquivo está correto e tente novamente.');
      console.error('Erro ao importar backup:', err);
    }
  };
  leitor.readAsText(arquivo);
};

