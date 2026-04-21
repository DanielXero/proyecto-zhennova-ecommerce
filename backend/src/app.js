const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(express.json());
app.use(cors());  

const productoRoutes = require('./routes/productoRoutes');


app.use('/api/productos', productoRoutes);


module.exports = app;