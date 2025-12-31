using ControleGastosResidenciais.Data;
using ControleGastosResidenciais.DTOs;
using ControleGastosResidenciais.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Controllers
{
    [ApiController]
    [Route("api/pessoas")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Criar([FromBody] PessoaCreateDto dto)
        {
            var pessoa = new Pessoa { Nome = dto.Nome, Idade = dto.Idade };
            _context.Pessoas.Add(pessoa);
            _context.SaveChanges();
            return Ok(pessoa);
        }

        [HttpGet]
        public IActionResult Listar() => Ok(_context.Pessoas);

        [HttpGet("totais")]
        public IActionResult GetTotais()
        {
            var pessoas = _context.Pessoas
                .Select(p => new PessoaResumoDto
                {
                    Nome = p.Nome,
                    TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                    TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                    Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                            p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
                }).ToList();

            var relatorio = new RelatorioGeralDto
            {
                Pessoas = pessoas,
                TotalGeralReceitas = pessoas.Sum(p => p.TotalReceitas),
                TotalGeralDespesas = pessoas.Sum(p => p.TotalDespesas),
                SaldoLiquidoGeral = pessoas.Sum(p => p.Saldo)
            };

            return Ok(relatorio);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var pessoa = _context.Pessoas.Find(id);
            if (pessoa == null) return NotFound();


            _context.Pessoas.Remove(pessoa);
            _context.SaveChanges();
            return NoContent();
        }
    }
}