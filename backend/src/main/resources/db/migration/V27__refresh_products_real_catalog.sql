-- Refresh catalog seed with realistic apparel products and real images (Unsplash)
DO $$
DECLARE
  i INT := 0;
  p_id BIGINT;
  p_ref TEXT;
  name_options TEXT[] := ARRAY[
    'Camiseta Basica Algodon',
    'Camiseta Oversize Grafica',
    'Jeans Slim Fit Azul',
    'Jeans Mom Fit Indigo',
    'Tenis Urbanos Blanco',
    'Tenis Running Negro',
    'Sudadera Capota Unisex',
    'Chaqueta Denim Clasica',
    'Camisa Oxford Manga Larga',
    'Pantalon Cargo Street',
    'Vestido Casual Midi',
    'Falda Plisada Satin'
  ];
  description_options TEXT[] := ARRAY[
    'Prenda de uso diario con tela comoda y acabado premium.',
    'Diseno actual para outfits casuales y urbanos.',
    'Corte moderno con ajuste favorecedor y alta durabilidad.',
    'Material resistente, fresco y pensado para uso frecuente.',
    'Producto con estilo versatil para combinar en diferentes ocasiones.',
    'Referencia comercial con excelente relacion calidad-precio.'
  ];
  category_options TEXT[] := ARRAY['Hombre', 'Mujer', 'Calzado', 'Accesorios'];
  brand_options TEXT[] := ARRAY[
    'Levis', 'Nike', 'Adidas', 'Puma', 'Calvin Klein', 'Tommy Hilfiger', 'Guess', 'Vans', 'Reebok', 'New Balance'
  ];
  tag_options TEXT[] := ARRAY['nuevo, casual', 'oferta, destacado', 'limitado, tendencia', 'urbano, premium'];
  image_options TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80'
  ];
BEGIN
  FOR p_ref IN
    SELECT ref_code
    FROM products
    WHERE ref_code LIKE 'REF.%'
    ORDER BY ref_code
  LOOP
    i := i + 1;
    SELECT id INTO p_id FROM products WHERE ref_code = p_ref;

    UPDATE products
    SET
      name = name_options[((i - 1) % array_length(name_options, 1)) + 1] || ' ' || i,
      description = description_options[((i - 1) % array_length(description_options, 1)) + 1],
      category = category_options[((i - 1) % array_length(category_options, 1)) + 1],
      brand = brand_options[((i - 1) % array_length(brand_options, 1)) + 1],
      tags = tag_options[((i - 1) % array_length(tag_options, 1)) + 1],
      base_price = 59000 + (i * 1200),
      discount_percentage = CASE WHEN (i % 4) = 0 THEN 10 WHEN (i % 7) = 0 THEN 15 ELSE 0 END
    WHERE id = p_id;

    DELETE FROM product_images WHERE product_id = p_id;

    INSERT INTO product_images (product_id, image_url)
    VALUES
      (p_id, image_options[((i - 1) % array_length(image_options, 1)) + 1]),
      (p_id, image_options[((i) % array_length(image_options, 1)) + 1]),
      (p_id, image_options[((i + 1) % array_length(image_options, 1)) + 1]);
  END LOOP;
END $$;
