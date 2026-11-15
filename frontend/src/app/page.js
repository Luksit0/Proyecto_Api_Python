"use client";
import { useState } from "react";

export default function VideoForm() {
  // Estado inicial con las variables en inglés que espera Python
  const [formData, setFormData] = useState({
    category: "Gaming",
    upload_day: "Sun",
    duration_sec: 600,
    title_length: 45,
    upload_hour: 12,
  });

  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Convertimos a número los campos numéricos
      [name]: ["duration_sec", "title_length", "upload_hour"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      // Petición hacia tu Gateway en Node.js (Puerto 3000)
      const res = await fetch("http://localhost:3000/api/videos/analizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      setResultado(data.resultado); // Accedemos al objeto "resultado" del Gateway
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">Predictor de Viralidad :D</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Categoría (Ej. Gaming, Beauty, Tech)</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required
            className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Día de Subida (Ej. Mon, Tue, Sun)</label>
          <input type="text" name="upload_day" value={formData.upload_day} onChange={handleChange} required
            className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Duración (segundos)</label>
          <input type="number" name="duration_sec" value={formData.duration_sec} onChange={handleChange} required
            className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Longitud del Título (caracteres)</label>
          <input type="number" name="title_length" value={formData.title_length} onChange={handleChange} required
            className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Hora de Subida (0-23)</label>
          <input type="number" name="upload_hour" value={formData.upload_hour} onChange={handleChange} required
            className="mt-1 w-full p-2 border rounded" />
        </div>

        <button type="submit" disabled={cargando}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400">
          {cargando ? "Analizando..." : "Evaluar Video"}
        </button>
      </form>

      {/* Resultados de la IA */}
      {error && <p className="mt-4 text-red-500 font-semibold text-center">{error}</p>}
      
      {resultado && (
        <div className={`mt-6 p-4 rounded text-center border-2 ${resultado.es_viral ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
          <h3 className="text-xl font-bold">
            {resultado.es_viral ? "🔥 ¡Potencial Viral!" : "📉 Alcance Estándar"}
          </h3>
          <p className="mt-2 text-gray-700">
            Probabilidad: <span className="font-bold">{resultado.probabilidad_viral}%</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Umbral del modelo: {resultado.umbral_aplicado})
          </p>
        </div>
      )}
    </div>
  );
}