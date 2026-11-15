const evaluarVideo = async(datosVideo) => {
    try{
        const respuesta = await fetch('http://127.0.0.1:8000/predict',{
            method: 'POST',
            haders: {'Content-type': 'application/json'},
            body: JSON.stringify(datosVideo)
        });

        if(!respuesta.ok){
        throw new Error(`Error en el servicio de Python: ${respuesta.status}`);       
     }
        return await respuesta.json();
    } catch (error) {
        console.error("Error de conexión con FastAPI",error);
        throw error;
    }
};

module.exports = {evaluarVideo}