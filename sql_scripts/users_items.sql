CREATE TABLE users_items (
	user_id INT UNSIGNED NOT NULL,
	item_id INT UNSIGNED NOT NULL,
	amount SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT fk_items_id FOREIGN KEY (item_id) REFERENCES items(id)
);

# Insere registros de pokebolas para o usuário.
-- Código criado SOMENTE PARA TESTE de rota do BACK-END.
INSERT INTO users_items (user_id, item_id, amount) VALUES
(1, 1, 20),
(1, 2, 10),
(1, 3, 5),
(1, 4, 2);

# Insere registros de frutas para o usuário.
-- Código criado SOMENTE PARA TESTE de rota do BACK-END.
INSERT INTO users_items (user_id, item_id, amount) VALUES
(1, 5, 10),
(1, 6, 7),
(1, 7, 3);

SELECT * FROM users_items;
DESCRIBE users_items;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE users_items;

DROP TABLE users_items;