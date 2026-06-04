import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { procesarCheckout, limpiarEstadoPedido } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.cart);
  
  // TODO: Esto luego lo traeremos del estado de Redux cuando conectemos el backend
  const [productosCarrito, setProductosCarrito] = useState([]); 
  const [formaPago, setFormaPago] = useState(1);

  const handleConfirmarCompra = () => {
    dispatch(procesarCheckout(formaPago))
      .unwrap()
      .then((resultado) => {
        alert(`¡Compra exitosa! Tu número de pedido es: ${resultado.id_pedido}`);
        dispatch(limpiarEstadoPedido());
        navigate('/'); 
      })
      .catch((err) => {
        alert(`Error: ${err}`);
      });
  };

  return (
    <div className="container mt-5 mb-5">
      <h2>Tu Carrito de Compras</h2>
      
      <div className="row mt-4">
        {/* Columna Izquierda: Lista de Productos */}
        <div className="col-md-8">
          {productosCarrito.length === 0 ? (
            <div className="alert alert-info">Tu carrito está vacío. ¡Agregá algunos productos!</div>
          ) : (
            <div className="card shadow-sm">
              <ul className="list-group list-group-flush">
                {productosCarrito.map((item) => (
                  <li key={item.id_producto} className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                      <img src={`http://localhost:3000${item.Producto.imagen_url}`} alt="producto" style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="me-3 rounded" />
                      <div>
                        <h6 className="mb-0">{item.Producto.nombre}</h6>
                        <small className="text-muted">${item.Producto.precio}</small>
                      </div>
                    </div>
                    
                    {/* Botones de Incrementar y Disminuir */}
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary btn-sm me-2">-</button>
                      <span className="fw-bold">{item.cantidad}</span>
                      <button className="btn btn-outline-secondary btn-sm ms-2">+</button>
                      <button className="btn btn-danger btn-sm ms-4">🗑️</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Columna Derecha: Checkout y Pago */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h4>Resumen de Pago</h4>
            <hr />
            <label className="form-label fw-bold mt-2">Método de pago:</label>
            <select 
              className="form-select mb-4" 
              value={formaPago} 
              onChange={(e) => setFormaPago(Number(e.target.value))}
            >
              <option value={1}>Efectivo (10% descuento)</option>
              <option value={2}>Tarjeta (15% recargo)</option>
              <option value={3}>Transferencia (Precio lista)</option>
            </select>

            {error && <div className="alert alert-danger">{error}</div>}

            <button 
              className="btn btn-primary btn-lg w-100" 
              onClick={handleConfirmarCompra}
              disabled={loading || productosCarrito.length === 0}
            >
              {loading ? 'Procesando...' : 'Confirmar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;