import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, User, Search, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { db, Product, Customer } from '../services/database';

interface CartItem {
  id: number;
  name: string;
  size?: string;
  price: number;
  quantity: number;
  image?: string;
}

export function NewSale() {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'cartao' | 'pix' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [observations, setObservations] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchProduct.trim() === '') {
      setFilteredProducts(availableProducts);
    } else {
      const filtered = availableProducts.filter(p =>
        p.nome.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchProduct.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchProduct, availableProducts]);

  useEffect(() => {
    if (searchCustomer.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(c =>
        c.nome.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        c.telefone.includes(searchCustomer)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchCustomer, customers]);

  const loadData = () => {
    const products = db.getAllProducts();
    setAvailableProducts(products);
    setFilteredProducts(products);
    const allCustomers = db.getAllCustomers();
    setCustomers(allCustomers);
    setFilteredCustomers(allCustomers);
  };
  
  const addToCart = (product: Product, selectedSize?: string) => {
    // Se o produto tem tamanho configurado, precisamos perguntar qual tamanho
    if (product.tamanho && !selectedSize) {
      const size = prompt(`Tamanho do produto (P, M, G, GG):\nTamanho original: ${product.tamanho}`) || product.tamanho;
      selectedSize = size;
    }

    const cartKey = `${product.id}-${selectedSize || ''}`;
    const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);
    
    if (existingItem) {
      setCart(cart.map(item => 
        (item.id === product.id && item.size === selectedSize)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.nome, 
        size: selectedSize,
        price: product.preco, 
        quantity: 1,
        image: product.imagem
      }]);
    }
    toast.success(`${product.nome} adicionado ao carrinho`);
  };
  
  const updateQuantity = (id: number, size: string | undefined, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id && item.size === size) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };
  
  const removeFromCart = (id: number, size: string | undefined) => {
    setCart(cart.filter(item => !(item.id === id && item.size === size)));
    toast.info('Item removido do carrinho');
  };
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  
  const finalizeSale = () => {
    if (cart.length === 0) {
      toast.error('Adicione produtos ao carrinho');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Selecione a forma de pagamento');
      return;
    }

    // Obter dados do cliente se selecionado
    let customerData: { cliente_id?: number; cliente_nome?: string } = {};
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        customerData = {
          cliente_id: customer.id,
          cliente_nome: customer.nome
        };
      }
    }

    // Registrar cada item do carrinho como venda
    let success = true;
    for (const item of cart) {
      const result = db.addSale({
        produto_id: item.id,
        produto_nome: item.name,
        tamanho: item.size,
        quantidade: item.quantity,
        total: item.price * item.quantity * (1 - discount / 100),
        desconto: discount,
        formaPagamento: paymentMethod,
        observacoes: observations || undefined,
        ...customerData
      });

      if (!result.success) {
        toast.error(`Erro ao vender ${item.name}: ${result.error}`);
        success = false;
        break;
      }
    }

    if (success) {
      // Atualizar contagem de compras do cliente
      if (selectedCustomer) {
        db.updateCustomerPurchaseCounts();
      }

      toast.success('Venda finalizada com sucesso!');
      setCart([]);
      setDiscount(0);
      setPaymentMethod(null);
      setSelectedCustomer(null);
      setObservations('');
      loadData();
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Produtos Disponíveis */}
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="bg-[#0f4fa8] text-white text-center py-3 md:py-4 px-4 font-bold text-base md:text-lg">
            Produtos Disponíveis
          </div>
          
          <div className="p-4 md:p-5">
            {/* Barra de busca produtos */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Buscar produto..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                />
              </div>
            </div>

            <div className="max-h-[500px] md:max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-1 gap-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="p-3 md:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer active:scale-95"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex gap-3">
                        {product.imagem && (
                          <img 
                            src={product.imagem} 
                            alt={product.nome}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{product.nome}</h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-xs md:text-sm text-gray-600">{product.categoria}</p>
                                {product.tamanho && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    {product.tamanho}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-base md:text-lg font-bold text-green-600">R$ {product.preco.toFixed(2)}</p>
                              <p className={`text-xs ${
                                product.estoque > 10 
                                  ? 'text-green-600' 
                                  : product.estoque > 5 
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                Est: {product.estoque}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum produto encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Carrinho */}
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="bg-[#27ae60] text-white text-center py-3 md:py-4 px-4 font-bold text-base md:text-lg flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrinho ({cart.length})
          </div>
          
          <div className="p-4 md:p-5">
            {/* Seleção de Cliente */}
            <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Cliente (opcional)
              </label>
              
              {/* Busca de clientes */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                />
              </div>

              <select
                value={selectedCustomer || ''}
                onChange={(e) => setSelectedCustomer(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8] text-sm md:text-base"
              >
                <option value="">Selecione um cliente</option>
                {filteredCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.nome} {customer.vip ? '⭐' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Itens do Carrinho */}
            <div className="max-h-[250px] md:max-h-[300px] overflow-y-auto mb-4">
              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={`${item.id}-${item.size || 'no-size'}`}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex gap-2 mb-2">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex justify-between items-start flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                            {item.size && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded inline-block mt-1">
                                {item.size}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">R$ {item.price.toFixed(2)} un</p>
                          <p className="font-bold text-green-600 text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Carrinho vazio</p>
                </div>
              )}
            </div>

            {/* Observações */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8] resize-none"
                rows={2}
                placeholder="Informações adicionais..."
              />
            </div>
            
            {/* Desconto */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desconto (%)
              </label>
              <input 
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                placeholder="0"
              />
            </div>
            
            {/* Totais */}
            <div className="mb-4 space-y-2 p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Desconto ({discount}%):</span>
                  <span>- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-green-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Forma de Pagamento */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('dinheiro')}
                  className={`py-2 md:py-3 text-xs md:text-sm rounded-lg font-bold transition-all ${
                    paymentMethod === 'dinheiro'
                      ? 'bg-[#27ae60] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dinheiro
                </button>
                <button
                  onClick={() => setPaymentMethod('cartao')}
                  className={`py-2 md:py-3 text-xs md:text-sm rounded-lg font-bold transition-all ${
                    paymentMethod === 'cartao'
                      ? 'bg-[#27ae60] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cartão
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-2 md:py-3 text-xs md:text-sm rounded-lg font-bold transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-[#27ae60] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  PIX
                </button>
              </div>
            </div>
            
            {/* Botão Finalizar */}
            <button 
              onClick={finalizeSale}
              className="w-full py-3 md:py-4 bg-[#0f4fa8] text-white rounded-lg font-bold text-base md:text-lg hover:bg-[#0d3f8a] transition-colors"
            >
              Finalizar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
