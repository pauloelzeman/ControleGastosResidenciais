using ControleGastosResidenciais.Models;

namespace ControleGastosResidenciais.DTOs
{
    public class TransacaoCreateDto
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public int PessoaId { get; set; }
        public int CategoriaId { get; set; }
    }
}