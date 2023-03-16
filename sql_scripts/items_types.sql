CREATE TABLE items_types (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	type_name VARCHAR(50) NOT NULL,
	PRIMARY KEY (id)
);

SELECT * FROM items_types;
DESCRIBE items_types;
DROP TABLE items_types;