const { Usuario, Rol, Pedido } = require('../models/associations');

const obtenerClientes = async (req, res) => {
  try {
    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
    if (!rolCliente) {
      return res.status(500).json({ error: 'Rol cliente no encontrado' });
    }

    const clientes = await Usuario.findAll({
      where: { id_rol: rolCliente.id_rol },
      attributes: ['id_usuario', 'nombre', 'apellido', 'email', 'nombre_usuario', 'fecha_eliminacion'],
      paranoid: false,
      order: [['id_usuario', 'ASC']],
    });
    res.json({ success: true, data: clientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const desactivarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.usuario.id_usuario;

    if (parseInt(id) === adminId) {
      return res.status(403).json({ error: 'No puedes desactivar tu propia cuenta' });
    }

    const usuario = await Usuario.findByPk(id, { paranoid: false });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
    if (usuario.id_rol !== rolCliente.id_rol) {
      return res.status(403).json({ error: 'Solo se pueden desactivar clientes' });
    }

    if (usuario.fecha_eliminacion !== null) {
      return res.status(400).json({ error: 'El usuario ya está desactivado' });
    }

    const pedidosCount = await Pedido.count({ where: { id_usuario: id } });
    if (pedidosCount > 0) {
      return res.status(400).json({ error: `No se puede desactivar el cliente porque tiene ${pedidosCount} pedido(s) registrado(s).` });
    }

    await usuario.destroy();
    res.json({ success: true, message: 'Cliente desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desactivar cliente' });
  }
};

const activarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, { paranoid: false });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
    if (usuario.id_rol !== rolCliente.id_rol) {
      return res.status(403).json({ error: 'Solo se pueden activar clientes' });
    }

    if (usuario.fecha_eliminacion === null) {
      return res.status(400).json({ error: 'El usuario ya está activo' });
    }

    await usuario.restore();
    res.json({ success: true, message: 'Cliente activado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al activar cliente' });
  }
};

module.exports = { obtenerClientes, desactivarCliente, activarCliente };