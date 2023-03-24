/*
Essa tabela não guardará todos os pokemons da geração configurada no front-end, mas sim os pokemons 
já capturados por algum usuário.
*/

CREATE TABLE captured_pokemons (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	specie VARCHAR(25) NOT NULL,
	chain_id INT UNSIGNED NOT NULL,
	/*
	evolution_id 1 = forma base;
	evolution_id 2 = primeira evolução;
	evolution_id 3 = segunda evolução.
	*/
	evolution_id INT UNSIGNED NOT NULL,
	# Diferença entre a experiência que ganhou com lutas e a base_experience.
	experience_plus INT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

SELECT * FROM captured_pokemons;
DESCRIBE captured_pokemons;
DROP TABLE captured_pokemons;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE captured_pokemons;