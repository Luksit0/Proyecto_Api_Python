const express = require('express');
const videosRouter = require('./routes/videos');
const app = express();

//Middleware para NODE y JSON
app.use(express.json());
//Contexión de las rutas
app.use('/api/videos', videosRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Gateway Node.js corriendo en http://localhost:${PORT}');
});