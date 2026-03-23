import { useState, useEffect } from "react";
import { Quote, Scale, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const MOTIVATIONAL_QUOTES = [
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "Tu cuerpo puede hacer casi cualquier cosa. Es tu mente a la que tienes que convencer.",
  "No te detengas hasta que te sientas orgulloso.",
  "La disciplina es el puente entre las metas y los logros.",
  "Cada entrenamiento es un paso más hacia tu mejor versión.",
  "No cuentes los días, haz que los días cuenten.",
  "La fuerza no viene de la capacidad física, sino de una voluntad indomable.",
  "Tu único límite eres tú mismo.",
  "El dolor es temporal, el orgullo es para siempre.",
  "Hazlo hoy, no mañana."
];

export default function DailyInsight({ date }: { date: string }) {
  const [weight, setWeight] = useState<string>("");
  const [prevWeight, setPrevWeight] = useState<number | null>(null);
  const [quote, setQuote] = useState("");

  const yesterday = format(subDays(new Date(date), 1), "yyyy-MM-dd");

  useEffect(() => {
    // Pick a quote based on the date string
    const dateObj = new Date(date);
    const dayOfYear = Math.floor((dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]);

    // Load weights
    const savedWeights = localStorage.getItem("vitaltrain_weights");
    if (savedWeights) {
      const weights = JSON.parse(savedWeights);
      if (weights[yesterday]) {
        setPrevWeight(weights[yesterday]);
      } else {
        setPrevWeight(null);
      }
      if (weights[date]) {
        setWeight(weights[date].toString());
      } else {
        setWeight("");
      }
    }
  }, [date, yesterday]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWeight(val);
    
    const savedWeights = localStorage.getItem("vitaltrain_weights");
    const weights = savedWeights ? JSON.parse(savedWeights) : {};
    
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      weights[date] = numVal;
      localStorage.setItem("vitaltrain_weights", JSON.stringify(weights));
    }
  };

  const weightDiff = prevWeight !== null && weight !== "" ? parseFloat(weight) - prevWeight : null;
  const isToday = date === format(new Date(), "yyyy-MM-dd");
  const displayDate = format(new Date(date), "d 'de' MMMM", { locale: es });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Motivation Card */}
      <motion.div 
        key={`quote-${date}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-brand-cream to-white rounded-[32px] p-6 border border-brand-olive/5 flex flex-col justify-between space-y-4 shadow-sm"
      >
        <div className="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center">
          <Quote className="w-5 h-5 text-brand-accent" />
        </div>
        <p className="serif text-xl italic text-brand-ink leading-relaxed font-medium">
          "{quote}"
        </p>
        <p className="text-[10px] uppercase tracking-widest text-brand-olive/40 font-bold">
          Motivación del {displayDate}
        </p>
      </motion.div>

      {/* Weight Card */}
      <motion.div 
        key={`weight-${date}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] p-6 card-shadow border border-brand-olive/5 flex flex-col justify-between space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-brand-olive/5 rounded-full flex items-center justify-center">
            <Scale className="w-5 h-5 text-brand-olive" />
          </div>
          {weightDiff !== null && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
              weightDiff < 0 ? "bg-green-100 text-green-700" : weightDiff > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
            )}>
              {weightDiff < 0 ? <TrendingDown className="w-3 h-3" /> : weightDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {Math.abs(weightDiff).toFixed(1)} kg
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={handleWeightChange}
              placeholder="0.0"
              className="serif text-4xl font-bold text-brand-ink bg-transparent border-none p-0 focus:ring-0 w-24 placeholder:text-brand-olive/10"
            />
            <span className="text-brand-olive/40 font-bold">kg</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-brand-olive/40 font-bold">
            Peso del {displayDate}
          </p>
        </div>

        <div className="pt-2 border-t border-brand-olive/5">
          <p className="text-xs text-brand-olive/60">
            Día anterior: <span className="font-bold text-brand-olive">{prevWeight !== null ? `${prevWeight} kg` : "Sin datos"}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
