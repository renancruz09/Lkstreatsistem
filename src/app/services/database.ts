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
    // Inicializar com dados padrão se não existir
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

    // Criar venda
    const sales = this.getAllSales();
    const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const newSale: Sale = {
      ...sale,
      id: newId,
      data: new Date().toISOString()
    };
    sales.push(newSale);
    localStorage.setItem(this.SALES_KEY, JSON.stringify(sales));

    // Atualizar estoque
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

    // Restaurar estoque do produto
    const product = this.getProductById(sale.produto_id);
    if (product) {
      this.updateProduct(sale.produto_id, {
        estoque: product.estoque + sale.quantidade
      });
    }

    // Remover venda
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

    // Top produtos
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

    // Vendas por dia da semana
    const vendasPorDia: { [key: number]: { vendas: number; receita: number } } = {
      0: { vendas: 0, receita: 0 }, // Domingo
      1: { vendas: 0, receita: 0 }, // Segunda
      2: { vendas: 0, receita: 0 }, // Terça
      3: { vendas: 0, receita: 0 }, // Quarta
      4: { vendas: 0, receita: 0 }, // Quinta
      5: { vendas: 0, receita: 0 }, // Sexta
      6: { vendas: 0, receita: 0 }, // Sábado
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

  // Limpar todos os dados (reset)
  clearAll() {
    localStorage.removeItem(this.PRODUCTS_KEY);
    localStorage.removeItem(this.SALES_KEY);
    localStorage.removeItem(this.CUSTOMERS_KEY);
    localStorage.removeItem(this.EXPENSES_KEY);
    this.initializeDatabase();
  }
}

// Exportar instância única (singleton)
export const db = new Database();