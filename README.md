# 📊 API REST: Validación y Análisis de Datos (Microservicios)

Arquitectura distribuida diseñada para la validación estructurada, limpieza y análisis de registros de datos. El sistema separa la orquestación web del procesamiento matemático intensivo, garantizando un flujo de información seguro, auditable y escalable.

##  Arquitectura del Sistema

El proyecto consta de dos servicios independientes que se comunican internamente vía HTTP:

1. **API Gateway (Node.js + Express):** Actúa como orquestador principal. Recibe las peticiones, valida la integridad de la estructura de los datos entrantes (cargas útiles) y maneja las respuestas asíncronas hacia el cliente.
2. **Motor Analítico (Python + FastAPI):** Microservicio aislado dedicado a la ejecución de limpieza de datos, validación de registros y modelos predictivos (ej. Random Forest con Scikit-Learn) sobre los arrays numéricos.

##  Stack Tecnológico
* **Backend y Enrutamiento:** Node.js, Express.js, Axios
* **Data Science / Microservicio:** Python 3.13, FastAPI, Pandas, Scikit-Learn
* **Entorno de Desarrollo:** Linux (Ubuntu 26.04 LTS / WSL), Bash, Git

##  Flujo de Procesamiento
1. El cliente envía un JSON con datos crudos al endpoint `POST /api/analyze` de Node.js.
2. Node.js intercepta, realiza una validación primaria y transfiere la carga al motor de Python de forma asíncrona.
3. Python procesa los datos, aplica las reglas analíticas correspondientes y retorna el análisis estructurado.
4. Node.js empaqueta los resultados y los devuelve al cliente garantizando el código de estado HTTP adecuado.

##  Ejecución Local (Entornos Linux)

**1. Motor Analítico (Puerto 8000)**
```bash
cd python-service
source venv/bin/activate
uvicorn main:app --reload --port 8000


**2. Orquestador**
```bash
# En una nueva terminal en la raíz del proyecto
npm install
npm run dev