using System.Text.Json.Serialization;

namespace ControleGastosResidenciais.Models
{
    public class Pessoa
    {
        public int Id { get; set; } // PK auto-gerada
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }

        // Regra: ao deletar pessoa, deletar transações
        [JsonIgnore]
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
