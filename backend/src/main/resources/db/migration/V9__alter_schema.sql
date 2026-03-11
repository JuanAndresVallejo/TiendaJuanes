-- Users table adjustments
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(120);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(120);
ALTER TABLE users ADD COLUMN IF NOT EXISTS document_id VARCHAR(50);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'name'
  ) THEN
    EXECUTE "UPDATE users SET first_name = COALESCE(first_name, split_part(name, ' ', 1)) WHERE first_name IS NULL";
    EXECUTE "UPDATE users SET last_name = COALESCE(last_name, NULLIF(split_part(name, ' ', 2), '')) WHERE last_name IS NULL";
  END IF;
END $$;

UPDATE users SET document_id = COALESCE(document_id, '000000') WHERE document_id IS NULL;

ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN document_id SET NOT NULL;

-- Products ref code
ALTER TABLE products ADD COLUMN IF NOT EXISTS ref_code VARCHAR(50);
UPDATE products SET ref_code = COALESCE(ref_code, 'REF.' || LPAD(id::text, 3, '0')) WHERE ref_code IS NULL;
ALTER TABLE products ALTER COLUMN ref_code SET NOT NULL;

-- Addresses table (if not exists)
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  address_line TEXT NOT NULL,
  is_default BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL
);
