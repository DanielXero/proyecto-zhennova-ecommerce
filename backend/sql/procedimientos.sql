
-- Función: obtener_stock
-- Propósito: Devuelve el stock de un producto dado su ID.
-- Si el producto no existe, lanza una excepción.

CREATE OR REPLACE FUNCTION obtener_stock(p_id_producto INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock INTEGER;
BEGIN
    SELECT stock INTO v_stock
    FROM productos
    WHERE id_producto = p_id_producto;
    
    IF v_stock IS NULL THEN
        RAISE EXCEPTION 'Producto con ID % no encontrado', p_id_producto;
    END IF;
    
    RETURN v_stock;
END;
$$;



-- Procedimiento: actualizar_stock
-- Propósito: Descuenta una cantidad del stock de un producto.
-- Si no hay suficiente stock, lanza una excepción y no modifica nada.

CREATE OR REPLACE PROCEDURE actualizar_stock(
    p_id_producto INTEGER,
    p_cantidad INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF (SELECT stock FROM productos WHERE id_producto = p_id_producto) >= p_cantidad THEN
        UPDATE productos
        SET stock = stock - p_cantidad
        WHERE id_producto = p_id_producto;
    ELSE
        RAISE EXCEPTION 'Stock insuficiente para el producto ID %', p_id_producto;
    END IF;
END;
$$;