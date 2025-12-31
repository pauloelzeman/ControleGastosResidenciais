/**
 * Página de Cadastro de Pessoas
 * Permite cadastrar, listar e deletar pessoas
 * Ao deletar uma pessoa, as transações associadas são removidas pelo back-end
 */

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Pessoa, PessoaInput } from '@/types';
import { getPessoas, createPessoa, deletePessoa, getErrorMessage } from '@/services/api';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import AlertMessage from '@/components/AlertMessage';
import ActionButton from '@/components/ActionButton';
import { FormInput } from '@/components/FormInput';

const PessoasPage = () => {
  // Estado para lista de pessoas
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para formulário
  const [formData, setFormData] = useState<PessoaInput>({ nome: '', idade: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para mensagens
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carrega lista de pessoas ao montar o componente
  useEffect(() => {
    loadPessoas();
  }, []);

  /**
   * Carrega todas as pessoas da API
   */
  const loadPessoas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPessoas();
      setPessoas(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submete o formulário para criar nova pessoa
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome.trim()) {
      setError('O nome é obrigatório');
      return;
    }
    if (formData.idade < 0) {
      setError('A idade deve ser um número positivo');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createPessoa(formData);
      setSuccess('Pessoa cadastrada com sucesso!');
      setFormData({ nome: '', idade: 0 });
      await loadPessoas();
      
      // Limpa mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Deleta uma pessoa após confirmação
   * Transações associadas são removidas automaticamente pelo back-end
   */
  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Deseja realmente excluir "${nome}"? As transações associadas também serão removidas.`)) {
      return;
    }

    try {
      setError(null);
      await deletePessoa(id);
      setSuccess('Pessoa excluída com sucesso!');
      await loadPessoas();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Configuração das colunas da tabela
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'nome', header: 'Nome' },
    { key: 'idade', header: 'Idade' },
    {
      key: 'actions',
      header: 'Ações',
      render: (pessoa: Pessoa) => (
        <button
          onClick={() => handleDelete(pessoa.id, pessoa.nome)}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Excluir pessoa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Cadastro de Pessoas"
        description="Gerencie as pessoas do sistema. Ao excluir uma pessoa, suas transações também são removidas."
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

      {/* Formulário de cadastro */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Nova Pessoa</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Nome"
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Digite o nome"
            required
          />
          <FormInput
            label="Idade"
            type="number"
            value={formData.idade || ''}
            onChange={(e) => setFormData({ ...formData, idade: parseInt(e.target.value) || 0 })}
            placeholder="Digite a idade"
            min={0}
            required
          />
          <div className="flex items-end">
            <ActionButton type="submit" isLoading={isSubmitting} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar
            </ActionButton>
          </div>
        </form>
      </div>

      {/* Listagem de pessoas */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Pessoas Cadastradas</h2>
        <DataTable
          columns={columns}
          data={pessoas}
          keyExtractor={(pessoa) => pessoa.id}
          emptyMessage="Nenhuma pessoa cadastrada"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PessoasPage;
