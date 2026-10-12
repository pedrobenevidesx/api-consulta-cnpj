# api-empresas

API em Node.js e TypeScript para consultar empresas por CNPJ. Ela usa a [BrasilAPI](https://brasilapi.com.br) como fonte externa e o PostgreSQL como cache: a primeira consulta de um CNPJ vai buscar na BrasilAPI e salva o resultado, as seguintes são respondidas direto do banco.

Também é possível cadastrar empresas manualmente, para o caso de a BrasilAPI não encontrar um CNPJ.

## Como funciona

No `GET /empresas/:cnpj`, o fluxo é:

1. Procura o CNPJ no banco. Se achou, devolve.
2. Se não achou, consulta a BrasilAPI.
3. Se a BrasilAPI encontrou, salva no banco e devolve a empresa salva.
4. Se não encontrou em lugar nenhum, responde 404. Nesse caso o cliente pode cadastrar a empresa com um `POST /empresas`.

Toda empresa tem uma coluna `origem` (`brasilapi` ou `manual`). Ela é definida pelo código, nunca pelo usuário, justamente para não misturar dado oficial com dado cadastrado à mão sem nenhuma distinção.

## Stack

Node.js, TypeScript, Express 5, Zod 4 e PostgreSQL (driver `pg`). O projeto usa ESM.

## Estrutura

O código fica em `src/`, separado em camadas:

- `routes`: mapeia os endpoints para os controllers
- `controllers`: lê a requisição, valida a entrada com Zod e monta a resposta HTTP
- `services`: orquestra o fluxo banco → BrasilAPI → salvar
- `repositories`: único lugar que escreve SQL
- `clients`: único lugar que fala com a BrasilAPI (valida e converte a resposta para o formato da tabela)
- `schemas`: schemas Zod
- `middleware`: tratamento de erros
- `config`: conexão com o banco

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/empresas` | Lista todas as empresas salvas |
| GET | `/empresas/:cnpj` | Busca no banco; se não achar, busca na BrasilAPI e salva |
| POST | `/empresas` | Cadastro manual |
| PATCH | `/empresas/:cnpj` | Atualização parcial (nome, cidade, estado, situação) |
| DELETE | `/empresas/:cnpj` | Remove a empresa e devolve o registro removido |

O CNPJ pode ser enviado com ou sem máscara; ele é normalizado para 14 dígitos antes de qualquer consulta.

Exemplo de corpo para o `POST /empresas`:

```json
{
  "cnpj": "12345678000199",
  "nome": "Empresa Teste LTDA",
  "cidade": "Juiz de Fora",
  "estado": "MG",
  "situacao": "ATIVA"
}
```

Códigos de resposta que a API devolve: `200`, `201` (cadastro), `400` (dados inválidos), `404` (empresa não encontrada), `409` (CNPJ já cadastrado) e `500` (erro inesperado).

## Exemplos

Requisições feitas pelo Insomnia. Na listagem aparecem empresas de origens diferentes: as duas primeiras vieram da BrasilAPI na primeira consulta, e a última foi cadastrada manualmente.

![Resposta do GET /empresas](img/get-listar-empresas.png)

Cadastro manual, com resposta `201`. O campo `origem` não vai no corpo da requisição: quem preenche é o servidor.

![Cadastro manual via POST /empresas](img/post-cadastro-manual.png)

## Como rodar

Você precisa de Node.js e de um PostgreSQL rodando.

```bash
git clone <url-do-repositorio>
cd api-empresas
npm install
```

Crie um arquivo `.env` na raiz:

```
PORT=3000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

Crie a tabela no banco:

```sql
CREATE TABLE empresas (
    id        SERIAL PRIMARY KEY,
    cnpj      VARCHAR(14) NOT NULL UNIQUE,
    nome      VARCHAR(200) NOT NULL,
    cidade    VARCHAR(100),
    estado    CHAR(2),
    situacao  VARCHAR(30),
    origem    VARCHAR(10) NOT NULL DEFAULT 'brasilapi'
              CHECK (origem IN ('brasilapi', 'manual'))
);
```

Rode em desenvolvimento:

```bash
npm run dev
```

Ou compile e rode a versão final:

```bash
npm run build
npm start
```
