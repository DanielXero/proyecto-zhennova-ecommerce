import React from 'react'

export const ProductItem = ({ product }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 bg-dark text-white border-secondary">
        <div className="card-body">
          <h5 className="card-title text-cyan">{product.nombre}</h5>
          <p className="card-text small text-secondary">{product.descripcion || 'Sin descripción'}</p>
          <p className="card-text fw-bold text-success">💰 ${Number(product.precio).toLocaleString()}</p>
          <p className="card-text small">📦 Stock: {product.stock}</p>
          <p className="card-text small">🏷️ {product.Categorium?.nombre || 'Sin categoría'}</p>
          <button className="btn btn-outline-primary w-100" disabled={product.stock === 0}>
            {product.stock > 0 ? '🛒 Agregar al carrito' : '❌ Sin stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
