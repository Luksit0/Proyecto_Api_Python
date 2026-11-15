const evaluarVideo = async (datosVideo) => {
  try {
    const respuesta = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosVideo)
    });
    
    if (!respuesta.ok) {
      const errorDePython = await respuesta.json();
      console.error("FastAPI rechazó los datos. Detalle:", JSON.stringify(errorDePython, null, 2));
      throw new Error(`Error en el servicio Python: ${respuesta.status}`);
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error de conexión con FastAPI:", error);
    throw error;
  }
};

module.exports = { evaluarVideo };