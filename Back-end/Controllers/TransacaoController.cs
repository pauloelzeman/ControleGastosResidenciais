using ControleGastosResidenciais.Data;
using ControleGastosResidenciais.DTOs;
using ControleGastosResidenciais.Models;
using ControleGastosResidenciais.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastosResidenciais.Controllers
{
    [ApiController]
    [Route("api/transacoes")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TransacaoService _service;
        public TransacoesController(AppDbContext context, TransacaoService service)
        {
            _context = context;
            _service = service;
        }

        [HttpPost]
        public IActionResult Criar([FromBody] TransacaoCreateDto dto)
        {
            try
            {
                var transacao = new Transacao
                {
                    Descricao = dto.Descricao,
                    Valor = dto.Valor,
                    Tipo = dto.Tipo,
                    PessoaId = dto.PessoaId,
                    CategoriaId = dto.CategoriaId
                };

                //Chame o service e captura o objeto retornado
                var resultado = _service.Criar(transacao);

                //Retorna a 'resultado'
                return CreatedAtAction(nameof(Listar), new { id = resultado.Id }, resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }


        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(_context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .AsNoTracking()
                .ToList());
        }
    }
}