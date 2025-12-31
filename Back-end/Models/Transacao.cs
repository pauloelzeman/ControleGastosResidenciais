using System.Text.Json.Serialization;

namespace ControleGastosResidenciais.Models
{
    public enum TipoTransacao
    {
        Despesa = 1,
        Receita = 2
    }

    public class Transacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }

        public int CategoriaId { get; set; }

        public Categoria Categoria { get; set; } = null!;

        public int PessoaId { get; set; }

        public Pessoa Pessoa { get; set; } = null!;
    }
}
