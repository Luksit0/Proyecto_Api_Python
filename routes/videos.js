const express = require('express');
const router = express.Router();
const {evaluarVideo} = require('../services/pythonApi');

// Ruta final
router.post('/analizar', async (requestAnimationFrame, res) =>{
    try {
        const metadatos = req.body;
        //Consulta
        const prediccion = await evaluarVideo(metadatos);
        res.json({
            mensaje: "Análisis completado con éxito",
            resultado: prediccion
        });
    }catch(error)
    {
        res.status(500).json({ error: "Fallo al comunicar con el motor de IA"});
    }
});
module.exports = router;