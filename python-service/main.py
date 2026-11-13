from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="Motor Analítico",
    description="Microservicio en Python para el procesamiento de datos",
    version="1.0.0"
)

#Definición de la estructura exacta de los datos que se esperan recibir desde NODE.js
class InputData(BaseModel):
    id_registro: str
    valores: list[float]
    text_ref: str

@app.get("/health")
def health_check():
    return {"status": "ok","service": "Python Analytics Engine"}

@app.post("/predict")
def procesar_model(data: InputData):
    # Cargar modelo predictivo

    # de momento una simulación el procesamiento de los datos
    promedio_valores = sum(data.valores) / len(data.valores) if data.valores else 0
    return {
        "id_procesado": data.id_registro,
        "modelo_utilizado": "Random Forest Classifier",
        "prediccion_clase": "Viral" if promedio_valores > 50 else "Estándar",
        "probabilidad_oob": 0.95, 
        "estado": "Completado con éxito"
    }