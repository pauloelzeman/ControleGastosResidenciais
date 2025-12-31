/**
 * Página de Consulta de Totais por Pessoa
 * Exibe resumo financeiro de cada pessoa e totais gerais
 * Inclui gráficos financeiros e exportação de relatórios
 */

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { TotalPessoa, Pessoa } from '@/types';
import { getPessoas, getTransacoes, getErrorMessage } from '@/services/api';
import { TipoTransacao, Transacao } from '@/types';
import PageHeader from '@/components/PageHeader';
import AlertMessage from '@/components/AlertMessage';
import ActionButton from '@/components/ActionButton';
import FinancialCharts from '@/components/FinancialCharts';
import ExportButtons from '@/components/ExportButtons';

const TotaisPage = () => {
  // Estado para totais calculados
  const [totaisPorPessoa, setTotaisPorPessoa] = useState<TotalPessoa[]>([]);
  const [totalGeralReceitas, setTotalGeralReceitas] = useState(0);
  const [totalGeralDespesas, setTotalGeralDespesas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para mensagens
  const [error, setError] = useState<string | null>(null);

  // Carrega dados ao montar o componente
  useEffect(() => {
    loadTotais();
  }, []);

  /**
   * Calcula os totais a partir das pessoas e transações
   */
  const loadTotais = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Carrega pessoas e transações em paralelo
      const [pessoas, transacoes] = await Promise.all([
        getPessoas(),
        getTransacoes(),
      ]);

      // Calcula totais por pessoa
      const totais: TotalPessoa[] = pessoas.map((pessoa: Pessoa) => {
        const transacoesPessoa = transacoes.filter(
          (t: Transacao) => t.pessoaId === pessoa.id
        );

        const totalReceitas = transacoesPessoa
          .filter((t: Transacao) => t.tipo === TipoTransacao.Receita)
          .reduce((sum: number, t: Transacao) => sum + t.valor, 0);

        const totalDespesas = transacoesPessoa
          .filter((t: Transacao) => t.tipo === TipoTransacao.Despesa)
          .reduce((sum: number, t: Transacao) => sum + t.valor, 0);

        return {
          pessoa,
          totalReceitas,
          totalDespesas,
          saldo: totalReceitas - totalDespesas,
        };
      });

      // Calcula totais gerais
      const geralReceitas = totais.reduce((sum, t) => sum + t.totalReceitas, 0);
      const geralDespesas = totais.reduce((sum, t) => sum + t.totalDespesas, 0);

      setTotaisPorPessoa(totais);
      setTotalGeralReceitas(geralReceitas);
      setTotalGeralDespesas(geralDespesas);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Formata valor como moeda brasileira
  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  // Saldo líquido geral
  const saldoLiquido = totalGeralReceitas - totalGeralDespesas;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Consulta de Totais"
        description="Visualize o resumo financeiro por pessoa e os totais gerais do sistema."
        action={
          <div className="flex gap-2 flex-wrap">
            <ExportButtons
              totaisPorPessoa={totaisPorPessoa}
              totalGeralReceitas={totalGeralReceitas}
              totalGeralDespesas={totalGeralDespesas}
              saldoLiquido={saldoLiquido}
            />
            <ActionButton onClick={loadTotais} variant="secondary" isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </ActionButton>
          </div>
        }
      />

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-6">
          <AlertMessage type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Cards de totais gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total de Receitas */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Receitas</p>
              <p className="text-2xl font-bold text-success">
                {isLoading ? '...' : formatCurrency(totalGeralReceitas)}
              </p>
            </div>
          </div>
        </div>

        {/* Total de Despesas */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Despesas</p>
              <p className="text-2xl font-bold text-destructive">
                {isLoading ? '...' : formatCurrency(totalGeralDespesas)}
              </p>
            </div>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${saldoLiquido >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <Wallet className={`w-6 h-6 ${saldoLiquido >= 0 ? 'text-success' : 'text-destructive'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Liquido</p>
              <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                {isLoading ? '...' : formatCurrency(saldoLiquido)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos financeiros */}
      {!isLoading && (
        <div className="mb-8">
          <FinancialCharts
            totaisPorPessoa={totaisPorPessoa}
            totalGeralReceitas={totalGeralReceitas}
            totalGeralDespesas={totalGeralDespesas}
          />
        </div>
      )}

      {/* Tabela de totais por pessoa */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Totais por Pessoa</h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Carregando...</span>
          </div>
        ) : totaisPorPessoa.length === 0 ? (
          <div className="p-8">
            <p className="text-center text-muted-foreground">Nenhuma pessoa cadastrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Pessoa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Idade</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Receitas</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Despesas</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {totaisPorPessoa.map((item) => (
                  <tr key={item.pessoa.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.pessoa.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.pessoa.idade} anos
                      {item.pessoa.idade < 18 && (
                        <span className="ml-2 text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                          Menor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-success font-medium">
                      {formatCurrency(item.totalReceitas)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-destructive font-medium">
                      {formatCurrency(item.totalDespesas)}
                    </td>
                    <td className={`px-6 py-4 text-sm text-right font-bold ${item.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(item.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Rodapé com totais */}
              <tfoot className="bg-muted/70 font-semibold">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm text-foreground">
                    TOTAL GERAL
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-success">
                    {formatCurrency(totalGeralReceitas)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-destructive">
                    {formatCurrency(totalGeralDespesas)}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right ${saldoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(saldoLiquido)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotaisPage;
