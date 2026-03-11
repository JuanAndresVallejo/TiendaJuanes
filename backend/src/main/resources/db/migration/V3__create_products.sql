CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(255),
  base_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL
);
