import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setCurrentProduct,
  clearCurrentProduct,
  clearError,
} from '../store/adminProductsSlice';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { products, loading, error, errorDetails, currentProduct } = useSelector((state) => state.adminProducts);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        nombre: currentProduct.nombre,
        descripcion: currentProduct.descripcion || '',
        precio: currentProduct.precio,
        stock: currentProduct.stock,
        id_categoria: currentProduct.id_categoria,
      });
      setIsEditing(true);
      setShowModal(true);
    } else {
      setIsEditing(false);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: '',
      });
    }
  }, [currentProduct]);

  const handleOpenCreate = () => {
    dispatch(clearCurrentProduct());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearCurrentProduct());
    dispatch(clearError());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      id_categoria: parseInt(formData.id_categoria, 10),
    };
    if (isEditing) {
      await dispatch(updateProduct({ id: currentProduct.id_producto, productData: data }));
    } else {
      await dispatch(createProduct(data));
    }
    handleCloseModal();
    dispatch(fetchAdminProducts()); // refrescar lista
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      dispatch(deleteProduct(id)).then(() => {
        dispatch(fetchAdminProducts());
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Panel de Administración - Productos</h2>
        <Button variant="primary" onClick={handleOpenCreate}>
          <FaPlus className="me-2" /> Nuevo Producto
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
          <strong>{error}</strong>
          {errorDetails && errorDetails.length > 0 && (
            <ul className="mb-0 mt-2">
              {errorDetails.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          )}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-secondary">Cargando productos...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id_producto}>
                  <td>{prod.id_producto}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.descripcion?.substring(0, 50)}</td>
                  <td>${prod.precio}</td>
                  <td>{prod.stock}</td>
                  <td>{prod.Categorium?.nombre}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => dispatch(setCurrentProduct(prod))}>
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(prod.id_producto)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} className="bg-dark text-white">
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría (ID)</Form.Label>
              <Form.Control
                type="number"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
                className="bg-dark text-white border-secondary"
              />
              <Form.Text className="text-secondary">
                IDs: 1=Procesadores, 2=Placas de Video, 3=Memorias RAM
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;