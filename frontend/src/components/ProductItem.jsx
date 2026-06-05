import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { agregarAlCarrito } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

export const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Obtenemos al usuario para saber si está logueado
  const { user } = useSelector((state) => state.users);

  // Función que se ejecuta al presionar el botón
  const handleAgregar = () => {
    if (!user) {
      alert("Debes iniciar sesión para comprar");
      navigate('/login');
      return;
    }
    dispatch(agregarAlCarrito(product))
      .unwrap()
      .then(() => {
        alert("¡Producto agregado al carrito con éxito! 🛒");
      })
      .catch((error) => {
        console.error("Error completo:", error);
        alert("Hubo un error al agregar el producto. Revisa la consola.");
      });
  };
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 bg-dark text-white border-secondary">
        <div className="card-body">
          <h5 className="card-title text-cyan">{product.nombre}</h5>
          <p className="card-text small text-secondary">{product.descripcion || 'Sin descripción'}</p>
          <p className="card-text fw-bold text-success">💰 ${Number(product.precio).toLocaleString()}</p>
          <p className="card-text small">📦 Stock: {product.stock}</p>
          <p className="card-text small">🏷️ {product.Categorium?.nombre || 'Sin categoría'}</p>
          
          {/* Se agrega el evento onClick aquí */}
          <button 
            className="btn btn-outline-primary w-100" 
            disabled={product.stock === 0}
            onClick={handleAgregar}
          >
            {product.stock > 0 ? '🛒 Agregar al carrito' : '❌ Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
};