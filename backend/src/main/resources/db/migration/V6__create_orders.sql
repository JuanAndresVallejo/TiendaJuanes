CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  total_amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id BIGINT NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(12,2) NOT NULL
);
