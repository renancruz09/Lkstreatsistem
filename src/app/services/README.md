# Sistema LK Street - Documentação do Banco de Dados

## Estrutura do Banco de Dados

O sistema utiliza **localStorage** para simular um banco de dados SQLite, baseado na estrutura original do arquivo `api-server.js`.

### Tabelas (Collections)

#### 1. Produtos
```typescript
interface Product {
  id: number;
  nome: string;
  categoria: string;
  preco: number;           // Preço de venda
  precoCusto: number;      // Preço de custo
  estoque: number;         // Quantidade em estoque (CHECK >= 0)
}
```

#### 2. Vendas
```typescript
interface Sale {
  id: number;
  produto_id: number;      // FOREIGN KEY -> produtos.id
  produto_nome: string;    // Nome do produto (para histórico)
  quantidade: number;
  total: number;          // Valor total da venda
  desconto: number;       // Percentual de desconto aplicado
  formaPagamento: 'dinheiro' | 'cartao';
  data: string;          // DATETIME (ISO String)
}
```

#### 3. Clientes
```typescript
interface Customer {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  observacoes: string;
  vip: boolean;
}
```

#### 4. Despesas
```typescript
interface Expense {
  id: number;
  descricao: string;
  valor: number;
  data: string;          // DATETIME (ISO String)
}
```

## API do Banco de Dados

### Produtos

- `getAllProducts()` - Lista todos os produtos
- `getProductById(id)` - Busca produto por ID
- `addProduct(product)` - Adiciona novo produto
- `updateProduct(id, updates)` - Atualiza produto existente
- `deleteProduct(id)` - Remove produto

### Vendas

- `getAllSales()` - Lista todas as vendas
- `addSale(sale)` - Registra nova venda (COM TRANSACTION)
  - Valida se produto existe
  - Valida se há estoque suficiente
  - Registra a venda
  - Atualiza o estoque automaticamente
- `getSalesToday()` - Vendas de hoje
- `getSalesThisMonth()` - Vendas do mês atual

### Clientes

- `getAllCustomers()` - Lista todos os clientes
- `addCustomer(customer)` - Adiciona novo cliente
- `updateCustomer(id, updates)` - Atualiza cliente
- `deleteCustomer(id)` - Remove cliente

### Despesas

- `getAllExpenses()` - Lista todas as despesas
- `addExpense(expense)` - Adiciona nova despesa

### Relatórios

- `getReport()` - Retorna relatório completo:
  - Faturamento total do mês
  - Despesas totais
  - Lucro líquido (faturamento - despesas)
  - Total de vendas
  - Top 5 produtos mais vendidos
  - Vendas por dia da semana (0-6)
  - Ticket médio

## Transações

O método `addSale()` implementa uma transação simulada:

1. **BEGIN**: Valida produto e estoque
2. **INSERT**: Registra a venda
3. **UPDATE**: Atualiza estoque do produto
4. **COMMIT**: Confirma operação
5. **ROLLBACK**: Em caso de erro, nenhuma alteração é feita

## Constraints

- **Estoque**: Não pode ser negativo (validado no frontend e backend)
- **Foreign Keys**: produto_id em vendas referencia produtos.id
- **Validações**: 
  - Preços devem ser >= 0
  - Quantidade em vendas deve ser > 0
  - Nome de produto é obrigatório

## Dados Iniciais

O banco é inicializado com:
- 5 produtos de exemplo
- 2 clientes de exemplo
- 3 despesas de exemplo (aluguel, energia, internet)
- Array vazio de vendas

## Uso

```typescript
import { db } from './services/database';

// Adicionar produto
const produto = db.addProduct({
  nome: 'Camisa Nike',
  categoria: 'Camisa',
  preco: 95.00,
  precoCusto: 45.00,
  estoque: 10
});

// Realizar venda
const resultado = db.addSale({
  produto_id: 1,
  produto_nome: 'Camisa Nike',
  quantidade: 2,
  total: 190.00,
  desconto: 0,
  formaPagamento: 'dinheiro'
});

if (resultado.success) {
  console.log('Venda realizada!');
} else {
  console.error(resultado.error);
}

// Obter relatório
const relatorio = db.getReport();
console.log(`Faturamento: R$ ${relatorio.faturamento}`);
```

## Reset de Dados

Para limpar todos os dados e restaurar ao estado inicial:

```typescript
db.clearAll();
```

## Diferenças do Backend Original

1. **Storage**: localStorage em vez de SQLite
2. **API**: Métodos síncronos em vez de callbacks assíncronos
3. **Transações**: Simuladas (não há rollback real, mas validações impedem estados inconsistentes)
4. **Persistência**: Dados salvos no navegador (não em arquivo .db)

## Migração para Backend Real

Para migrar para um backend real com Supabase:

1. Criar tabelas no Supabase com a mesma estrutura
2. Substituir chamadas `db.*` por chamadas à API Supabase
3. Implementar autenticação se necessário
4. Adicionar políticas de RLS (Row Level Security)
