-- Ensure exactly 50 products with variants and images (idempotent)
DO $$
DECLARE
  i INT;
  colors TEXT[] := ARRAY['Negro', 'Blanco', 'Azul'];
  sizes TEXT[] := ARRAY['S', 'M', 'L', 'XL'];
  v_color TEXT;
  v_size TEXT;
  p_id BIGINT;
  img_count INT;
BEGIN
  FOR i IN 1..50 LOOP
    IF NOT EXISTS (SELECT 1 FROM products WHERE ref_code = 'REF.' || LPAD(i::text, 3, '0')) THEN
      INSERT INTO products (ref_code, name, description, brand, category, base_price, created_at)
      VALUES (
        'REF.' || LPAD(i::text, 3, '0'),
        'Producto ' || i,
        'Prenda importada de alta calidad, seleccionada para Tienda Juanes.',
        'Marca ' || i,
        CASE WHEN (i % 2) = 0 THEN 'Hombre' ELSE 'Mujer' END,
        79000 + (i * 500),
        NOW()
      )
      RETURNING id INTO p_id;
    ELSE
      SELECT id INTO p_id FROM products WHERE ref_code = 'REF.' || LPAD(i::text, 3, '0');
    END IF;

    -- Ensure 3 placeholder images
    SELECT COUNT(*) INTO img_count FROM product_images WHERE product_id = p_id;
    WHILE img_count < 3 LOOP
      INSERT INTO product_images (product_id, image_url)
      VALUES (p_id, 'https://picsum.photos/600/600?random=' || (i * 3 + img_count));
      img_count := img_count + 1;
    END LOOP;

    -- Ensure variants for each color/size
    FOREACH v_color IN ARRAY colors LOOP
      FOREACH v_size IN ARRAY sizes LOOP
        IF NOT EXISTS (
          SELECT 1 FROM product_variants
          WHERE product_id = p_id AND color = v_color AND size = v_size
        ) THEN
          INSERT INTO product_variants (product_id, color, size, sku, price, stock)
          VALUES (
            p_id,
            v_color,
            v_size,
            'SKU-' || p_id || '-' || v_color || '-' || v_size,
            79000 + (i * 500),
            10 + (random() * 40)::INT
          );
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
