# 🏪 LK Street - Sistema de Gestão Completo

## 📖 Sobre o Sistema

Sistema completo de gestão para loja de roupas com:
- ✅ Autenticação de usuários
- ✅ Dashboard com métricas em tempo real
- ✅ Sistema de vendas com carrinho
- ✅ Cadastro de produtos com tamanhos e categorias
- ✅ Cadastro de clientes com contagem de compras
- ✅ Histórico de vendas
- ✅ Relatórios detalhados com filtros
- ✅ Gerenciamento de despesas
- ✅ Persistência de dados com localStorage

---

## 🚀 Como Executar

### 1. Instalação
```bash
npm install
# ou
pnpm install
```

### 2. Desenvolvimento
```bash
npm run dev
```

### 3. Build para Produção
```bash
npm run build
```

---

## 🔑 Credenciais de Acesso

### Usuário Admin
- **Usuário:** admin
- **Senha:** admin123

### Usuário Gerente
- **Usuário:** gerente
- **Senha:** gerente123

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── App.tsx                      # Componente principal
│   ├── routes.tsx                   # Configuração de rotas
│   │
│   ├── components/
│   │   ├── Layout.tsx              # Layout com menu de navegação
│   │   └── ProtectedRoute.tsx      # Proteção de rotas privadas
│   │
│   ├── pages/
│   │   ├── Login.tsx               # Tela de login
│   │   ├── Dashboard.tsx           # Dashboard principal
│   │   ├── NewSale.tsx             # Nova venda
│   │   ├── SalesHistory.tsx        # Histórico de vendas
│   │   ├── ProductRegister.tsx     # Cadastro de produtos
│   │   ├── CustomerRegister.tsx    # Cadastro de clientes
│   │   └── Reports.tsx             # Relatórios e análises
│   │
│   └── services/
│       ├── auth.ts                 # Serviço de autenticação
│       └── database.ts             # Serviço de banco de dados
```

---

## ✨ Funcionalidades Implementadas

### 🛍️ Produtos
- [x] Cadastro completo de produtos
- [x] **Tamanhos:** PP, P, M, G, GG, XG
- [x] **Gerenciamento de categorias** (adicionar/remover)
- [x] Cálculo automático de margem de lucro
- [x] Controle de estoque
- [x] Exclusão de produtos
- [x] Badge visual de tamanho

### 🛒 Vendas
- [x] Carrinho de compras interativo
- [x] **Seleção de cliente** (opcional)
- [x] **Escolha de tamanho** ao adicionar produto
- [x] **Campo de observações**
- [x] Desconto percentual
- [x] **Formas de pagamento:** Dinheiro, Cartão, **PIX**
- [x] Atualização automática de estoque
- [x] Restauração de estoque ao excluir venda

### 👥 Clientes
- [x] Cadastro completo de clientes
- [x] **Contador de compras por cliente**
- [x] **Edição de observações inline**
- [x] Marcação de clientes VIP (⭐)
- [x] Exibição de total de compras
- [x] Exclusão de clientes

### 💰 Despesas
- [x] **Cadastro de despesas**
- [x] **Edição completa** (descrição e valor)
- [x] **Exclusão de despesas**
- [x] Cálculo automático no lucro líquido

### 📊 Relatórios
- [x] **Filtros de período:**
  - **Hoje** (dia específico)
  - **Mês** (mês atual)
  - **Ano** (ano atual)
  - **Todos** (todos os registros)
- [x] Exibição clara do período selecionado
- [x] Métricas financeiras (Faturamento, Despesas, Lucro, Ticket Médio)
- [x] Vendas por dia da semana
- [x] Top produtos vendidos
- [x] Estatísticas gerais

### 📜 Histórico
- [x] Lista completa de vendas
- [x] Exibição de:
  - Cliente (se informado)
  - Tamanho do produto
  - Observações
  - Forma de pagamento com ícone específico
  - Data e hora formatada
- [x] Exclusão com restauração de estoque

---

## 🎨 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **React Router 7** - Navegação

### Bibliotecas
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Date-fns** - Formatação de datas
- **Motion** - Animações (opcional)

### Armazenamento
- **LocalStorage** - Persistência de dados

---

## 💾 Dados Persistidos

O sistema armazena os seguintes dados no localStorage:

- `lk_street_auth` - Sessão do usuário
- `lk_street_users` - Usuários do sistema
- `lk_street_produtos` - Produtos cadastrados
- `lk_street_vendas` - Vendas realizadas
- `lk_street_clientes` - Clientes cadastrados
- `lk_street_despesas` - Despesas registradas
- `lk_street_categorias` - Categorias de produtos

---

## 🔧 Customização

### Cores do Sistema
A cor principal azul (`#0f4fa8`) pode ser alterada em todos os arquivos.

### Categorias Padrão
Editável em: `src/app/services/database.ts` (linha 91)

```typescript
const defaultCategories = ['Camisa', 'Boné', 'Shorts', 'Calça', 'Tênis', 'Acessórios'];
```

### Tamanhos Disponíveis
Editável em: `src/app/pages/ProductRegister.tsx` (linhas 162-168)

```typescript
<option value="PP">PP</option>
<option value="P">P</option>
<option value="M">M</option>
<option value="G">G</option>
<option value="GG">GG</option>
<option value="XG">XG</option>
```

---

## 📱 Responsividade

O sistema é **totalmente responsivo** e funciona perfeitamente em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores widescreen

---

## 🔒 Segurança

### Autenticação
- Login obrigatório para acessar o sistema
- Proteção de rotas privadas
- Sessão persistente com localStorage
- Botão de logout visível

### Validações
- Todos os formulários têm validação
- Estoque validado antes da venda
- Confirmação antes de exclusões
- Notificações toast para feedback

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-router": "7.13.0",
    "lucide-react": "0.487.0",
    "sonner": "2.0.3",
    "date-fns": "3.6.0",
    "tailwindcss": "4.1.12"
  }
}
```

---

## 🐛 Troubleshooting

### Dados não aparecem após login
- Limpe o localStorage do navegador
- Faça logout e login novamente

### Erro ao instalar dependências
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

### Erro de build
```bash
# Usar pnpm ao invés de npm
pnpm install
pnpm run dev
```

---

## 📝 Licença

Este projeto foi desenvolvido para a loja **LK Street**.
© 2026 LK Street. Todos os direitos reservados.

---

## 👨‍💻 Desenvolvedor

Sistema desenvolvido com React, TypeScript e Tailwind CSS.

Para suporte ou dúvidas, consulte a documentação do código.

---

## 🎯 Próximas Melhorias Sugeridas

1. [ ] Integração com API backend real
2. [ ] Exportação de relatórios em PDF
3. [ ] Backup automático de dados
4. [ ] Gráficos interativos (Recharts)
5. [ ] Sistema de permissões por usuário
6. [ ] Envio de recibo por email
7. [ ] Integração com WhatsApp
8. [ ] App mobile (React Native)

---

**Pronto para uso! 🚀**
