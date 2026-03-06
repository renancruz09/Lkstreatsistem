import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, Star, Trash2, ShoppingBag, Edit2, Check, X } from 'lucide-react';
import { db, Customer } from '../services/database';

export function CustomerRegister() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editObservations, setEditObservations] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    vip: false,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    db.updateCustomerPurchaseCounts();
    const allCustomers = db.getAllCustomers();
    setCustomers(allCustomers);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Preencha pelo menos nome e telefone');
      return;
    }
    
    db.addCustomer({
      nome: formData.name,
      telefone: formData.phone,
      email: formData.email,
      observacoes: formData.notes,
      vip: formData.vip,
      totalCompras: 0
    });
    
    toast.success('Cliente cadastrado com sucesso!');
    loadCustomers();
    
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: '',
      vip: false,
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir o cliente "${name}"?`)) {
      return;
    }

    const success = db.deleteCustomer(id);
    
    if (success) {
      toast.success('Cliente excluído com sucesso!');
      loadCustomers();
    } else {
      toast.error('Erro ao excluir cliente');
    }
  };

  const startEditObservations = (customer: Customer) => {
    setEditingId(customer.id);
    setEditObservations(customer.observacoes || '');
  };

  const saveObservations = (id: number) => {
    const success = db.updateCustomer(id, { observacoes: editObservations });
    
    if (success) {
      toast.success('Observações atualizadas!');
      setEditingId(null);
      loadCustomers();
    } else {
      toast.error('Erro ao atualizar observações');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditObservations('');
  };
  
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulário de cadastro */}
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="bg-[#0f4fa8] text-white text-center py-4 px-4 font-bold text-lg">
            Cadastro de Cliente
          </div>
          
          <div className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                  placeholder="João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                  placeholder="(88) 99999-1234"
                  maxLength={15}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8]"
                  placeholder="joao@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4fa8] resize-none"
                  placeholder="Informações adicionais..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="vip"
                  checked={formData.vip}
                  onChange={(e) => setFormData({...formData, vip: e.target.checked})}
                  className="w-4 h-4 text-[#0f4fa8] border-gray-300 rounded focus:ring-[#0f4fa8]"
                />
                <label htmlFor="vip" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Marcar como Cliente VIP
                </label>
              </div>
              
              <button 
                type="submit"
                className="w-full py-3 bg-[#0f4fa8] text-white rounded-lg font-bold hover:bg-[#0d3f8a] transition-colors"
              >
                Salvar Cliente
              </button>
            </form>
          </div>
        </div>
        
        {/* Lista de clientes */}
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="bg-[#27ae60] text-white text-center py-4 px-4 font-bold text-lg">
            Clientes Cadastrados ({customers.length})
          </div>
          
          <div className="p-5 max-h-[600px] overflow-y-auto">
            <div className="space-y-3">
              {customers.map(customer => (
                <div 
                  key={customer.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow relative"
                >
                  <button
                    onClick={() => handleDelete(customer.id, customer.nome)}
                    className="absolute top-3 right-3 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Excluir cliente"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                  </button>

                  <div className="flex justify-between items-start mb-3 pr-10">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#0f4fa8] rounded-full flex items-center justify-center text-white font-bold">
                        {customer.nome.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-1">
                          {customer.nome}
                          {customer.vip && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {customer.vip && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                              VIP
                            </span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            {customer.totalCompras || 0} compras
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{customer.telefone}</span>
                    </div>
                    
                    {customer.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-700">Observações:</p>
                        {editingId !== customer.id && (
                          <button
                            onClick={() => startEditObservations(customer)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar observações"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      {editingId === customer.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editObservations}
                            onChange={(e) => setEditObservations(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0f4fa8] resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveObservations(customer.id)}
                              className="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Salvar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 flex items-center justify-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">
                          {customer.observacoes || 'Sem observações'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
