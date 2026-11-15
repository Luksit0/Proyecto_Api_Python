const express = require('express');
const cors = require('cors');
const videosRouter = require('./routes/videos');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones de otros puertos (ej. Next.js)
app.use(express.json()); // Permite a Node leer el JSON del frontend

// Rutas
app.use('/api/videos', videosRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gateway Node.js corriendo en http://localhost:${PORT}`);
});