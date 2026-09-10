CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150)   NOT NULL,
  description VARCHAR(255)   NULL,
  price       DECIMAL(10, 2) NOT NULL,
  stock       INT            NOT NULL DEFAULT 0,
  CONSTRAINT chk_products_price CHECK (price > 0),
  CONSTRAINT chk_products_stock CHECK (stock >= 0)
);
