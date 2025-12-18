using System.ComponentModel.DataAnnotations;

namespace ControleGastosResidenciais.DTOs
{
    public class PessoaCreateDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;

        [Range(1, 150, ErrorMessage = "A idade deve ser um número positivo.")]
        public int Idade { get; set; }
    }
}