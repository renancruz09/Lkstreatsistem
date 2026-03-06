import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Camera, Trash2, Plus, X } from 'lucide-react';
import { db, Product } from '../services/database';

export function ProductRegister() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    size: '',
    costPrice: '',
    sellPrice: '',
    stock: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allProducts = db.getAllProducts();
    setProducts(allProducts);
    const allCategories = db.getAllCategories();
    setCategories(allCategories);
    if (allCategories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: allCategories[0] }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.costPrice || !formData.sellPrice || !formData.stock) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    db.addProduct({
      nome: formData.name,
      categoria: formData.category,
      tamanho: formData.size || undefined,
      precoCusto: Number(formData.costPrice),
      preco: Number(formData.sellPrice),
      estoque: Number(formData.stock),
    });
    
    toast.success('Produto cadastrado com sucesso!');
    loadData();
    
    setFormData({
      name: '',
      category: formData.category,
      size: '',
      costPrice: '',
      sellPrice: '',
      stock: '',
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir o produto "${name}"?`)) {
      return;
    }

    const success = db.deleteProduct(id);
    
    if (success) {
      toast.success('Produto excluído com sucesso!');
      loadData();
    } else {
      toast.error('Erro ao excluir produto');
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Digite o nome da categoria');
      return;
    }

    const success = db.addCategory(newCategory.trim());
    
    if (success) {
      toast.success('Categoria adicionada!');
      setNewCategory('');
      loadData();
    } else {
      toast.error('Categoria já existe');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (!confirm(`Deseja realmente excluir a categoria "${category}"?`)) {
      return;
    }

    const success = db.deleteCategory(category);
    
    if (success) {
      toast.success('Categoria removida!');
      loadData();
    } else {
      toast.error('Erro ao remover categoria');
    }
  };
  
  const calculateProfit = (costPrice: number, sellPrice: number) => {
    const profit = sellPrice - costPrice;
    const margin = (profit / sellPrice) * 100;
    return margin.toFixed(1);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulário de cadastro */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
            <div className="bg-[#0f4fa8] text-white text-center py-4 px-4 font-bold text-lg">
              Cadastro de Produto
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                    placeholder="Ex: Camiseta Básica"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho
                    </label>
                    <select 
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                    >
                      <option value="">Não aplicável</option>
                      <option value="PP">PP</option>
                      <option value="P">P</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                      <option value="GG">GG</option>
                      <option value="XG">XG</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCategoryManager(!showCategoryManager)}
                  className="text-sm text-[#0f4fa8] hover:underline"
                >
                  {showCategoryManager ? 'Ocultar' : 'Gerenciar categorias'}
                </button>

                {showCategoryManager && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nova categoria"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-[#27ae60] text-white rounded-lg hover:bg-[#229954] flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <div
                          key={cat}
                          className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-gray-200"
                        >
                          <span className="text-sm">{cat}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Custo *
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                      placeholder="25.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Venda *
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      value={formData.sellPrice}
                      onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                      placeholder="49.90"
                    />
                  </div>
                </div>
                
                {formData.costPrice && formData.sellPrice && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Margem de lucro:</div>
                    <div className="text-lg font-bold text-green-600">
                      {calculateProfit(Number(formData.costPrice), Number(formData.sellPrice))}%
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade em Estoque *
                  </label>
                  <input 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                    placeholder="15"
                  />
                </div>
                
                <button 
                  type="button"
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Adicionar Foto
                </button>
                
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#0f4fa8] text-white rounded-lg font-bold hover:bg-[#0d3f8a] transition-colors"
                >
                  Cadastrar Produto
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Lista de produtos */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
            <div className="bg-[#27ae60] text-white text-center py-4 px-4 font-bold text-lg">
              Produtos ({products.length})
            </div>
            
            <div className="p-5 max-h-[800px] overflow-y-auto">
              <div className="space-y-3">
                {products.map(product => (
                  <div 
                    key={product.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow relative"
                  >
                    <button
                      onClick={() => handleDelete(product.id, product.nome)}
                      className="absolute top-3 right-3 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Excluir produto"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>

                    <div className="pr-10">
                      <h4 className="font-bold text-gray-900">{product.nome}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{product.categoria}</p>
                        {product.tamanho && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {product.tamanho}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.estoque > 10 
                          ? 'bg-green-100 text-green-700' 
                          : product.estoque > 5 
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        Estoque: {product.estoque}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <span className="text-gray-600">Custo:</span>
                        <div className="font-medium">R$ {product.precoCusto.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Venda:</span>
                        <div className="font-medium text-green-600">R$ {product.preco.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-600">Margem:</div>
                      <div className="font-bold text-[#0f4fa8]">
                        {calculateProfit(product.precoCusto, product.preco)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
