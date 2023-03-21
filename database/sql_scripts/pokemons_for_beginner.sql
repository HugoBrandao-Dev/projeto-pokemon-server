/*
Opções de pokemons para que o usuário que não tem nenhum (para quem está iniciando).
*/

CREATE TABLE pokemons_for_beginner (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	pokemon VARCHAR(25) NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO pokemons_for_beginner(pokemon) VALUES
("bulbasaur"),
("charmander"),
("squirtle"),
("pichu");

SELECT * FROM pokemons_for_beginner;
DESCRIBE pokemons_for_beginner;