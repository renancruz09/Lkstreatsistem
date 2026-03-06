# LK STREET - Sistema de Gestão para Loja de Roupas

Sistema completo de gestão comercial desenvolvido com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades Implementadas

### 📦 **Gestão de Produtos**
- ✅ Cadastro completo de produtos com foto
- ✅ Upload de imagem (até 2MB, armazenada em base64)
- ✅ Suporte a tamanhos: PP, P, M, G, GG, XG
- ✅ Controle de estoque em tempo real
- ✅ Cálculo automático de margem de lucro
- ✅ Gerenciamento de categorias personalizadas
- ✅ **Barra de pesquisa** para encontrar produtos rapidamente
- ✅ Visualização com foto do produto

### 💰 **Sistema de Vendas**
- ✅ Carrinho de compras interativo
- ✅ **Imagens dos produtos exibidas no carrinho e lista**
- ✅ **Busca rápida de produtos**
- ✅ Seleção de cliente com **busca inteligente**
- ✅ Formas de pagamento: Dinheiro, Cartão e **PIX**
- ✅ Sistema de descontos em porcentagem
- ✅ Atualização automática do estoque após venda
- ✅ Contador de compras por cliente

### 👥 **Gestão de Clientes**
- ✅ Cadastro completo com validação
- ✅ **Barra de pesquisa** (nome, telefone, email)
- ✅ Sistema VIP ⭐
- ✅ Contador automático de compras
- ✅ Observações editáveis em tempo real
- ✅ Formatação automática de telefone

### 📊 **Histórico de Vendas**
- ✅ **Filtros por período**:
  - 📅 Semana atual
  - 📅 Mês atual
  - 📅 Ano atual
  - 📅 Todos os registros
- ✅ Visualização detalhada de cada venda
- ✅ Informações de cliente e forma de pagamento
- ✅ Exclusão com restauração automática de estoque
- ✅ Resumo financeiro por período

### 📈 **Relatórios e Análises**
- ✅ Dashboard com métricas em tempo real
- ✅ Filtros: Hoje, Mês, Ano, Todos
- ✅ **Geração de PDF do relatório mensal**
- ✅ Métricas calculadas:
  - Faturamento total
  - Despesas
  - Lucro líquido
  - Ticket médio
- ✅ Top produtos mais vendidos
- ✅ Análise de vendas por dia da semana
- ✅ Vendas por forma de pagamento
- ✅ **Gerenciamento de despesas** (adicionar, editar, excluir)

### 📄 **Sistema de Relatórios em PDF**
- ✅ **Exportação de relatórios mensais em PDF**
- ✅ Salvamento automático de histórico mensal
- ✅ Relatórios incluem:
  - Resumo financeiro completo
  - Top 10 produtos
  - Vendas por forma de pagamento
  - Data e hora de geração
  - Paginação automática

### 📱 **Responsividade Mobile**
- ✅ Interface totalmente adaptável
- ✅ Design otimizado para smartphones
- ✅ Navegação mobile-friendly
- ✅ Botões e textos ajustados para telas pequenas
- ✅ Imagens responsivas

## 🎨 Design

