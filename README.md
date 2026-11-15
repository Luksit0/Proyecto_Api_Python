#  Predictor de Viralidad de Videos — Arquitectura de Microservicios

##  Autor

**Juan Diego Lopez Garcia**  
*Ingeniería en Computación | Desarrollo Full-Stack & Machine Learning*

* **GitHub:** [@Luksit0](https://github.com/Luksit0)
* **LinkedIn:** [Tu Perfil de LinkedIn](https://linkedin.com/in/juanlopezgar)
EOF

Sistema full-stack diseñado bajo una arquitectura de microservicios desacoplados que predice el potencial viral de un video a partir de sus metadatos previos a la publicación. El núcleo de inferencia utiliza un modelo de **Machine Learning (Random Forest)** expuesto mediante **FastAPI**, orquestado a través de un **API Gateway en Node.js/Express** y consumido por una interfaz interactiva en **Next.js**.

##  Arquitectura del Sistema

```
┌─────────────────────────┐       HTTP / JSON       ┌─────────────────────────┐       HTTP / JSON       ┌─────────────────────────┐
│    Frontend Client      │ ──────────────────────▶ │       API Gateway       │ ──────────────────────▶ │   ML Inference Engine   │
│  Next.js + Tailwind CSS │                         │   Node.js + Express.js  │                         │   Python + FastAPI      │
│      (Puerto 3001)      │ ◀────────────────────── │      (Puerto 3000)      │ ◀────────────────────── │      (Puerto 8000)      │
└─────────────────────────┘                         └─────────────────────────┘                         └─────────────────────────┘

```

### Componentes Principales

* **`frontend/` (Presentación):** Aplicación en **Next.js (App Router)** estilizada con **Tailwind CSS**. Captura los metadatos del video, valida tipos numéricos en el cliente y presenta el veredicto de viralidad junto con la probabilidad calculada.

* **`node-gateway/` (Orquestación / API Gateway):** Servidor intermedio en **Node.js y Express**. Gestiona políticas **CORS**, centraliza las peticiones del cliente en el endpoint `/api/videos/analizar` y maneja la comunicación asíncrona y captura de errores hacia el motor de IA.

* **`python-service/` (Inferencia ML):** Microservicio en **Python con FastAPI y Uvicorn**. Valida estrictamente el esquema de entrada mediante **Pydantic**, transforma el payload en un DataFrame de **Pandas** y ejecuta la predicción de probabilidad con un modelo **Random Forest (`scikit-learn`)** aplicando un umbral de decisión optimizado (`0.42`).

##  Stack Tecnológico

| Capa | Tecnologías | 
| ----- | ----- | 
| **Frontend** | Next.js, React, Tailwind CSS, Fetch API | 
| **API Gateway** | Node.js, Express.js, CORS | 
| **Motor de IA / Backend ML** | Python 3, FastAPI, Uvicorn, Pydantic, Scikit-Learn, Pandas, Joblib | 
| **Entorno de Desarrollo** | Ubuntu LTS (WSL2), Git | 

## 📂 Estructura del Repositorio

```
proyecto-api-cv/
├── frontend/                  # Cliente web Next.js (Puerto 3001)
│   ├── app/
│   │   └── page.js            # Formulario interactivo de evaluación
│   └── package.json
├── node-gateway/              # API Gateway en Express (Puerto 3000)
│   ├── routes/
│   │   └── videos.js          # Endpoint POST /api/videos/analizar
│   ├── services/
│   │   └── pythonApi.js       # Cliente HTTP hacia FastAPI
│   ├── index.js               # Punto de entrada del Gateway
│   └── package.json
├── python-service/            # Microservicio de Machine Learning (Puerto 8000)
│   ├── main.py                # Servidor FastAPI y lógica de inferencia
│   └── *.pkl                  # Modelo Random Forest serializado
├── .gitignore
└── README.md

```

##  Instalación y Ejecución Local

Para levantar el ecosistema completo, abre **tres terminales independientes** desde la raíz del proyecto:

### 1. Iniciar el Microservicio de IA (Puerto 8000)

```
cd python-service
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn scikit-learn pandas pydantic joblib
uvicorn main:app --port 8000

```

*Documentación interactiva Swagger UI disponible en: `http://127.0.0.1:8000/docs`*

### 2. Iniciar el API Gateway en Node.js (Puerto 3000)

```
cd node-gateway
npm install
node index.js

```

### 3. Iniciar el Frontend en Next.js (Puerto 3001)

```
cd frontend
npm install
npm run dev -- -p 3001

```

*Interfaz web disponible en: `http://localhost:3001`*

##  Contrato de la API (Endpoint del Gateway)

### `POST http://localhost:3000/api/videos/analizar`

**Cuerpo de la petición (Request Body):**

```
{
  "category": "Beauty",
  "upload_day": "Sun",
  "duration_sec": 1200,
  "title_length": 45,
  "upload_hour": 9
}

```

| Campo | Tipo | Descripción | 
| ----- | ----- | ----- | 
| `category` | `string` | Categoría principal del contenido (ej. `Gaming`, `Beauty`, `Tech`). | 
| `upload_day` | `string` | Día de publicación abreviado en inglés (`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`). | 
| `duration_sec` | `number` | Duración total del video en segundos. | 
| `title_length` | `number` | Cantidad de caracteres en el título del video. | 
| `upload_hour` | `number` | Hora de publicación en formato 24 horas (`0` - `23`). | 

**Respuesta exitosa (`200 OK`):**

```
{
  "mensaje": "Análisis completado con éxito",
  "resultado": {
    "es_viral": true,
    "probabilidad_viral": 44.79,
    "umbral_aplicado": 0.42
  }
}

```

**Prueba rápida desde terminal con `curl`:**

```
curl -X POST http://localhost:3000/api/videos/analizar \
  -H "Content-Type: application/json" \
  -d '{"category": "Beauty", "upload_day": "Sun", "duration_sec": 1200, "title_length": 45, "upload_hour": 9}'

```