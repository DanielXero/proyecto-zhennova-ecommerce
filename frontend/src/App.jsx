

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import { ProductList } from './components/ProductList'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/productos" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

