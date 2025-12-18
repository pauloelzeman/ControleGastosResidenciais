/**
 * Página de Cadastro de Categorias
 * Permite cadastrar e listar categorias de transações
 * Cada categoria tem uma finalidade: Despesa, Receita ou Ambas
 */

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Categoria, CategoriaInput, Finalidade, getFinalidadeLabel } from '@/types';
import { getCategorias, createCategoria, deleteCategoria, getErrorMessage } from '@/services/api';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import AlertMessage from '@/components/AlertMessage';
import ActionButton from '@/components/ActionButton';
import { FormInput, FormSelect } from '@/components/FormInput';
import { abort } from 'process';
import { Alert } from '../components/ui/alert';

const CategoriasPage = () => {
  // Estado para lista de categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para formulário
  const [formData, setFormData] = useState<CategoriaInput>({
    descricao: '',
    finalidade: Finalidade.Ambas,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para mensagens
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carrega lista de categorias ao montar o componente
  useEffect(() => {
    loadCategorias();
  }, []);

  /**
   * Carrega todas as categorias da API
   */
  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submete o formulário para criar nova categoria
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.descricao.trim()) {
      setError('A descrição é obrigatória');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createCategoria(formData);
      setSuccess('Categoria cadastrada com sucesso!');
      setFormData({ descricao: '', finalidade: Finalidade.Ambas });
      await loadCategorias();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Deleta uma categoria após confirmação
   */
    const handleDelete = async (id: number, descricao: string) => {
        //if (!confirm(`Deseja realmente excluir a categoria "${descricao}"?`))
        {
            alert(`Não permitida a exclusão de categoria`);
      return;
    }

    try {
      setError(null);
      await deleteCategoria(id);
      setSuccess('Categoria excluída com sucesso!');
      await loadCategorias();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // Configuração das colunas da tabela
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'descricao', header: 'Descrição' },
    {
      key: 'finalidade',
      header: 'Finalidade',
      render: (categoria: Categoria) => (
        <span
          className={`
            inline-flex px-2.5 py-1 rounded-full text-xs font-medium
            ${categoria.finalidade === Finalidade.Despesa
              ? 'bg-destructive/10 text-destructive'
              : categoria.finalidade === Finalidade.Receita
                ? 'bg-success/10 text-success'
                : 'bg-primary/10 text-primary'
            }
          `}
        >
          {getFinalidadeLabel(categoria.finalidade)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (categoria: Categoria) => (
        <button
          onClick={() => handleDelete(categoria.id, categoria.descricao)}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Excluir categoria"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Cadastro de Categorias"
        description="Gerencie as categorias de transações. Cada categoria define se é para despesa, receita ou ambas."
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
        <h2 className="text-lg font-semibold text-foreground mb-4">Nova Categoria</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Descrição"
            type="text"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Digite a descrição"
            required
          />
          <FormSelect
            label="Finalidade"
            value={formData.finalidade}
            onChange={(e) => setFormData({ ...formData, finalidade: parseInt(e.target.value) })}
            required
          >
            <option value={Finalidade.Despesa}>Despesa</option>
            <option value={Finalidade.Receita}>Receita</option>
            <option value={Finalidade.Ambas}>Ambas</option>
          </FormSelect>
          <div className="flex items-end">
            <ActionButton type="submit" isLoading={isSubmitting} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar
            </ActionButton>
          </div>
        </form>
      </div>

      {/* Listagem de categorias */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Categorias Cadastradas</h2>
        <DataTable
          columns={columns}
          data={categorias}
          keyExtractor={(categoria) => categoria.id}
          emptyMessage="Nenhuma categoria cadastrada"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CategoriasPage;
