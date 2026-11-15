from pathlib import Path
from typing import Optional
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Motor analítico de viralidad en youtube")

MODEL_PATH = Path(__file__).resolve().parent/ "modelo_youtube_rf.pkl"

artefacto = joblib.load(MODEL_PATH)
model = artefacto["modelo"]
columnas_entrenamiento = artefacto["columnas"]
umbral_def = artefacto.get("umbral_default",0.42)

class VideoMetaData(BaseModel):
    category: str
    upload_day: str
    duration_sec: int
    title_length: int
    upload_hour: int
    umbral: Optional[float] = Field(default=None, ge=0.0, le=1.0)

@app.get("/health")
def health_check():
    return{
        "status":"ok",
        "features_esperadas": len(columnas_entrenamiento),
        "umbral_default": umbral_def,
    }

@app.post("/predict")
def predecir_viralidad(video: VideoMetaData):
    try:
        datos = video.model_dump(exclude={"umbral"})
        corte = video.umbral if video.umbral is not None else umbral_def

        # Conversión de JSON a Dataframe de fila y aplicación del One-hot encoding
        df_entrada = pd.DataFrame([datos])
        df_codi = pd.get_dummies(df_entrada)

        # Alineación con el esquema del modelo
        df_alineado = df_codi.reindex(columns=columnas_entrenamiento, fill_value=0)
        # Cálculo de probabilidad
        probabilidad = float(model.predict_proba(df_alineado)[0][1])
        es_Viral = probabilidad >= corte

        return {
            "es_viral": es_Viral,
            "probabilidad_viral": round(probabilidad*100,2),
            "umbral_aplicado": corte,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
