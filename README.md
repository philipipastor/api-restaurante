# API Restaurante

API REST para gerenciamento de pedidos e mesas de um restaurante.

A aplicação permite cadastrar produtos, controlar mesas e sessões de atendimento e registrar os pedidos realizados durante uma sessão.

## Funcionalidades

- Cadastro e listagem de produtos
- Gerenciamento de mesas
- Abertura e controle de sessões das mesas
- Registro de pedidos vinculados a uma sessão
- Validação da existência do produto antes do pedido
- Validação do estado da sessão da mesa
- Consulta dos pedidos de uma sessão
- Cálculo dos valores dos pedidos
- Validação de dados com Zod
- Persistência em SQLite utilizando Knex
- Migrations e seeds para estrutura e dados iniciais
- Coleção de requisições do Insomnia incluída no repositório

## Tecnologias

- Node.js
- TypeScript
- Express
- Knex.js
- SQLite
- Zod

## Recursos da API

```text
/products
/tables
/sessions
/orders
```

## Banco de dados

O banco é gerenciado por meio do Knex, com migrations para criação das tabelas e seeds para inserção de dados iniciais.

```text
src/database/
├── migrations/
├── seeds/
├── types/
└── knex.ts
```

## Como executar

Instale as dependências:

```bash
npm install
```

Execute as migrations:

```bash
npm run knex -- migrate:latest
```

Execute os seeds, se desejar carregar os dados iniciais:

```bash
npm run knex -- seed:run
```

Inicie a API:

```bash
npm run dev
```

## Testando a API

O repositório contém o arquivo `Request_Insomia.json`, que pode ser importado no Insomnia para acessar as requisições utilizadas no projeto.

## Aprendizados

O projeto trabalha criação de APIs REST, Query Builder, migrations, seeds, relacionamentos entre tabelas, validação de dados e implementação de regras de negócio.

## Autor

Desenvolvido por **Philipi Pastor**.
