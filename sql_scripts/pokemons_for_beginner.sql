/*
Opções de pokemons para que o usuário que não tem nenhum (para quem está iniciando).
*/

CREATE TABLE pokemons_for_beginner (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	pokemon VARCHAR(25) NOT NULL,
	PRIMARY KEY (id)
);

DESCRIBE pokemons_for_beginner;