import React from 'react';
import { NavBar } from './NavBar';


export const Header = () => {
  return (
    <header>
      
      <NavBar />

    </header>
  );
};



Crear archivo
frontend/src/components/Footer.jsx
commits sugerido " agregar componente Footer"

import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-primary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-cyan fw-bold mb-3">ZhenNova</h5>
            <p className="text-light">
              Tu tienda de confianza para componentes de PC y periféricos.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white hover-cyan"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-white hover-cyan"><i className="bi bi-twitter fs-5"></i></a>
              <a href="#" className="text-white hover-cyan"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-white hover-cyan"><i className="bi bi-whatsapp fs-5"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-cyan">Enlaces</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none hover-cyan">Inicio</a></li>
              <li><a href="/productos" className="text-light text-decoration-none hover-cyan">Productos</a></li>
              <li><a href="/login" className="text-light text-decoration-none hover-cyan">Ingresar</a></li>
              <li><a href="/register" className="text-light text-decoration-none hover-cyan">Registrarse</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-cyan">Enlaces</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none hover-cyan">Inicio</a></li>
              <li><a href="/productos" className="text-light text-decoration-none hover-cyan">Productos</a></li>
              <li><a href="/login" className="text-light text-decoration-none hover-cyan">Ingresar</a></li>
              <li><a href="/register" className="text-light text-decoration-none hover-cyan">Registrarse</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-cyan">Contacto</h6>
            <ul className="list-unstyled text-light">
              <li><i className="bi bi-geo-alt me-2"></i> Av. Tecnología 123</li>
              <li><i className="bi bi-telephone me-2"></i> +1 234 567 890</li>
              <li><i className="bi bi-envelope me-2"></i> info@zhennova.com</li>
            </ul>
          </div>
        </div>
        <hr className="my-4 border-secondary" />
        <p className="text-center text-light mb-0">&copy; 2025 ZhenNova - Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

Crear archivo
frontend/src/components/ProductItem.jsx
commits sugerido "agregar componente ProductItem para mostrar cada producto"

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


Crear archivo
frontend/src/components/ProductList.jsx
commits sugerido "agregar componente ProductList con lógica de carga y Redux"


import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/productsSlice'
import { ProductItem } from './ProductItem'

export const ProductList = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, loading])

  const renderContent = () => {
    if (loading === 'loading') {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-cyan" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-secondary">Cargando productos...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="alert alert-danger text-center mt-4">
          <i className="bi bi-x-octagon-fill me-2"></i> Error: {error}
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="alert alert-info text-center mt-4">
          <i className="bi bi-info-circle-fill me-2"></i> No hay productos disponibles.
        </div>
      )
    }

    return (
      <div className="row">
        {products.map((product) => (
          <ProductItem key={product.id_producto} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-white mb-4 fw-bold">
        Nuestro Catálogo <span className="text-cyan">de Componentes</span>
      </h2>
      <p className="text-center text-secondary mb-5 lead">
        Encuentra lo último en hardware y periféricos.
      </p>
      {renderContent()}
    </div>
  )
}