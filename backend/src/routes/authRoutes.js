const express = require('express');
const { registerController, loginController, getPerfil, updatePerfil } = require('../controllers/authController');
const router = express.Router();
const { verificarToken} = require('../middlewares/authMiddleware');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/perfil', verificarToken, getPerfil);
router.put('/perfil', verificarToken, updatePerfil);

module.exports = router;