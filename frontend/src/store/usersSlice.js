import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_AUTH = "http://localhost:3000/api/auth";

export const loginUser = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH}/login`, userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.detalles) {
        return rejectWithValue({
          message: errorData.error,
          detalles: errorData.detalles,
        });
      }
      return rejectWithValue({
        message: errorData?.error || "Error al iniciar sesión",
      });
    }
  },
);

export const registerUser = createAsyncThunk(
  "users/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH}/register`, userData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData && errorData.detalles) {
        return rejectWithValue({
          message: errorData.error,
          detalles: errorData.detalles,
        });
      }
      return rejectWithValue({
        message: errorData?.error || "Error al registrarse",
      });
    }
  },
);

export const fetchPerfil = createAsyncThunk(
  "users/fetchPerfil",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        "http://localhost:3000/api/auth/perfil",
        config,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al cargar perfil",
      );
    }
  },
);

export const updatePerfil = createAsyncThunk(
  "users/updatePerfil",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        "http://localhost:3000/api/auth/perfil",
        userData,
        config,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al actualizar perfil",
      );
    }
  },
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuth: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  errorDetails: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      localStorage.clear();
    },
    clearError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = "loading";
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error al iniciar sesión";
        state.errorDetails = action.payload?.detalles || null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = "loading";
        state.error = null;
        state.errorDetails = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error al registrarse";
        state.errorDetails = action.payload?.detalles || null;
      })
      .addCase(fetchPerfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerfil.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchPerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePerfil.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePerfil.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = usersSlice.actions;
export default usersSlice.reducer;
