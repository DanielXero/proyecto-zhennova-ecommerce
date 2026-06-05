
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getConfig = (getState) => ({
  headers: { Authorization: `Bearer ${getState().users.token}` }
});

// Thunks para el carrito
export const fetchCarrito = createAsyncThunk('cart/fetchCarrito', async (_, { getState }) => {
  const response = await axios.get('http://localhost:3000/api/carrito', getConfig(getState));
  return response.data;
});

export const agregarAlCarrito = createAsyncThunk('cart/agregar', async (producto, { getState, dispatch, rejectWithValue }) => {
  try {
    const idProductoSeguro = producto.id_producto || producto.id;
    await axios.post('http://localhost:3000/api/carrito/agregar', { id_producto: idProductoSeguro, cantidad: 1 }, getConfig(getState));
    dispatch(fetchCarrito());
    return true; 
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error al agregar al carrito");
  }
});

export const actualizarCantidad = createAsyncThunk('cart/actualizar', async ({ id_producto, cantidad }, { getState, dispatch }) => {
  await axios.put(`http://localhost:3000/api/carrito/actualizar/${id_producto}`, { cantidad }, getConfig(getState));
  dispatch(fetchCarrito());
});

export const eliminarDelCarrito = createAsyncThunk('cart/eliminar', async (id_producto, { getState, dispatch }) => {
  await axios.delete(`http://localhost:3000/api/carrito/eliminar/${id_producto}`, getConfig(getState));
  dispatch(fetchCarrito());
});

// Thunk del checkout (el que ya teníamos)
export const procesarCheckout = createAsyncThunk('cart/procesarCheckout', async (id_forma_pago, { getState, rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3000/api/pedidos/checkout', { id_forma_pago }, getConfig(getState));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error al procesar pedido');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, ultimoPedido: null },
  reducers: {
    limpiarEstadoPedido: (state) => { state.ultimoPedido = null; state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(procesarCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.ultimoPedido = action.payload.id_pedido;
        state.items = []; // Vaciamos el carrito visualmente al comprar
      });
  }
});

export const { limpiarEstadoPedido } = cartSlice.actions;
export default cartSlice.reducer;