CREATE TABLE items_types (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	type_name VARCHAR(50) UNIQUE NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO items_types(type_name) VALUES
("ball"),
("fruit"),
("coin");

SELECT * FROM items_types;
DESCRIBE items_types;
DROP TABLE items_types;

# Comando para excluir todos os registros da tabela, sem a necessidade de excluir a tabela.
TRUNCATE TABLE items_types;