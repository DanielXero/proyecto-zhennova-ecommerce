const express = require('express');
const { listarProductos } = require('../controllers/productoController');

const router = express.Router();

router.get('/', listarProductos);

module.exports = router;