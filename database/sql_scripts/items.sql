CREATE TABLE items (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	item VARCHAR(50) NOT NULL,
	type_id INT UNSIGNED NOT NULL,
	consumable BOOLEAN NOT NULL DEFAULT 0,
	cumulative BOOLEAN NOT NULL DEFAULT 0,
	quest_item BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY (id),
	CONSTRAINT fk_type_id FOREIGN KEY (type_id) REFERENCES items_types(id)
);

# Insere os registros das poke-bolas.
INSERT INTO items (item, type_id, consumable, cumulative) VALUES
("poke-ball", 1, 1, 1),
("great-ball", 1, 1, 1),
("ultra-ball", 1, 1, 1),
("master-ball", 1, 1, 1);

# Insere os registros das frutas.
INSERT INTO items (item, type_id, consumable, cumulative) VALUES
("jaboca-berry", 2, 1, 1),
("razz-berry", 2, 1, 1),
("bluk-berry", 2, 1, 1);

SELECT * FROM items;
DESCRIBE items;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE items;

DROP TABLE items;