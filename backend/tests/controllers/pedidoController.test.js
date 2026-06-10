// Mockear el módulo de configuración de base de datos primero
jest.mock('../../src/config/database', () => ({
  sequelize: {
    transaction: jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn()
    }),
    define: jest.fn(),
    sync: jest.fn(),
    authenticate: jest.fn()
  },
  connectDB: jest.fn()
}));

// Mockear los modelos asociados (para que no se carguen realmente)
jest.mock('../../src/models/associations', () => ({
  UsuarioProducto: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Producto: {
    findByPk: jest.fn(),
    update: jest.fn()
  },
  Pedido: {
    create: jest.fn()
  },
  DetallePedido: {
    create: jest.fn()
  },
  FormaPago: {
    findOne: jest.fn()
  }
}));

// Ahora importamos el controlador (ya no intentará cargar la BD real)
const { realizarPedido } = require('../../src/controllers/pedidoController');
const { UsuarioProducto, Producto, Pedido, DetallePedido } = require('../../src/models/associations');
const { sequelize } = require('../../src/config/database');

describe('Pedido Controller - realizarPedido (checkout)', () => {
  let req, res;
  let mockTransaction;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    };
    sequelize.transaction.mockResolvedValue(mockTransaction);

    req = {
      usuario: { id_usuario: 1 },
      body: { id_forma_pago: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('debe crear pedido exitosamente con stock suficiente', async () => {
    const mockCarrito = [
      {
        cantidad: 2,
        Producto: { id_producto: 1, nombre: 'Prod1', precio: 100, stock: 5 }
      }
    ];
    UsuarioProducto.findAll.mockResolvedValue(mockCarrito);
    Pedido.create.mockResolvedValue({ id_pedido: 'abc-123' });
    DetallePedido.create.mockResolvedValue({});
    Producto.update.mockResolvedValue([1]);
    UsuarioProducto.destroy.mockResolvedValue(1);

    await realizarPedido(req, res);

    expect(UsuarioProducto.findAll).toHaveBeenCalled();
    expect(Pedido.create).toHaveBeenCalledWith(
      expect.objectContaining({ total: expect.any(Number), estado: 'pendiente' }),
      { transaction: mockTransaction }
    );
    expect(DetallePedido.create).toHaveBeenCalledTimes(1);
    expect(Producto.update).toHaveBeenCalledTimes(1);
    expect(UsuarioProducto.destroy).toHaveBeenCalled();
    expect(mockTransaction.commit).toHaveBeenCalled();
    expect(mockTransaction.rollback).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id_pedido: 'abc-123' }));
  });

  test('debe fallar y hacer rollback si el stock es insuficiente', async () => {
    const mockCarrito = [
      {
        cantidad: 10,
        Producto: { id_producto: 1, nombre: 'Prod1', precio: 100, stock: 5 }
      }
    ];
    UsuarioProducto.findAll.mockResolvedValue(mockCarrito);

    await realizarPedido(req, res);

    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(Pedido.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('Stock insuficiente') });
  });

  test('debe fallar si el carrito está vacío', async () => {
    UsuarioProducto.findAll.mockResolvedValue([]);

    await realizarPedido(req, res);

    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El carrito está vacío' });
  });

  test('debe aplicar estrategia de pago según id_forma_pago', async () => {
    req.body.id_forma_pago = 2; // Tarjeta
    const mockCarrito = [
      { cantidad: 1, Producto: { id_producto: 1, nombre: 'Prod1', precio: 1000, stock: 10 } }
    ];
    UsuarioProducto.findAll.mockResolvedValue(mockCarrito);
    Pedido.create.mockResolvedValue({ id_pedido: 'xyz' });
    DetallePedido.create.mockResolvedValue({});
    Producto.update.mockResolvedValue([1]);
    UsuarioProducto.destroy.mockResolvedValue(1);

    await realizarPedido(req, res);

    // Verificar que se llamó a create con total = 1150 (1000*1.15)
    expect(Pedido.create).toHaveBeenCalledWith(
      expect.objectContaining({ total: 1150 }),
      expect.any(Object)
    );
  });
});