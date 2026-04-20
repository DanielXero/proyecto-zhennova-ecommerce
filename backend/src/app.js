const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Prueba para verificar que la API responde
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Zhennova API activa con Sequelize' 
    });
});



module.exports = app;