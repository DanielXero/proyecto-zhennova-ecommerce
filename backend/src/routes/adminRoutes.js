const express = require('express');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');
const { obtenerClientes, desactivarCliente, activarCliente } = require('../controllers/adminController');

const router = express.Router();




router.get('/clientes', verificarToken, verificarAdmin, obtenerClientes);
router.put('/clientes/:id/desactivar', verificarToken, verificarAdmin, desactivarCliente);
router.put('/clientes/:id/activar', verificarToken, verificarAdmin, activarCliente);

module.exports = router;