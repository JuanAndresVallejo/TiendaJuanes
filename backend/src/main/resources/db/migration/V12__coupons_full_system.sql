ALTER TABLE coupons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value NUMERIC(12,2);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS minimum_order_amount NUMERIC(12,2) DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usage_limit INTEGER DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS used_count INTEGER DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS valid_from TIMESTAMP;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

UPDATE coupons SET description = COALESCE(description, code);
UPDATE coupons SET discount_type = COALESCE(discount_type, 'PERCENTAGE');
UPDATE coupons SET discount_value = COALESCE(discount_value, discount);
UPDATE coupons SET valid_from = COALESCE(valid_from, NOW());
UPDATE coupons SET valid_until = COALESCE(valid_until, NOW() + interval '30 days');

ALTER TABLE coupons ALTER COLUMN description SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN discount_type SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN discount_value SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN minimum_order_amount SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN usage_limit SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN used_count SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN valid_from SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN valid_until SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN active SET NOT NULL;
ALTER TABLE coupons ALTER COLUMN created_at SET NOT NULL;
