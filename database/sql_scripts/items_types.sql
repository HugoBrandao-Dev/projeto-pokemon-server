CREATE TABLE items_types (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	type_name VARCHAR(50) UNIQUE NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO items_types(type_name) VALUES
("ball"),
("fruit");

SELECT * FROM items_types;
DESCRIBE items_types;
DROP TABLE items_types;