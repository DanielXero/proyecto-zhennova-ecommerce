import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientes, desactivarCliente, activarCliente } from '../store/adminUsersSlice';
import { toast } from 'react-toastify';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaUserSlash, FaUserCheck } from 'react-icons/fa';

const AdminClientes = () => {
  const dispatch = useDispatch();
  const { clientes, loading, error } = useSelector(state => state.adminUsers);

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const handleToggleStatus = async (usuario) => {
    try {
      if (usuario.fecha_eliminacion) {
        // Cliente inactivo → activar
        await dispatch(activarCliente(usuario.id_usuario)).unwrap();
        toast.success(`Cliente ${usuario.nombre} activado correctamente`);
      } else {
        // Cliente activo → desactivar
        await dispatch(desactivarCliente(usuario.id_usuario)).unwrap();
        toast.success(`Cliente ${usuario.nombre} desactivado correctamente`);
      }
      // Refrescar lista para ver cambios
      dispatch(fetchClientes());
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error al cambiar estado del cliente';
      toast.error(mensaje);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-secondary">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="m-4">Error: {error}</Alert>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-white mb-4">👥 Gestión de Clientes</h2>
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id_usuario}>
                <td>{cliente.id_usuario}</td>
                <td>{cliente.nombre} {cliente.apellido || ''}</td>
                <td>{cliente.email}</td>
                <td>{cliente.nombre_usuario}</td>
                <td>
                  <span className={`badge ${cliente.fecha_eliminacion ? 'bg-secondary' : 'bg-success'}`}>
                    {cliente.fecha_eliminacion ? 'Inactivo' : 'Activo'}
                  </span>
                </td>
                <td>
                  <Button
                    variant={cliente.fecha_eliminacion ? 'success' : 'warning'}
                    size="sm"
                    onClick={() => handleToggleStatus(cliente)}
                    title={cliente.fecha_eliminacion ? 'Activar cliente' : 'Desactivar cliente'}
                  >
                    {cliente.fecha_eliminacion ? <FaUserCheck className="me-1" /> : <FaUserSlash className="me-1" />}
                    {cliente.fecha_eliminacion ? 'Activar' : 'Desactivar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClientes;