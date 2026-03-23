import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { MapPin, Navigation, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface Park {
  name: string;
  address: string;
  distance?: string;
  url: string;
}

export default function NearbyParks() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        setLoading(true);
        
        // Get user location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Encuentra parques o zonas verdes ideales para caminar suavemente cerca de las coordenadas ${latitude}, ${longitude}. Devuelve una lista en formato JSON con nombre, dirección y URL de Google Maps.`,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: { latitude, longitude }
              }
            }
          }
        });

        // Extract from grounding chunks if possible, or parse text
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > 0) {
          const mappedParks: Park[] = chunks
            .filter(c => c.maps)
            .map(c => ({
              name: c.maps?.title || "Parque cercano",
              address: "Zona verde recomendada",
              url: c.maps?.uri || "#"
            }));
          setParks(mappedParks);
        } else {
          // Fallback parsing if JSON was requested but text returned
          // For simplicity in this MVP, we'll assume grounding works or show a message
          setParks([]);
        }
      } catch (err) {
        console.error(err);
        setError("No pudimos encontrar parques cerca de ti. Asegúrate de permitir la ubicación.");
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-brand-olive/60 font-bold">Cardio al aire libre</p>
        <h2 className="serif text-4xl font-bold leading-tight text-brand-ink">
          Zonas verdes <span className="italic text-brand-accent underline decoration-brand-accent/20 underline-offset-8">cercanas</span>
        </h2>
        <p className="text-sm text-brand-olive/60 leading-relaxed">
          Caminar en la naturaleza mejora tu salud cardiovascular y mental. Aquí tienes algunos lugares recomendados cerca de ti.
        </p>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-brand-olive animate-spin" />
          <p className="text-sm text-brand-olive/40 font-medium uppercase tracking-widest">Buscando lugares...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 rounded-[32px] border border-red-100 text-center space-y-4">
          <MapPin className="w-10 h-10 text-red-300 mx-auto" />
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {parks.length > 0 ? (
            parks.map((park, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[32px] card-shadow border border-brand-olive/5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-ink">{park.name}</h4>
                    <p className="text-xs text-brand-olive/50 uppercase tracking-tighter">{park.address}</p>
                  </div>
                </div>
                <a 
                  href={park.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-olive hover:bg-brand-olive hover:text-white transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 space-y-4">
              <p className="text-brand-olive/40 italic">No se encontraron resultados específicos, pero te animamos a explorar tu barrio.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
