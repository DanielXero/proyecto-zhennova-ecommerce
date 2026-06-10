
-- SCRIPT DE CREACIÓN DE TABLAS - ZHENNOVA ECOMMERCE


-- 1. Tabla: roles
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE CHECK (nombre IN ('cliente', 'admin'))
);

-- 2. Tabla: usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    nro_telefono VARCHAR(20),
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    id_rol INTEGER NOT NULL DEFAULT 1 REFERENCES roles(id_rol) ON DELETE RESTRICT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

-- 3. Tabla: categorias
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 4. Tabla: productos
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    id_categoria INTEGER NOT NULL REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    imagen_url VARCHAR(255),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

-- 5. Tabla: formas_pago
CREATE TABLE formas_pago (
    id_forma_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- 6. Tabla: pedidos
CREATE TABLE pedidos (
    id_pedido UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    id_forma_pago INTEGER NOT NULL REFERENCES formas_pago(id_forma_pago),
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

-- 7. Tabla: detalles_pedido
CREATE TABLE detalles_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido UUID NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario > 0)
);

-- 8. Tabla: usuario_producto (carrito de compras)
CREATE TABLE usuario_producto (
    id_usuario_producto SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 1 AND cantidad <= 100),
    fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_producto)
);

-- 9. Tabla: provincias
CREATE TABLE provincias (
    id_provincia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- 10. Tabla: localidades
CREATE TABLE localidades (
    id_localidad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_provincia INTEGER NOT NULL REFERENCES provincias(id_provincia) ON DELETE RESTRICT
);

-- 11. Tabla: direcciones
CREATE TABLE direcciones (
    id_direccion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    calle VARCHAR(150) NOT NULL,
    nro_calle VARCHAR(20) NOT NULL,
    piso VARCHAR(10),
    cod_postal VARCHAR(20) NOT NULL,
    id_localidad INTEGER NOT NULL REFERENCES localidades(id_localidad) ON DELETE RESTRICT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE
);


-- DATOS INICIALES (mínimos necesarios)


-- Insertar roles (cliente y admin)
INSERT INTO roles (nombre) VALUES ('cliente'), ('admin')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar formas de pago
INSERT INTO formas_pago (nombre) VALUES ('Efectivo'), ('Tarjeta'), ('Transferencia')
ON CONFLICT (id_forma_pago) DO NOTHING;

--  Insertar algunas categorías de ejemplo
INSERT INTO categorias (nombre) VALUES 
    ('Procesadores'), 
    ('Placas de Video'), 
    ('Memorias RAM'), 
    ('Almacenamiento'), 
    ('Fuentes de Poder')
ON CONFLICT (nombre) DO NOTHING;