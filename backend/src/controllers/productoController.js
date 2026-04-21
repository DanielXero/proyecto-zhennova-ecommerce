const { Producto, Categoria } = require('../models/associations');


const listarProductos = async (req, res) => {
    try {
        // Obtener todos los productos 
        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria,
                    attributes: ['nombre']  // solo traemos el nombre de la categoría
                }
            ],
            attributes: ['id_producto', 'nombre', 'descripcion', 'precio', 'stock'],
            order: [['nombre', 'ASC']]
        });

        
        if (!productos || productos.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay productos disponibles en el catálogo',
                data: []
            });
        }

        
        res.status(200).json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor. No se pudo obtener el catálogo.'
        });
    }
};

module.exports = { listarProductos };