import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from './database';

export interface MonthlyReport {
  month: string;
  year: number;
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  salesByPayment: { dinheiro: number; cartao: number; pix: number };
}

const MONTHLY_REPORTS_KEY = 'lk_street_monthly_reports';

export class PDFService {
  // Salvar relatório mensal
  saveMonthlyReport(month: number, year: number): MonthlyReport {
    const sales = db.getAllSales().filter(sale => {
      const saleDate = new Date(sale.data);
      return saleDate.getMonth() === month && saleDate.getFullYear() === year;
    });

    const expenses = db.getAllExpenses().filter(expense => {
      const expenseDate = new Date(expense.data);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });

    // Calcular métricas
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.valor, 0);
    const profit = totalRevenue - totalExpenses;

    // Top produtos
    const productSales: { [key: string]: { quantity: number; revenue: number } } = {};
    sales.forEach(sale => {
      if (!productSales[sale.produto_nome]) {
        productSales[sale.produto_nome] = { quantity: 0, revenue: 0 };
      }
      productSales[sale.produto_nome].quantity += sale.quantidade;
      productSales[sale.produto_nome].revenue += sale.total;
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Vendas por forma de pagamento
    const salesByPayment = {
      dinheiro: sales.filter(s => s.formaPagamento === 'dinheiro').reduce((sum, s) => sum + s.total, 0),
      cartao: sales.filter(s => s.formaPagamento === 'cartao').reduce((sum, s) => sum + s.total, 0),
      pix: sales.filter(s => s.formaPagamento === 'pix').reduce((sum, s) => sum + s.total, 0),
    };

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const report: MonthlyReport = {
      month: monthNames[month],
      year,
      totalSales: sales.length,
      totalRevenue,
      totalExpenses,
      profit,
      topProducts,
      salesByPayment,
    };

    // Salvar relatório no localStorage
    const reports = this.getMonthlyReports();
    const existingIndex = reports.findIndex(r => r.month === report.month && r.year === report.year);
    
    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }

    localStorage.setItem(MONTHLY_REPORTS_KEY, JSON.stringify(reports));
    return report;
  }

  // Obter todos os relatórios mensais salvos
  getMonthlyReports(): MonthlyReport[] {
    const data = localStorage.getItem(MONTHLY_REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Gerar PDF do relatório mensal
  generateMonthlyReportPDF(month: number, year: number): void {
    const report = this.saveMonthlyReport(month, year);
    
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 79, 168);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('LK STREET', 105, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Relatório Mensal', 105, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`${report.month}/${report.year}`, 105, 35, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    let yPos = 50;

    // Resumo Financeiro
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 14, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const summaryData = [
      ['Total de Vendas', `${report.totalSales}`],
      ['Faturamento', `R$ ${report.totalRevenue.toFixed(2)}`],
      ['Despesas', `R$ ${report.totalExpenses.toFixed(2)}`],
      ['Lucro Líquido', `R$ ${report.profit.toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [15, 79, 168] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Vendas por Forma de Pagamento
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vendas por Forma de Pagamento', 14, yPos);
    
    yPos += 10;
    
    const paymentData = [
      ['Dinheiro', `R$ ${report.salesByPayment.dinheiro.toFixed(2)}`],
      ['Cartão', `R$ ${report.salesByPayment.cartao.toFixed(2)}`],
      ['PIX', `R$ ${report.salesByPayment.pix.toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Forma de Pagamento', 'Total']],
      body: paymentData,
      theme: 'striped',
      headStyles: { fillColor: [39, 174, 96] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Top Produtos
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Produtos', 14, yPos);
    
    yPos += 10;

    const productsData = report.topProducts.map(p => [
      p.name,
      `${p.quantity}`,
      `R$ ${p.revenue.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Produto', 'Quantidade', 'Receita']],
      body: productsData,
      theme: 'striped',
      headStyles: { fillColor: [15, 79, 168] },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Página ${i} de ${pageCount} - Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
        105,
        285,
        { align: 'center' }
      );
    }

    // Salvar PDF
    doc.save(`LK_STREET_Relatorio_${report.month}_${report.year}.pdf`);
  }

  // Gerar PDF do relatório atual (mês corrente)
  generateCurrentMonthReport(): void {
    const now = new Date();
    this.generateMonthlyReportPDF(now.getMonth(), now.getFullYear());
  }
}

export const pdfService = new PDFService();
