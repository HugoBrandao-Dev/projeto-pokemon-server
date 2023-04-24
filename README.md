# Descrição
Projeto back-end de __portifólio__, que complementa o projeto front-end [Projeto Pokemon](https://github.com/HugoBrandao-Dev/projeto-pokemon).

## Tecnologias

### Framework(s)
* Express JS: Criação de rotas que atenderão as requisições.

### Biblioteca(s)
* JSONWebToken: Para trabalhar com criação e validação de tokens;
* ValidatorJS: Para validação de campos de formulário;
* BcryptJS: Para geração de hash, sendo utilizada para criar hash a partir de uma senha.

### Banco de dados
* MySQL: SGBD para armazenamento de dados.

### Outra(s)
* NPM: Para gerenciamento de pacotes;
* Knex JS: Query builder para a conexão e operações no MySQL.

## Possíveis melhorias futuras
* Tornar as rotas de busca de rate drop de frutas e moedas uma só, onde a busca será baseada não mais pelo ID do item, mas pelo tipo do item. Além disso, retornar frutas e moedas em suas listas respectivas.
* Há várias utilizações de valores HARDCODE na tabela, buscar forma de obter esses valores através de buscas SQL.
* Apesar de não apresentado falha, com relação a geração de token, ao invés de fazer o armazenamento
do token em uma variável, criar uma promise no quarto parâmetro do método sign.