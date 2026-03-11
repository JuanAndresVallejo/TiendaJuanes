CREATE TABLE coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  discount NUMERIC(12,2) NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  active BOOLEAN NOT NULL
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  mercado_pago_payment_id VARCHAR(120),
  status VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50),
  created_at TIMESTAMP NOT NULL
);
