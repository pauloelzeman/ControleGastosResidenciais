using ControleGastosResidenciais.Data;
using ControleGastosResidenciais.DTOs;
using ControleGastosResidenciais.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosResidenciais.Controllers
{
    [ApiController]
    [Route("api/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Criar([FromBody] CategoriaCreateDto dto)
        {
            var categoria = new Categoria { Descricao = dto.Descricao, Finalidade = dto.Finalidade };
            _context.Categorias.Add(categoria);
            _context.SaveChanges();
            return Ok(categoria);
        }

        [HttpGet]
        public IActionResult Listar() => Ok(_context.Categorias);
    }
}