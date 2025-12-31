using ControleGastosResidenciais.Data;
using ControleGastosResidenciais.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Services
{
    public class TransacaoService
    {
        private readonly AppDbContext _context;
        public TransacaoService(AppDbContext context)
        {
            _context = context;
        }

        public Transacao Criar(Transacao transacao)
        {
            // Busca Pessoa e Categoria em uma única consulta
            var pessoa = _context.Pessoas.AsNoTracking().FirstOrDefault(p => p.Id == transacao.PessoaId)
                ?? throw new Exception("Pessoa não encontrada");

            var categoria = _context.Categorias.AsNoTracking().FirstOrDefault(c => c.Id == transacao.CategoriaId)
                ?? throw new Exception("Categoria não encontrada");

            // VALIDAÇÕES DA REGRA DE NEGÓCIO
            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
                throw new Exception("Menores de idade não podem registrar receitas");

            if (categoria.Finalidade == FinalidadeCategoria.Despesa && transacao.Tipo == TipoTransacao.Receita)
                throw new Exception("Categoria não aceita receitas");

            if (categoria.Finalidade == FinalidadeCategoria.Receita && transacao.Tipo == TipoTransacao.Despesa)
                throw new Exception("Categoria não aceita despesas");

            _context.Transacoes.Add(transacao);
            _context.SaveChanges();

            // Retorna o objeto completo para o Controller
            return _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .First(t => t.Id == transacao.Id);
        }
    }
}