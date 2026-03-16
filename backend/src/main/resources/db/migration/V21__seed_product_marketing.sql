UPDATE products
SET featured = true
WHERE ref_code IN ('REF.001','REF.002','REF.003','REF.004','REF.005','REF.006');

UPDATE products
SET discount_percentage = 15
WHERE ref_code IN ('REF.007','REF.008','REF.009');

UPDATE products
SET tags = 'nuevo'
WHERE ref_code IN ('REF.010','REF.011','REF.012');

UPDATE products
SET tags = 'limitado'
WHERE ref_code IN ('REF.013','REF.014');
