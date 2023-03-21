CREATE TABLE users_pokemons (
	user_id INT UNSIGNED NOT NULL,
	pokemon_id INT UNSIGNED NOT NULL,
	CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT fk_pokemon_id FOREIGN KEY (pokemon_id) REFERENCES captured_pokemons(id)
);

SELECT * FROM users_pokemons;
DESCRIBE users_pokemons;
DROP TABLE users_pokemons;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE users_pokemons;