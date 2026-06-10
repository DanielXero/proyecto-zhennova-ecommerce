// Mockear el módulo de configuración de base de datos primero
jest.mock('../../src/config/database', () => ({
  sequelize: {
    transaction: jest.fn(),
    define: jest.fn(),
    sync: jest.fn(),
    authenticate: jest.fn()
  },
  connectDB: jest.fn()
}));

// Mockear los modelos asociados
jest.mock('../../src/models/associations', () => ({
  UsuarioProducto: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Producto: {
    findByPk: jest.fn()
  }
}));

// Importar los controladores y modelos mockeados
const { agregarAlCarrito, actualizarCantidad, eliminarDelCarrito } = require('../../src/controllers/carritoController');
const { UsuarioProducto, Producto } = require('../../src/models/associations');

describe('Carrito Controller - Pruebas unitarias', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar objetos request y response simulados
    req = {
      usuario: { id_usuario: 1 },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // --------------------------------------------------------------
  // Pruebas para agregarAlCarrito
  // --------------------------------------------------------------
  describe('agregarAlCarrito', () => {
    test('debe agregar un nuevo producto al carrito (no existía previamente)', async () => {
      req.body = { id_producto: 10, cantidad: 2 };
      
      // Simular que el producto NO está en el carrito
      UsuarioProducto.findOne.mockResolvedValue(null);
      UsuarioProducto.create.mockResolvedValue({});

      await agregarAlCarrito(req, res);

      expect(UsuarioProducto.findOne).toHaveBeenCalledWith({
        where: { id_usuario: 1, id_producto: 10 }
      });
      expect(UsuarioProducto.create).toHaveBeenCalledWith({
        id_usuario: 1,
        id_producto: 10,
        cantidad: 2
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto agregado al carrito' });
    });

    test('debe incrementar la cantidad si el producto ya existe en el carrito', async () => {
      req.body = { id_producto: 10, cantidad: 3 };
      const itemExistente = {
        id_usuario: 1,
        id_producto: 10,
        cantidad: 1,
        save: jest.fn().mockResolvedValue(true)
      };
      UsuarioProducto.findOne.mockResolvedValue(itemExistente);

      await agregarAlCarrito(req, res);

      expect(itemExistente.cantidad).toBe(4); // 1 + 3
      expect(itemExistente.save).toHaveBeenCalled();
      expect(UsuarioProducto.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('debe usar cantidad = 1 si no se envía cantidad en la petición', async () => {
      req.body = { id_producto: 10 }; // sin cantidad
      UsuarioProducto.findOne.mockResolvedValue(null);
      UsuarioProducto.create.mockResolvedValue({});

      await agregarAlCarrito(req, res);

      expect(UsuarioProducto.create).toHaveBeenCalledWith({
        id_usuario: 1,
        id_producto: 10,
        cantidad: 1
      });
    });

    test('debe manejar error interno del servidor', async () => {
      req.body = { id_producto: 10, cantidad: 1 };
      UsuarioProducto.findOne.mockRejectedValue(new Error('Error de BD'));

      await agregarAlCarrito(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al agregar al carrito' });
    });
  });

  // --------------------------------------------------------------
  // Pruebas para actualizarCantidad
  // --------------------------------------------------------------
  describe('actualizarCantidad', () => {
    beforeEach(() => {
      req.params = { id_producto: '10' };
      req.body = { cantidad: 5 };
    });

    test('debe actualizar cantidad cuando es válida y hay stock suficiente', async () => {
      const productoMock = { stock: 10 };
      Producto.findByPk.mockResolvedValue(productoMock);
      UsuarioProducto.update.mockResolvedValue([1]);

      await actualizarCantidad(req, res);

      expect(Producto.findByPk).toHaveBeenCalledWith("10");
      expect(UsuarioProducto.update).toHaveBeenCalledWith(
        { cantidad: 5 },
        { where: { id_usuario: 1, id_producto: "10" } }
      );
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Cantidad actualizada' });
    });

    test('debe rechazar si la cantidad supera el stock', async () => {
      const productoMock = { stock: 3 };
      Producto.findByPk.mockResolvedValue(productoMock);

      await actualizarCantidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('Stock insuficiente') });
      expect(UsuarioProducto.update).not.toHaveBeenCalled();
    });

    test('debe rechazar si cantidad es <= 0', async () => {
      req.body.cantidad = 0;
      await actualizarCantidad(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'La cantidad debe ser mayor a 0' });
    });

    test('debe devolver 404 si el producto no existe', async () => {
      Producto.findByPk.mockResolvedValue(null);

      await actualizarCantidad(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });

    test('debe manejar error interno del servidor', async () => {
      Producto.findByPk.mockRejectedValue(new Error('Error BD'));

      await actualizarCantidad(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar cantidad' });
    });
  });

  // --------------------------------------------------------------
  // Pruebas para eliminarDelCarrito
  // --------------------------------------------------------------
  describe('eliminarDelCarrito', () => {
    test('debe eliminar el producto del carrito correctamente', async () => {
      req.params = { id_producto: '10' };
      UsuarioProducto.destroy.mockResolvedValue(1); // 1 fila eliminada

      await eliminarDelCarrito(req, res);

      expect(UsuarioProducto.destroy).toHaveBeenCalledWith({
        where: { id_usuario: 1, id_producto: "10" }
      });
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto eliminado del carrito' });
    });

    test('debe manejar error interno del servidor', async () => {
      req.params = { id_producto: '10' };
      UsuarioProducto.destroy.mockRejectedValue(new Error('Error BD'));

      await eliminarDelCarrito(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar del carrito' });
    });
  });
});