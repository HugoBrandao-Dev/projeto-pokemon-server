USE pokemon_project;

#SELECT * FROM users;
#DROP TABLE users;
TRUNCATE TABLE users;

#SELECT * FROM users_pokemons;
#DROP TABLE users_pokemons;
TRUNCATE TABLE users_pokemons;

#SELECT * FROM captured_pokemons;
#DROP TABLE captured_pokemons;
TRUNCATE TABLE captured_pokemons;

#SELECT * FROM users_items;
TRUNCATE TABLE users_items;

INSERT INTO captured_pokemons(
	specie,
	chain_id,
	evolution_id,
	experience_plus,
	ball_id,
	battles,
	battles_won) VALUES 
('bulbasaur', 1, 1, 0, 1, 0, 0),
('pichu', 1, 1, 0, 1, 0, 0),
('charmander', 1, 1, 0, 1, 0, 0),
('squertle', 1, 1, 0, 1, 0, 0);

INSERT INTO users_pokemons(user_id, pokemon_id) VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8);