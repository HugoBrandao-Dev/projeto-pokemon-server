# 1 = 100% | 0.5 = 50%
CREATE TABLE drop_items_rate (
	item_id INT UNSIGNED NOT NULL,
	rate FLOAT NOT NULL,
	amount INT NOT NULL DEFAULT 1,
	CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES items(id)
);

# Define os rates de drops para as FRUTAS [CUIDAR COM OS IDs].
INSERT INTO drop_items_rate VALUES
(5, 0.75, 5),
(6, 0.25, 3),
(7, 0.1, 2);

# Define os rates de drops para as MOEDAS [CUIDAR COM OS IDs].
INSERT INTO drop_items_rate VALUES
(8, 0.75, 10),
(9, 0.1, 5),
(10, 0.05, 1);

SELECT * FROM drop_items_rate;
DESCRIBE drop_itesm_rate;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE drop_items_rate;

DROP TABLE drop_items_rate;