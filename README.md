
# Sistema de Controle de Gastos Residenciais

Este projeto é uma solução completa para gerenciamento de finanças domésticas, permitindo o controle de receitas e despesas por morador. O sistema foi desenvolvido com uma arquitetura moderna, escalável e bem definida, separando responsabilidades entre **WebAPI (.NET)** e **Front-end (React)**, seguindo boas práticas de mercado.

## 🚀 Tecnologias Utilizadas

### Back-end
- **C# / .NET 8**
- **Entity Framework Core**: ORM para mapeamento objeto-relacional.
- **SQLite**: Banco de dados local e persistente.
- **Swagger / OpenAPI**: Documentação interativa da API.
- **Injeção de Dependência**: Utilizada para desacoplamento e testabilidade.

### Front-end
- **React com TypeScript**
- **Axios** para comunicação com a API
- **Vite** para build e servidor de desenvolvimento

---

## 📋 Funcionalidades Implementadas

1. **Cadastro de Pessoas**
   - Criação, listagem e exclusão
   - Deleção em cascata das transações associadas
   - Validação de idade

2. **Cadastro de Categorias**
   - Criação e listagem
   - Finalidade configurável: Receita, Despesa ou Ambas

3. **Cadastro de Transações**
   - Restrição de menores de idade (somente despesas)
   - Validação de finalidade da categoria
   - Identificadores únicos automáticos

4. **Relatórios Financeiros**
   - Totais individuais por pessoa
   - Resumo geral consolidado (receitas, despesas e saldo)

---

## 🔧 Execução do Back-end

### Pré-requisitos
- .NET SDK 8.0+

### Passos
```bash
cd ControleGastosResidenciais
dotnet restore
dotnet run
```

Swagger:
```
http://localhost:5216/swagger/index.html
```

O banco SQLite `controle_gastos.db` é criado automaticamente na primeira execução.

---

## 🗄️ Banco de Dados e Migrations

Para versionamento ou recriação do banco:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Aplicação automática de migrations (opcional):
- Por padrão, o projeto utiliza EnsureCreated() para criar automaticamente o banco de dados na primeira execução.
Caso seja necessário versionamento do schema, o método pode ser substituído por Database.Migrate() e o uso de migrations do Entity Framework Core.
```csharp
db.Database.Migrate();
```

---

## 🎨 Execução do Front-end

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos
```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em:
```
http://localhost:5173
```
http://localhost:8080 (se porta 5173 estiver ocupada)
---

## 🛠️ Arquitetura e Boas Práticas

- DTOs para isolamento de domínio
- Services para regras de negócio
- Controllers enxutos
- CORS configurado
- Serialização JSON segura

---

## 📌 Considerações Finais

Projeto desenvolvido por Paulo Elzeman.
