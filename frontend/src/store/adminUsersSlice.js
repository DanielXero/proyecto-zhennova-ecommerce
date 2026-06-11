import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';
const getToken = () => localStorage.getItem('token');

export const fetchClientes = createAsyncThunk('admin/fetchClientes', async () => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } };
  const response = await axios.get(`${API_URL}/clientes`, config);
  return response.data.data;
});

export const desactivarCliente = createAsyncThunk('admin/desactivarCliente', async (id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } };
  await axios.put(`${API_URL}/clientes/${id}/desactivar`, {}, config);
  return id;
});

export const activarCliente = createAsyncThunk('admin/activarCliente', async (id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } };
  await axios.put(`${API_URL}/clientes/${id}/activar`, {}, config);
  return id;
});

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState: { clientes: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(desactivarCliente.fulfilled, (state, action) => {
        const index = state.clientes.findIndex(c => c.id_usuario === action.payload);
        if (index !== -1) state.clientes[index].deletedAt = new Date().toISOString();
      })
      .addCase(activarCliente.fulfilled, (state, action) => {
        const index = state.clientes.findIndex(c => c.id_usuario === action.payload);
        if (index !== -1) state.clientes[index].deletedAt = null;
      });
  },
});

export default adminUsersSlice.reducer;