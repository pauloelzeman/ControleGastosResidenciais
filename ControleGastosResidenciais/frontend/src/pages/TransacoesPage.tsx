/**
 * Página de Cadastro de Transações
 * Permite cadastrar e listar transações financeiras
 * 
 * Regras de negócio aplicadas pelo back-end:
 * - Menores de 18 anos só podem registrar despesas
 * - Categorias devem ser compatíveis com o tipo da transação
 */

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import {
  Transacao,
  TransacaoInput,
  Pessoa,
  Categoria,
  TipoTransacao,
  Finalidade,
  getTipoTransacaoLabel,
} from '@/types';
import {
  getTransacoes,
  createTransacao,
  deleteTransacao,
  getPessoas,
  getCategorias,
  getErrorMessage,
} from '@/services/api';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import AlertMessage from '@/components/AlertMessage';
import ActionButton from '@/components/ActionButton';
import { FormInput, FormSelect } from '@/components/FormInput';

const TransacoesPage = () => {
  // Estado para lista de transações
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para dados auxiliares (pessoas e categorias)
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Estado para formulário
  const [formData, setFormData] = useState<TransacaoInput>({
    descricao: '',
    valor: 0,
    tipo: TipoTransacao.Despesa,
    pessoaId: 0,
    categoriaId: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para mensagens
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carrega dados ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Carrega todas as transações, pessoas e categorias da API
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Carrega dados em paralelo para melhor performance
      const [transacoesData, pessoasData, categoriasData] = await Promise.all([
        getTransacoes(),
        getPessoas(),
        getCategorias(),
      ]);

      setTransacoes(transacoesData);
      setPessoas(pessoasData);
      setCategorias(categoriasData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtra categorias compatíveis com o tipo de transação selecionado
   * - Finalidade.Despesa: apenas para despesas
   * - Finalidade.Receita: apenas para receitas
   * - Finalidade.Ambas: para qualquer tipo
   */
  const getCategoriasCompatíveis = () => {
    return categorias.filter((cat) => {
      if (cat.finalidade === Finalidade.Ambas) return true;
      if (formData.tipo === TipoTransacao.Despesa && cat.finalidade === Finalidade.Despesa) return true;
      if (formData.tipo === TipoTransacao.Receita && cat.finalidade === Finalidade.Receita) return true;
      return false;
    });
  };

  /**
   * Verifica se pessoa é menor de idade (alerta informativo)
   */
  const isPessoaMenorDeIdade = () => {
    const pessoa = pessoas.find((p) => p.id === formData.pessoaId);
    return pessoa && pessoa.idade < 18;
  };

  /**
   * Submete o formulário para criar nova transação
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.descricao.trim()) {
      setError('A descrição é obrigatória');
      return;
    }
    if (formData.valor <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }
    if (!formData.pessoaId) {
      setError('Selecione uma pessoa');
      return;
    }
    if (!formData.categoriaId) {
      setError('Selecione uma categoria');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createTransacao(formData);
      setSuccess('Transação cadastrada com sucesso!');
      setFormData({
        descricao: '',
        valor: 0,
        tipo: TipoTransacao.Despesa,
        pessoaId: 0,
        categoriaId: 0,
      });
      await loadData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // Exibe mensagem de erro vinda da API (regras de negócio)
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Deleta uma transação após confirmação
   */
  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta transação?')) {
      return;
    }

    try {
      setError(null);
      await deleteTransacao(id);
      setSuccess('Transação excluída com sucesso!');
      await loadData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Reseta categoria quando tipo muda (para evitar categoria incompatível)
  const handleTipoChange = (novoTipo: TipoTransacao) => {
    setFormData({ ...formData, tipo: novoTipo, categoriaId: 0 });
  };

  // Formata valor como moeda brasileira
  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  // Configuração das colunas da tabela
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'descricao', header: 'Descrição' },
    {
      key: 'valor',
      header: 'Valor',
      render: (transacao: Transacao) => (
        <span className={transacao.tipo === TipoTransacao.Receita ? 'text-success font-medium' : 'text-destructive font-medium'}>
          {transacao.tipo === TipoTransacao.Receita ? '+' : '-'} {formatCurrency(transacao.valor)}
        </span>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (transacao: Transacao) => (
        <span
          className={`
            inline-flex px-2.5 py-1 rounded-full text-xs font-medium
            ${transacao.tipo === TipoTransacao.Receita
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
            }
          `}
        >
          {getTipoTransacaoLabel(transacao.tipo)}
        </span>
      ),
    },
    {
      key: 'pessoa',
      header: 'Pessoa',
      render: (transacao: Transacao) => {
        const pessoa = pessoas.find((p) => p.id === transacao.pessoaId);
        return pessoa?.nome || `ID: ${transacao.pessoaId}`;
      },
    },
    {
      key: 'categoria',
      header: 'Categoria',
      render: (transacao: Transacao) => {
        const categoria = categorias.find((c) => c.id === transacao.categoriaId);
        return categoria?.descricao || `ID: ${transacao.categoriaId}`;
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (transacao: Transacao) => (
        <button
          onClick={() => handleDelete(transacao.id)}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Excluir transação"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Cadastro de Transações"
        description="Registre receitas e despesas. Menores de 18 anos só podem registrar despesas."
      />

      {/* Mensagens de feedback */}
      {error && (
        <div className="mb-6">
          <AlertMessage type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="mb-6">
          <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />
        </div>
      )}

      {/* Aviso para menor de idade */}
      {isPessoaMenorDeIdade() && formData.tipo === TipoTransacao.Receita && (
        <div className="mb-6">
          <AlertMessage
            type="warning"
            message="Atenção: Menores de 18 anos só podem registrar despesas. Esta transação será rejeitada pelo servidor."
          />
        </div>
      )}

      {/* Formulário de cadastro */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Nova Transação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Descrição"
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Digite a descrição"
              required
            />
            <FormInput
              label="Valor (R$)"
              type="number"
              value={formData.valor || ''}
              onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
              placeholder="0,00"
              min={0.01}
              step={0.01}
              required
            />
            <FormSelect
              label="Tipo"
              value={formData.tipo}
              onChange={(e) => handleTipoChange(parseInt(e.target.value))}
              required
            >
              <option value={TipoTransacao.Despesa}>Despesa</option>
              <option value={TipoTransacao.Receita}>Receita</option>
            </FormSelect>
            <FormSelect
              label="Pessoa"
              value={formData.pessoaId || ''}
              onChange={(e) => setFormData({ ...formData, pessoaId: parseInt(e.target.value) || 0 })}
              required
            >
              <option value="">Selecione uma pessoa</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome} ({pessoa.idade} anos)
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label="Categoria"
              value={formData.categoriaId || ''}
              onChange={(e) => setFormData({ ...formData, categoriaId: parseInt(e.target.value) || 0 })}
              required
            >
              <option value="">Selecione uma categoria</option>
              {getCategoriasCompatíveis().map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descricao}
                </option>
              ))}
            </FormSelect>
            <div className="flex items-end">
              <ActionButton type="submit" isLoading={isSubmitting} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar
              </ActionButton>
            </div>
          </div>
        </form>
      </div>

      {/* Listagem de transações */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Transações Cadastradas</h2>
        <DataTable
          columns={columns}
          data={transacoes}
          keyExtractor={(transacao) => transacao.id}
          emptyMessage="Nenhuma transação cadastrada"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TransacoesPage;
