using ControleGastosResidenciais.Models;

namespace ControleGastosResidenciais.DTOs
{
    public class CategoriaCreateDto
    {
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
    }
}