USE pokemon_project;

CREATE TABLE shopping_items (
	item_id INT UNSIGNED NOT NULL,
	item_price_id INT UNSIGNED NOT NULL,
	amount INT UNSIGNED NOT NULL,
	CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES items(id),
	CONSTRAINT fk_item_price_id FOREIGN KEY (item_price_id) REFERENCES items(id)
);

INSERT INTO shopping_items VALUES 
(1, 8, 20),
(2, 8, 50),
(3, 9, 10),
(4, 10, 2),
(5, 8, 5),
(6, 9, 1),
(7, 10, 1);

SELECT * FROM shopping_items;

SELECT items.item, price.item AS "required", shopping_items.amount FROM shopping_items
INNER JOIN items ON items.id = shopping_items.item_id
INNER JOIN items AS price ON price.id = shopping_items.item_price_id;

DESCRIBE shopping_items;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE shopping_items;

DROP TABLE shopping_items;