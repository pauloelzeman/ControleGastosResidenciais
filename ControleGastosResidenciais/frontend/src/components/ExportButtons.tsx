/**
 * Componentes de exportação de relatórios
 */
import { Download, FileText } from 'lucide-react';
import ActionButton from '@/components/ActionButton';
import { TotalPessoa } from '@/types';

interface ExportButtonsProps {
  totaisPorPessoa: TotalPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

const ExportButtons = ({
  totaisPorPessoa,
  totalGeralReceitas,
  totalGeralDespesas,
  saldoLiquido,
}: ExportButtonsProps) => {
  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const exportToCSV = () => {
    const headers = ['Pessoa', 'Idade', 'Receitas', 'Despesas', 'Saldo'];
    const rows = totaisPorPessoa.map((item) => [
      item.pessoa.nome,
      item.pessoa.idade.toString(),
      item.totalReceitas.toFixed(2),
      item.totalDespesas.toFixed(2),
      item.saldo.toFixed(2),
    ]);

    // Adiciona totais gerais
    rows.push([]);
    rows.push(['TOTAL GERAL', '', totalGeralReceitas.toFixed(2), totalGeralDespesas.toFixed(2), saldoLiquido.toFixed(2)]);

    const csvContent = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = totaisPorPessoa
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.pessoa.nome}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.pessoa.idade} anos</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #16a34a; text-align: right;">${formatCurrency(item.totalReceitas)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #dc2626; text-align: right;">${formatCurrency(item.totalDespesas)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; text-align: right; color: ${item.saldo >= 0 ? '#16a34a' : '#dc2626'};">${formatCurrency(item.saldo)}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatorio Financeiro</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
          h1 { color: #111827; margin-bottom: 8px; }
          .date { color: #6b7280; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
          th:nth-child(n+3) { text-align: right; }
          .totals { background: #f9fafb; padding: 24px; border-radius: 8px; }
          .totals h3 { margin-top: 0; color: #374151; }
          .totals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .total-item { text-align: center; }
          .total-label { font-size: 14px; color: #6b7280; }
          .total-value { font-size: 24px; font-weight: bold; }
          .success { color: #16a34a; }
          .danger { color: #dc2626; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Relatorio Financeiro</h1>
        <p class="date">Gerado em: ${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
        
        <table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Idade</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="totals">
          <h3>Totais Gerais</h3>
          <div class="totals-grid">
            <div class="total-item">
              <div class="total-label">Total de Receitas</div>
              <div class="total-value success">${formatCurrency(totalGeralReceitas)}</div>
            </div>
            <div class="total-item">
              <div class="total-label">Total de Despesas</div>
              <div class="total-value danger">${formatCurrency(totalGeralDespesas)}</div>
            </div>
            <div class="total-item">
              <div class="total-label">Saldo Liquido</div>
              <div class="total-value ${saldoLiquido >= 0 ? 'success' : 'danger'}">${formatCurrency(saldoLiquido)}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="flex gap-2">
      <ActionButton variant="secondary" onClick={exportToCSV}>
        <Download className="w-4 h-4 mr-2" />
        Exportar CSV
      </ActionButton>
      <ActionButton variant="secondary" onClick={exportToPDF}>
        <FileText className="w-4 h-4 mr-2" />
        Exportar PDF
      </ActionButton>
    </div>
  );
};

export default ExportButtons;
