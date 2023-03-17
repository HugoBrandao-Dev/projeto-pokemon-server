CREATE TABLE users_items (
	user_id INT UNSIGNED NOT NULL,
	item_id INT UNSIGNED NOT NULL,
	amount SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT fk_items_id FOREIGN KEY (item_id) REFERENCES items(id)
);

SELECT * FROM users_items;
DESCRIBE users_items;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE users_items;

DROP TABLE users_items;