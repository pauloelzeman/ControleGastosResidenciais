/**
 * Componentes de gráficos financeiros
 */
import { TotalPessoa } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface FinancialChartsProps {
  totaisPorPessoa: TotalPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
}

const FinancialCharts = ({ totaisPorPessoa, totalGeralReceitas, totalGeralDespesas }: FinancialChartsProps) => {
  // Dados para o gráfico de barras por pessoa
  const barChartData = totaisPorPessoa.map((item) => ({
    nome: item.pessoa.nome,
    Receitas: item.totalReceitas,
    Despesas: item.totalDespesas,
    Saldo: item.saldo,
  }));

  // Dados para o gráfico de pizza
  const pieChartData = [
    { name: 'Receitas', value: totalGeralReceitas },
    { name: 'Despesas', value: totalGeralDespesas },
  ];

  const COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium" style={{ color: payload[0].payload.fill }}>
            {payload[0].name}: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (totaisPorPessoa.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum dado disponivel para exibir graficos
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Receitas x Despesas por Pessoa */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Receitas x Despesas por Pessoa</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="nome" className="text-xs fill-muted-foreground" />
              <YAxis 
                className="text-xs fill-muted-foreground" 
                tickFormatter={(value) => formatCurrency(value).replace('R$', '')}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Receitas" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesas" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pizza - Distribuição Geral */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribuicao Geral</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;
