import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarrito, actualizarCantidad, eliminarDelCarrito, procesarCheckout, limpiarEstadoPedido } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const [formaPago, setFormaPago] = useState(1);

  useEffect(() => {
    dispatch(fetchCarrito());
  }, [dispatch]);

  const handleConfirmarCompra = () => {
    dispatch(procesarCheckout(formaPago)).unwrap().then((res) => {
        alert(`¡Éxito! Pedido N° ${res.id_pedido}`);
        dispatch(limpiarEstadoPedido());
        navigate('/'); 
    }).catch(err => alert(err));
  };

  // SOLUCIÓN 1: Clonamos y ordenamos el carrito por ID para que no "salten" de posición
  const itemsOrdenados = [...items].sort((a, b) => a.id_producto - b.id_producto);

  // Calculamos el subtotal de la compra para mostrarlo abajo
  const totalCarrito = items.reduce((acc, item) => acc + (item.cantidad * item.Producto?.precio), 0);

  return (
    <div className="container mt-5 mb-5">
      <h2>Tu Carrito</h2>
      <div className="row mt-4">
        <div className="col-md-8">
          {itemsOrdenados.length === 0 ? (
            <div className="alert alert-info">Tu carrito está vacío.</div>
          ) : (
            <div className="card shadow-sm">
              <ul className="list-group list-group-flush">
                {/* SOLUCIÓN 1.1: Usamos el array ordenado en el map */}
                {itemsOrdenados.map((item) => (
                  <li key={item.id_producto} className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center">
                      <img src={`http://localhost:3000${item.Producto?.imagen_url}`} alt="prod" style={{width: '60px', height: '60px', objectFit:'cover'}} className="me-3 rounded"/>
                      <div>
                        <h6 className="mb-0">{item.Producto?.nombre}</h6>
                        <small className="text-muted">${Number(item.Producto?.precio).toLocaleString()}</small>
                        <br/>
                        {/* Agregamos una pista visual del stock para el usuario */}
                        <small className="text-info">Stock disponible: {item.Producto?.stock}</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm" 
                        onClick={() => dispatch(actualizarCantidad({ id_producto: item.id_producto, cantidad: item.cantidad - 1 }))} 
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      
                      <span className="fw-bold mx-3">{item.cantidad}</span>
                      
                      <button 
                        className="btn btn-outline-secondary btn-sm" 
                        onClick={() => dispatch(actualizarCantidad({ id_producto: item.id_producto, cantidad: item.cantidad + 1 }))}
                        // SOLUCIÓN 2: Deshabilitamos el botón + si la cantidad llega al máximo del stock
                        disabled={item.cantidad >= item.Producto?.stock}
                      >
                        +
                      </button>
                      
                      <button 
                        className="btn btn-danger btn-sm ms-4" 
                        onClick={() => dispatch(eliminarDelCarrito(item.id_producto))}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="col-md-4">
            <div className="card shadow-sm p-4">
                <h4>Resumen de Pago</h4>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal:</span>
                  <span className="fw-bold">${totalCarrito.toLocaleString()}</span>
                </div>

                <label className="form-label fw-bold mt-2">Método de pago:</label>
                <select className="form-select mb-4" value={formaPago} onChange={(e) => setFormaPago(Number(e.target.value))}>
                  <option value={1}>Efectivo (10% descuento)</option>
                  <option value={2}>Tarjeta (15% recargo)</option>
                  <option value={3}>Transferencia (Precio lista)</option>
                </select>

                {error && <div className="alert alert-danger">{error}</div>}

                <button 
                  className="btn btn-primary w-100" 
                  onClick={handleConfirmarCompra} 
                  disabled={loading || items.length === 0}
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