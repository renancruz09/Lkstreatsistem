# LK Street - Sistema de Gestão Completo
## Código Fonte Completo

---

## 📦 INSTALAÇÃO

```bash
npm install
# ou
pnpm install
```

### Dependências principais:
- React 18.3.1
- React Router 7.13.0
- Lucide React (ícones)
- Sonner (notificações toast)
- Date-fns (formatação de datas)
- Tailwind CSS 4

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NewSale.tsx
│   │   ├── SalesHistory.tsx
│   │   ├── ProductRegister.tsx
│   │   ├── CustomerRegister.tsx
│   │   └── Reports.tsx
│   └── services/
│       ├── auth.ts
│       └── database.ts
```

---

## 🔐 1. SERVIÇO DE AUTENTICAÇÃO
### `/src/app/services/auth.ts`

```typescript
// Sistema de autenticação simples usando localStorage

interface User {
  username: string;
  password: string;
  name: string;
}

class AuthService {
  private AUTH_KEY = 'lk_street_auth';
  private USERS_KEY = 'lk_street_users';

  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [
        { username: 'admin', password: 'admin123', name: 'Administrador' },
        { username: 'gerente', password: 'gerente123', name: 'Gerente' },
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  login(username: string, password: string): { success: boolean; error?: string; user?: { username: string; name: string } } {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return { success: false, error: 'Usuário ou senha incorretos' };
    }

    const authData = {
      username: user.username,
      name: user.name,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    return { success: true, user: { username: user.username, name: user.name } };
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) !== null;
  }

  getCurrentUser(): { username: string; name: string } | null {
    const data = localStorage.getItem(this.AUTH_KEY);
    if (!data) return null;
    
    try {
      const user = JSON.parse(data);
      return { username: user.username, name: user.name };
    } catch {
      return null;
    }
  }

  addUser(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    
    if (users.find(u => u.username === user.username)) {
      return false;
    }

    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }
}

export const auth = new AuthService();
```

---

## 💾 2. SERVIÇO DE BANCO DE DADOS
### `/src/app/services/database.ts`

```typescript
// Simulação do banco de dados SQLite usando localStorage

export interface Product {
  id: number;
  nome: string;
  categoria: string;
  tamanho?: string; // P, M, G, GG
  preco: number;
  precoCusto: number;
  estoque: number;
}

export interface Sale {
  id: number;
  produto_id: number;
  produto_nome: string;
  tamanho?: string;
  quantidade: number;
  total: number;
  desconto: number;
  formaPagamento: 'dinheiro' | 'cartao' | 'pix';
  cliente_id?: number;
  cliente_nome?: string;
  observacoes?: string;
  data: string;
}

export interface Customer {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  observacoes: string;
  vip: boolean;
  totalCompras?: number;
}

