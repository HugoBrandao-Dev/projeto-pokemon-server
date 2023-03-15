CREATE TABLE items (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	# O ID do item (item_id) deve ser proveniente da PokeAPI.
	item_id INT UNSIGNED NOT NULL,
	consumable BOOLEAN NOT NULL DEFAULT 0,
	cumulative BOOLEAN NOT NULL DEFAULT 0,
	quest_item BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY (id)
);

DESCRIBE items;
DROP TABLE items;