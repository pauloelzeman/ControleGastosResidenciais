/**
 * Tipos TypeScript para o sistema de controle de gastos residenciais
 * Todas as interfaces seguem o modelo do back-end
 */

// Enum para finalidade da categoria
export enum Finalidade {
  Despesa = 1,
  Receita = 2,
  Ambas = 3
}

// Enum para tipo de transação
export enum TipoTransacao {
  Despesa = 1,
  Receita = 2
}

// Interface para Pessoa
export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

// Interface para criar/editar Pessoa (sem ID)
export interface PessoaInput {
  nome: string;
  idade: number;
}

// Interface para Categoria
export interface Categoria {
  id: number;
  descricao: string;
  finalidade: Finalidade;
}

// Interface para criar/editar Categoria (sem ID)
export interface CategoriaInput {
  descricao: string;
  finalidade: Finalidade;
}

// Interface para Transação
export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
  categoriaId: number;
  pessoa?: Pessoa;
  categoria?: Categoria;
}

// Interface para criar/editar Transação (sem ID)
export interface TransacaoInput {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
  categoriaId: number;
}

// Interface para totais por pessoa
export interface TotalPessoa {
  pessoa: Pessoa;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

// Interface para totais gerais
export interface TotaisGerais {
  totaisPorPessoa: TotalPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

// Interface para erros da API
export interface ApiError {
  message: string;
  errors?: string[];
}

// Helper para obter label da finalidade
export const getFinalidadeLabel = (finalidade: Finalidade): string => {
  switch (finalidade) {
    case Finalidade.Despesa:
      return 'Despesa';
    case Finalidade.Receita:
      return 'Receita';
    case Finalidade.Ambas:
      return 'Ambas';
    default:
      return 'Desconhecido';
  }
};

// Helper para obter label do tipo de transação
export const getTipoTransacaoLabel = (tipo: TipoTransacao): string => {
  switch (tipo) {
    case TipoTransacao.Despesa:
      return 'Despesa';
    case TipoTransacao.Receita:
      return 'Receita';
    default:
      return 'Desconhecido';
  }
};
