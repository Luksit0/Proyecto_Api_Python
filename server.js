import express from "express";
import cors from "cors";
import axios from "axios";

const app = express()
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors())//Permite realizar peticiones de otros origenes.
app.use(express.json())// Permite leer JSON en el cuerpo de las peticiones
//Ruta de prueba de salud (HEALTH CHECK)
app.get('/api/health', (req,res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Servidor NODE.js funcionando de manera correcta'
    });
});

//ENDPOINT principa
app.post('/api/analyze', async (req, res) => {
    try{
        const {id_registro, valores, text_ref} = req.body;
        if(!id_registro || !valores || !text_ref){
            return res.status(400).json({
                error: 'Faltan datos. Se requiere id_registro, valores y texto de referencia'
            });
        }

        // Puente con python
        const respuestaPython = await axios.post('http://127.0.0.1:8000/predict',{
            id_registro,
            valores,
            text_ref
        });
        // TODO: Aqui se hace la petición HTTP hacia el microservicio de Python
        res.status(200).json({
            message: 'Análisis orquestado con éxito desde NODE.js',
            resultadosAnaliticos: respuestaPython.data
        });

    }catch (error){
        console.error('Error al concetar con python', error.message);
        res.status(500).json({error: 'Fallo en la comunicación con el motor análitico'});
    }
});

app.listen(PORT, () =>{
    console.log('Orquestador NODE.js corriendoo en http://localhost:${PORT}');
});