- **Cor principal:** Azul (#0f4fa8)
- **Cor secundária:** Verde (#27ae60)
- **Layout:** Cards arredondados (20px)
- **Ícones:** Lucide React
- **Notificações:** Toast (Sonner)

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18.3.1 + TypeScript
- **Estilização:** Tailwind CSS v4
- **Roteamento:** React Router 7
- **Formulários:** React Hook Form
- **Datas:** date-fns
- **PDFs:** jsPDF + jsPDF AutoTable
- **Ícones:** Lucide React
- **Notificações:** Sonner
- **Armazenamento:** LocalStorage (simulando SQLite)

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── components/
│   │   ├── Layout.tsx          # Layout principal
│   │   ├── ProtectedRoute.tsx  # Rotas protegidas
│   │   └── ui/                 # Componentes de UI
│   ├── pages/
│   │   ├── Login.tsx           # Página de login
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   ├── ProductRegister.tsx # Cadastro de produtos
│   │   ├── NewSale.tsx         # Nova venda
│   │   ├── SalesHistory.tsx    # Histórico de vendas
│   │   ├── CustomerRegister.tsx # Cadastro de clientes
│   │   └── Reports.tsx         # Relatórios
│   ├── services/
│   │   ├── auth.ts            # Autenticação
│   │   ├── database.ts        # Banco de dados (LocalStorage)
│   │   └── pdfService.ts      # Geração de PDFs
│   ├── routes.tsx             # Configuração de rotas
│   └── App.tsx                # Componente raiz
└── styles/
    └── theme.css              # Tema e estilos globais
```

## 🚀 Como Usar

### Login Padrão
- **Usuário:** admin
- **Senha:** admin123

### Funcionalidades Principais

1. **Cadastrar Produto com Foto:**
   - Acesse "Cadastro de Produto"
   - Preencha os campos
   - Clique em "Adicionar Foto" e selecione uma imagem
   - Clique em "Cadastrar Produto"

2. **Realizar Venda:**
   - Acesse "Nova Venda"
   - Use a barra de pesquisa para encontrar produtos
   - Clique no produto para adicionar ao carrinho
   - Selecione cliente (opcional, use a busca)
   - Escolha forma de pagamento
   - Finalize a venda

3. **Visualizar Histórico:**
   - Acesse "Histórico de Vendas"
   - Use os filtros: Semana, Mês, Ano ou Tudo
   - Visualize detalhes e exclua vendas se necessário

4. **Gerar Relatório PDF:**
   - Acesse "Relatórios"
   - Clique em "Exportar PDF"
   - O PDF do mês atual será baixado automaticamente

5. **Buscar Produtos/Clientes:**
   - Use as barras de pesquisa em:
     - Cadastro de Produtos
     - Nova Venda
     - Cadastro de Clientes

## 💾 Armazenamento de Dados

O sistema utiliza **LocalStorage** do navegador para simular um banco de dados SQLite. Os dados incluem:

- `lk_street_produtos` - Produtos cadastrados (com imagens em base64)
- `lk_street_vendas` - Histórico de vendas
- `lk_street_clientes` - Clientes cadastrados
- `lk_street_despesas` - Despesas registradas
- `lk_street_categorias` - Categorias personalizadas
- `lk_street_monthly_reports` - Relatórios mensais salvos

## 🔍 Recursos de Busca

### Produtos
- Busca por: nome, categoria, tamanho
- Tempo real (filtragem instantânea)
- Destaque visual dos resultados

### Clientes
- Busca por: nome, telefone, email
- Integrada nas vendas
- Filtros inteligentes

## 📱 Otimizações Mobile

- Grids responsivos (1 coluna em mobile, 2-4 em desktop)
- Texto reduzido em botões pequenos
- Espaçamentos ajustados (px-4 em mobile, md:px-0 em desktop)
- Imagens com tamanhos adaptativos
- Navegação otimizada

## 📊 Relatórios PDF

### Conteúdo Incluído:
- **Header:** Logo e título "LK STREET"
- **Resumo Financeiro:**
  - Total de vendas
  - Faturamento
  - Despesas
  - Lucro líquido
- **Vendas por Pagamento:** Dinheiro, Cartão, PIX
- **Top 10 Produtos:** Nome, quantidade, receita
- **Footer:** Data/hora de geração e paginação

### Como Funciona:
1. Sistema salva automaticamente dados do mês
2. Clique em "Exportar PDF"
3. Arquivo baixado: `LK_STREET_Relatorio_[Mês]_[Ano].pdf`
4. Histórico mantido no LocalStorage

## 🎯 Melhorias Implementadas

✅ **Upload de imagens funcionando**
✅ **Código otimizado para mobile**
✅ **Relatórios PDF automáticos**
✅ **Fotos aparecem nas vendas**
✅ **Histórico com filtros de período**
✅ **Barras de pesquisa em produtos e clientes**
✅ **Código organizado e compacto**
✅ **Arquivos desnecessários removidos**

## 📦 Dependências Principais

```json
{
  "react": "18.3.1",
  "react-router": "7.13.0",
  "lucide-react": "0.487.0",
  "date-fns": "3.6.0",
  "jspdf": "^4.2.0",
  "jspdf-autotable": "^5.0.7",
  "sonner": "2.0.3",
  "tailwindcss": "4.1.12"
}
```

## 🔐 Segurança

- Autenticação básica implementada
- Proteção de rotas
- Validação de formulários
- Limite de tamanho de imagem (2MB)

## 🎨 Tema de Cores

- **Primária:** #0f4fa8 (Azul LK Street)
- **Sucesso:** #27ae60 (Verde)
- **Perigo:** #e74c3c (Vermelho)
- **Info:** #3498db (Azul claro)
- **Warning:** #e67e22 (Laranja)

---

**Desenvolvido para LK STREET** 🏪
Sistema completo, responsivo e profissional para gestão de loja de roupas.
