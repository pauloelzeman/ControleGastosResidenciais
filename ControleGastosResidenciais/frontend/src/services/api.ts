/**
 * Serviço centralizado para chamadas HTTP à API
 * Utiliza Axios para comunicação REST com o back-end
 */

import axios, { AxiosError } from 'axios';
import {
  Pessoa,
  PessoaInput,
  Categoria,
  CategoriaInput,
  Transacao,
  TransacaoInput,
  TotaisGerais,
  ApiError
} from '@/types';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:5216/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Função auxiliar para extrair mensagem de erro da resposta da API
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Tenta extrair mensagem do corpo da resposta
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      // Se for string direta
      if (typeof data === 'string') {
        return data;
      }
      
      // Se tiver campo message
      if (data.message) {
        return data.message;
      }
      
      // Se tiver array de errors
      if (data.errors && data.errors.length > 0) {
        return data.errors.join(', ');
      }
    }
    
    // Mensagem padrão baseada no status
    if (axiosError.response?.status === 400) {
      return 'Dados inválidos. Verifique os campos e tente novamente.';
    }
    if (axiosError.response?.status === 404) {
      return 'Registro não encontrado.';
    }
    if (axiosError.response?.status === 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    return axiosError.message || 'Erro ao comunicar com o servidor.';
  }
  
  return 'Ocorreu um erro inesperado.';
};

// ==================== PESSOAS ====================

/**
 * Lista todas as pessoas cadastradas
 */
export const getPessoas = async (): Promise<Pessoa[]> => {
  const response = await api.get<Pessoa[]>('pessoas');
  return response.data;
};

/**
 * Busca uma pessoa por ID
 */
export const getPessoaById = async (id: number): Promise<Pessoa> => {
  const response = await api.get<Pessoa>(`pessoas/${id}`);
  return response.data;
};

/**
 * Cria uma nova pessoa
 */
export const createPessoa = async (pessoa: PessoaInput): Promise<Pessoa> => {
  const response = await api.post<Pessoa>('pessoas', pessoa);
  return response.data;
};

/**
 * Atualiza uma pessoa existente
 */
export const updatePessoa = async (id: number, pessoa: PessoaInput): Promise<Pessoa> => {
  const response = await api.put<Pessoa>(`pessoas/${id}`, pessoa);
  return response.data;
};

/**
 * Deleta uma pessoa (transações associadas são removidas pelo back-end)
 */
export const deletePessoa = async (id: number): Promise<void> => {
  await api.delete(`pessoas/${id}`);
};

// ==================== CATEGORIAS ====================

/**
 * Lista todas as categorias cadastradas
 */
export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get<Categoria[]>('categorias');
  return response.data;
};

/**
 * Busca uma categoria por ID
 */
export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const response = await api.get<Categoria>(`categorias/${id}`);
  return response.data;
};

/**
 * Cria uma nova categoria
 */
export const createCategoria = async (categoria: CategoriaInput): Promise<Categoria> => {
  const response = await api.post<Categoria>('categorias', categoria);
  return response.data;
};

/**
 * Atualiza uma categoria existente
 */
export const updateCategoria = async (id: number, categoria: CategoriaInput): Promise<Categoria> => {
  const response = await api.put<Categoria>(`categorias/${id}`, categoria);
  return response.data;
};

/**
 * Deleta uma categoria
 */
export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`categorias/${id}`);
};

// ==================== TRANSAÇÕES ====================

/**
 * Lista todas as transações cadastradas
 */
export const getTransacoes = async (): Promise<Transacao[]> => {
  const response = await api.get<Transacao[]>('transacoes');
  return response.data;
};

/**
 * Busca uma transação por ID
 */
export const getTransacaoById = async (id: number): Promise<Transacao> => {
  const response = await api.get<Transacao>(`transacoes/${id}`);
  return response.data;
};

/**
 * Cria uma nova transação
 * Regras de negócio aplicadas pelo back-end:
 * - Menores de 18 anos só podem registrar despesas
 * - Categorias devem ser compatíveis com o tipo da transação
 */
export const createTransacao = async (transacao: TransacaoInput): Promise<Transacao> => {
  const response = await api.post<Transacao>('transacoes', transacao);
  return response.data;
};

/**
 * Atualiza uma transação existente
 */
export const updateTransacao = async (id: number, transacao: TransacaoInput): Promise<Transacao> => {
  const response = await api.put<Transacao>(`transacoes/${id}`, transacao);
  return response.data;
};

/**
 * Deleta uma transação
 */
export const deleteTransacao = async (id: number): Promise<void> => {
  await api.delete(`transacoes/${id}`);
};

// ==================== TOTAIS ====================

/**
 * Obtém os totais de receitas e despesas por pessoa
 * Retorna também os totais gerais consolidados
 */
export const getTotais = async (): Promise<TotaisGerais> => {
  const response = await api.get<TotaisGerais>('totais');
  return response.data;
};

export default api;
