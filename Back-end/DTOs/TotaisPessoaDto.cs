namespace ControleGastosResidenciais.DTOs
{
    public class PessoaResumoDto
    {
        public string Nome { get; set; } = string.Empty;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
    }
    
    public class RelatorioGeralDto
    {
        public List<PessoaResumoDto> Pessoas { get; set; } = new();
        public decimal TotalGeralReceitas { get; set; }
        public decimal TotalGeralDespesas { get; set; }
        public decimal SaldoLiquidoGeral { get; set; }
    }
}
