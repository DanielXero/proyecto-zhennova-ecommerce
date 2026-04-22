import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Estas rutas aún no existen en tu backend, pero las dejamos preparadas
const API_AUTH = 'http://localhost:3000/api/auth'

export const loginUser = createAsyncThunk(
  'users/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH}/login`, userData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al iniciar sesión')
    }
  }
)

export const registerUser = createAsyncThunk(
  'users/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH}/register`, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al registrarse')
    }
  }
)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuth: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuth = false
      localStorage.clear()
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuth = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = usersSlice.actions
export default usersSlice.reducer