-- Ensure exactly 50 products with variants and images (idempotent)
DO $$
DECLARE
  i INT;
  colors TEXT[] := ARRAY['Negro', 'Blanco', 'Azul'];
  sizes TEXT[] := ARRAY['S', 'M', 'L', 'XL'];
  product_names TEXT[] := ARRAY[
    'Camisa Oxford', 'Chaqueta Denim', 'Vestido Midi', 'Pantalon Cargo', 'Buzo Oversize',
    'Jeans Rectos', 'Falda Plisada', 'Tenis Urbanos', 'Gorra Clasica', 'Bolso Bandolera'
  ];
  product_categories TEXT[] := ARRAY['Hombre', 'Mujer', 'Calzado', 'Accesorios'];
  product_brands TEXT[] := ARRAY[
    'Levis', 'Nike', 'Adidas', 'Puma', 'Calvin Klein', 'Tommy Hilfiger', 'Guess', 'Vans'
  ];
  product_descriptions TEXT[] := ARRAY[
    'Prenda americana seleccionada, ideal para looks urbanos.',
    'Diseno versatil con acabados premium y excelente ajuste.',
    'Basico infaltable para outfit casual con estilo.',
    'Material resistente y comodo para uso diario.',
    'Pieza importada con detalles modernos y durabilidad.'
  ];
  v_color TEXT;
  v_size TEXT;
  p_id BIGINT;
  img_count INT;
  name_value TEXT;
  category_value TEXT;
  brand_value TEXT;
  description_value TEXT;
  price_value INT;
BEGIN
  FOR i IN 1..50 LOOP
    name_value := product_names[((i - 1) % array_length(product_names, 1)) + 1] || ' ' || i;
    category_value := product_categories[((i - 1) % array_length(product_categories, 1)) + 1];
    brand_value := product_brands[((i - 1) % array_length(product_brands, 1)) + 1];
    description_value := product_descriptions[((i - 1) % array_length(product_descriptions, 1)) + 1];
    price_value := 69000 + (i * 800);

    IF NOT EXISTS (SELECT 1 FROM products WHERE ref_code = 'REF.' || LPAD(i::text, 3, '0')) THEN
      INSERT INTO products (ref_code, name, description, brand, category, base_price, created_at)
      VALUES (
        'REF.' || LPAD(i::text, 3, '0'),
        name_value,
        description_value,
        brand_value,
        category_value,
        price_value,
        NOW()
      )
      RETURNING id INTO p_id;
    ELSE
      SELECT id INTO p_id FROM products WHERE ref_code = 'REF.' || LPAD(i::text, 3, '0');
    END IF;

    UPDATE products
    SET name = name_value,
        description = description_value,
        brand = brand_value,
        category = category_value,
        base_price = price_value
    WHERE id = p_id;

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
            price_value,
            10 + (random() * 40)::INT
          );
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
