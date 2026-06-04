// frontend/src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para procesar el pedido en el backend
export const procesarCheckout = createAsyncThunk(
  'cart/procesarCheckout',
  async (id_forma_pago, { getState, rejectWithValue }) => {
    try {
      // Obtenemos el token del usuario logueado desde el usersSlice
      const { token } = getState().users;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Hacemos el POST al endpoint protegido
      const response = await axios.post(
        'http://localhost:3000/api/pedidos/checkout',
        { id_forma_pago },
        config
      );

      return response.data; // { mensaje: "...", id_pedido: X }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al procesar el pedido');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    loading: false,
    error: null,
    ultimoPedido: null
  },
  reducers: {
    limpiarEstadoPedido: (state) => {
      state.loading = false;
      state.error = null;
      state.ultimoPedido = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(procesarCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(procesarCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.ultimoPedido = action.payload.id_pedido;
      })
      .addCase(procesarCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { limpiarEstadoPedido } = cartSlice.actions;
export default cartSlice.reducer;