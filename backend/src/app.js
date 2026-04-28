const express = require('express');
const app = express();
const cors = require('cors');

const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(express.json());
app.use(cors());  




app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;