export interface Expense {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

class Database {
  private PRODUCTS_KEY = 'lk_street_produtos';
  private SALES_KEY = 'lk_street_vendas';
  private CUSTOMERS_KEY = 'lk_street_clientes';
  private EXPENSES_KEY = 'lk_street_despesas';
  private CATEGORIES_KEY = 'lk_street_categorias';

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      const defaultProducts: Product[] = [
        { id: 1, nome: 'Camisa Nike', categoria: 'Camisa', tamanho: 'M', preco: 95.00, precoCusto: 45.00, estoque: 12 },
        { id: 2, nome: 'Boné Preto', categoria: 'Boné', preco: 29.00, precoCusto: 15.00, estoque: 25 },
        { id: 3, nome: 'Shorts Jeans', categoria: 'Shorts', tamanho: 'G', preco: 75.00, precoCusto: 35.00, estoque: 8 },
        { id: 4, nome: 'Camiseta Básica', categoria: 'Camisa', tamanho: 'P', preco: 49.90, precoCusto: 25.00, estoque: 15 },
        { id: 5, nome: 'Tênis Adidas', categoria: 'Tênis', preco: 299.00, precoCusto: 150.00, estoque: 6 },
      ];
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(defaultProducts));
    }

    if (!localStorage.getItem(this.CUSTOMERS_KEY)) {
      const defaultCustomers: Customer[] = [
        { id: 1, nome: 'João Silva', telefone: '(88) 99999-1234', email: 'joao@email.com', observacoes: 'Cliente VIP', vip: true, totalCompras: 0 },
        { id: 2, nome: 'Maria Santos', telefone: '(88) 98888-5678', email: 'maria@email.com', observacoes: 'Prefere pagamento em dinheiro', vip: false, totalCompras: 0 },
      ];
      localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(defaultCustomers));
    }

    if (!localStorage.getItem(this.SALES_KEY)) {
      localStorage.setItem(this.SALES_KEY, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.EXPENSES_KEY)) {
      const defaultExpenses: Expense[] = [
        { id: 1, descricao: 'Aluguel', valor: 2000.00, data: new Date().toISOString() },
        { id: 2, descricao: 'Energia', valor: 350.00, data: new Date().toISOString() },
        { id: 3, descricao: 'Internet', valor: 150.00, data: new Date().toISOString() },
      ];
      localStorage.setItem(this.EXPENSES_KEY, JSON.stringify(defaultExpenses));
    }

    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      const defaultCategories = ['Camisa', 'Boné', 'Shorts', 'Calça', 'Tênis', 'Acessórios'];
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }
  }

  // ==================== PRODUTOS ====================

  getAllProducts(): Product[] {
    const data = localStorage.getItem(this.PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getProductById(id: number): Product | null {
    const products = this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getAllProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = { ...product, id: newId };
    products.push(newProduct);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  }

  updateProduct(id: number, updates: Partial<Product>): boolean {
    const products = this.getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    return true;
  }

  deleteProduct(id: number): boolean {
    const products = this.getAllProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== VENDAS ====================

  getAllSales(): Sale[] {
    const data = localStorage.getItem(this.SALES_KEY);
    return data ? JSON.parse(data) : [];
  }

  getSaleById(id: number): Sale | null {
    const sales = this.getAllSales();
    return sales.find(s => s.id === id) || null;
  }

  addSale(sale: Omit<Sale, 'id' | 'data'>): { success: boolean; sale?: Sale; error?: string } {
    const product = this.getProductById(sale.produto_id);
    
    if (!product) {
      return { success: false, error: 'Produto não encontrado' };
    }

    if (product.estoque < sale.quantidade) {
      return { success: false, error: 'Estoque insuficiente' };
    }

    const sales = this.getAllSales();
    const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const newSale: Sale = {
      ...sale,
      id: newId,
      data: new Date().toISOString()
    };
    sales.push(newSale);
    localStorage.setItem(this.SALES_KEY, JSON.stringify(sales));

    this.updateProduct(sale.produto_id, {
      estoque: product.estoque - sale.quantidade
    });

    return { success: true, sale: newSale };
  }

  deleteSale(id: number): { success: boolean; error?: string } {
    const sales = this.getAllSales();
    const sale = sales.find(s => s.id === id);
    
    if (!sale) {
      return { success: false, error: 'Venda não encontrada' };
    }

    const product = this.getProductById(sale.produto_id);
    if (product) {
      this.updateProduct(sale.produto_id, {
        estoque: product.estoque + sale.quantidade
      });
    }

    const filtered = sales.filter(s => s.id !== id);
    localStorage.setItem(this.SALES_KEY, JSON.stringify(filtered));
    
    return { success: true };
  }

  getSalesToday(): Sale[] {
    const sales = this.getAllSales();
    const today = new Date().toDateString();
    return sales.filter(s => new Date(s.data).toDateString() === today);
  }

  getSalesThisMonth(): Sale[] {
    const sales = this.getAllSales();
    const now = new Date();
    return sales.filter(s => {
      const saleDate = new Date(s.data);
      return saleDate.getMonth() === now.getMonth() && 
             saleDate.getFullYear() === now.getFullYear();
    });
  }

  // ==================== CLIENTES ====================

  getAllCustomers(): Customer[] {
    const data = localStorage.getItem(this.CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  addCustomer(customer: Omit<Customer, 'id'>): Customer {
    const customers = this.getAllCustomers();
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCustomer: Customer = { ...customer, id: newId };
    customers.push(newCustomer);
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
    return newCustomer;
  }

  updateCustomer(id: number, updates: Partial<Customer>): boolean {
    const customers = this.getAllCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    customers[index] = { ...customers[index], ...updates };
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
    return true;
  }

  deleteCustomer(id: number): boolean {
    const customers = this.getAllCustomers();
    const filtered = customers.filter(c => c.id !== id);
    if (filtered.length === customers.length) return false;
    
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(filtered));
    return true;
  }

  getVIPCustomers(): Customer[] {
    return this.getAllCustomers().filter(c => c.vip);
  }
  
  // ==================== DESPESAS ====================

  getAllExpenses(): Expense[] {
    const data = localStorage.getItem(this.EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  }

  addExpense(expense: Omit<Expense, 'id' | 'data'>): Expense {
    const expenses = this.getAllExpenses();
    const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    const newExpense: Expense = {
      ...expense,
      id: newId,
      data: new Date().toISOString()
    };
    expenses.push(newExpense);
    localStorage.setItem(this.EXPENSES_KEY, JSON.stringify(expenses));
    return newExpense;
  }

  updateExpense(id: number, updates: Partial<Expense>): boolean {
    const expenses = this.getAllExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    expenses[index] = { ...expenses[index], ...updates };
    localStorage.setItem(this.EXPENSES_KEY, JSON.stringify(expenses));
    return true;
  }

  deleteExpense(id: number): boolean {
    const expenses = this.getAllExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    if (filtered.length === expenses.length) return false;
    
    localStorage.setItem(this.EXPENSES_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== CATEGORIAS ====================

  getAllCategories(): string[] {
    const data = localStorage.getItem(this.CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  }

  addCategory(category: string): boolean {
    const categories = this.getAllCategories();
    if (categories.includes(category)) return false;
    
    categories.push(category);
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  }

  deleteCategory(category: string): boolean {
    const categories = this.getAllCategories();
    const filtered = categories.filter(c => c !== category);
    if (filtered.length === categories.length) return false;
    
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== ESTATÍSTICAS DE CLIENTES ====================

  getCustomerPurchaseCount(customerId: number): number {
    const sales = this.getAllSales();
    return sales.filter(s => s.cliente_id === customerId).length;
  }

  updateCustomerPurchaseCounts(): void {
    const customers = this.getAllCustomers();
    customers.forEach(customer => {
      customer.totalCompras = this.getCustomerPurchaseCount(customer.id);
    });
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
  }

  // ==================== RELATÓRIOS ====================

  getReport() {
    const sales = this.getSalesThisMonth();
    const expenses = this.getAllExpenses();

    const faturamento = sales.reduce((sum, s) => sum + s.total, 0);
    const despesas = expenses.reduce((sum, e) => sum + e.valor, 0);
    const lucro = faturamento - despesas;
    const totalVendas = sales.length;

    const productSales: { [key: number]: { nome: string; quantidade: number } } = {};
    sales.forEach(sale => {
      if (!productSales[sale.produto_id]) {
        productSales[sale.produto_id] = {
          nome: sale.produto_nome,
          quantidade: 0
        };
      }
      productSales[sale.produto_id].quantidade += sale.quantidade;
    });

    const topProdutos = Object.entries(productSales)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    const vendasPorDia: { [key: number]: { vendas: number; receita: number } } = {
      0: { vendas: 0, receita: 0 },
      1: { vendas: 0, receita: 0 },
      2: { vendas: 0, receita: 0 },
      3: { vendas: 0, receita: 0 },
      4: { vendas: 0, receita: 0 },
      5: { vendas: 0, receita: 0 },
      6: { vendas: 0, receita: 0 },
    };

    sales.forEach(sale => {
      const day = new Date(sale.data).getDay();
      vendasPorDia[day].vendas++;
      vendasPorDia[day].receita += sale.total;
    });

    const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

    return {
      faturamento,
      despesas,
      lucro,
      totalVendas,
      topProdutos,
      vendasPorDia,
      ticketMedio
    };
  }

  clearAll() {
    localStorage.removeItem(this.PRODUCTS_KEY);
    localStorage.removeItem(this.SALES_KEY);
    localStorage.removeItem(this.CUSTOMERS_KEY);
    localStorage.removeItem(this.EXPENSES_KEY);
    this.initializeDatabase();
  }
}

export const db = new Database();
```

Arquivo muito grande! Vou continuar no próximo arquivo...
