import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EXERCISES, Exercise } from "@/src/data/exercises";
import { ChevronLeft, RotateCcw, CheckCircle2, ArrowRight, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function WorkoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = EXERCISES.find(ex => ex.id === id);
  
  const [currentSeries, setCurrentSeries] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("vitaltrain_exercise_notes");
    if (savedNotes && id) {
      const notesObj = JSON.parse(savedNotes);
      setNotes(notesObj[id] || "");
    } else {
      setNotes("");
    }
  }, [id]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    const savedNotes = localStorage.getItem("vitaltrain_exercise_notes");
    const notesObj = savedNotes ? JSON.parse(savedNotes) : {};
    if (id) {
      notesObj[id] = newNotes;
      localStorage.setItem("vitaltrain_exercise_notes", JSON.stringify(notesObj));
    }
  };

  useEffect(() => {
    if (isResting && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isResting) {
      setIsResting(false);
      if (currentSeries < (exercise?.series || 0)) {
        setCurrentSeries(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResting, timeLeft, currentSeries, exercise]);

  if (!exercise) return <div>Ejercicio no encontrado</div>;

  const startRest = () => {
    if (exercise.descanso_segundos > 0) {
      setTimeLeft(exercise.descanso_segundos);
      setIsResting(true);
    } else {
      // If no rest, just move to next series or complete
      if (currentSeries < exercise.series) {
        setCurrentSeries(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const nextExercise = () => {
    const currentIndex = EXERCISES.indexOf(exercise);
    const nextEx = EXERCISES[currentIndex + 1];
    if (nextEx) {
      navigate(`/workout/${nextEx.id}`);
      // Reset state
      setCurrentSeries(1);
      setIsResting(false);
      setIsCompleted(false);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft className="w-6 h-6 text-brand-olive" />
        </button>
        <h2 className="serif text-2xl font-semibold">{exercise.nombre}</h2>
      </div>

      {/* Instructions Card */}
      <div className="bg-gradient-to-br from-brand-olive to-[#4F46E5] text-white rounded-[32px] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <CheckCircle2 className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            Instrucciones de ejecución
          </div>
          <p className="serif text-2xl leading-relaxed italic font-light">
            "{exercise.instrucciones}"
          </p>
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            {exercise.equipamiento.map((item, idx) => (
              <span key={idx} className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-white/80 font-medium uppercase tracking-wider backdrop-blur-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Notes Section */}
      <div className="bg-brand-cream/30 rounded-[32px] p-6 border border-brand-olive/5 space-y-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-brand-olive/40" />
          <h3 className="text-[10px] uppercase tracking-widest text-brand-olive/40 font-bold">Notas personales</h3>
        </div>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Añade notas sobre este ejercicio (ej. peso utilizado, sensaciones, ajustes...)"
          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-brand-olive placeholder:text-brand-olive/20 min-h-[80px] resize-none serif italic"
        />
      </div>

      {/* Progress & Controls */}
      <div className="bg-white rounded-[32px] p-8 card-shadow border border-brand-olive/5 space-y-8 text-center">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-olive/40 font-bold">Serie actual</p>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: exercise.series }).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-12 h-2 rounded-full transition-all duration-500",
                        i + 1 < currentSeries ? "bg-brand-accent" : 
                        i + 1 === currentSeries ? "bg-brand-olive w-16" : "bg-brand-cream"
                      )}
                    />
                  ))}
                </div>
                <h3 className="serif text-5xl font-bold text-brand-olive mt-4">
                  {currentSeries} <span className="text-2xl text-brand-olive/30">/ {exercise.series}</span>
                </h3>
              </div>

              <div className="p-6 bg-brand-cream/30 rounded-2xl border border-brand-olive/5">
                <p className="text-brand-olive font-medium">{exercise.repeticiones} repeticiones</p>
              </div>

              {isResting ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle 
                        cx="64" cy="64" r="60" 
                        fill="none" stroke="currentColor" strokeWidth="8" 
                        className="text-brand-cream"
                      />
                      <circle 
                        cx="64" cy="64" r="60" 
                        fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray={377}
                        strokeDashoffset={exercise.descanso_segundos > 0 ? 377 - (377 * timeLeft) / exercise.descanso_segundos : 0}
                        className="text-brand-accent transition-all duration-1000"
                      />
                    </svg>
                    <span className="text-3xl font-serif font-bold text-brand-olive">{timeLeft}s</span>
                  </div>
                  <p className="text-brand-accent font-bold uppercase tracking-widest text-xs">Descansando...</p>
                  <button 
                    onClick={() => setTimeLeft(0)}
                    className="text-brand-olive/40 hover:text-brand-olive text-xs underline underline-offset-4"
                  >
                    Saltar descanso
                  </button>
                </div>
              ) : (
                <button 
                  onClick={startRest}
                  className="w-full bg-gradient-to-r from-brand-olive to-[#4F46E5] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-brand-olive/20 flex items-center justify-center gap-3"
                >
                  TERMINAR SERIE
                  <CheckCircle2 className="w-6 h-6" />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 py-4"
            >
              <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-brand-accent" />
              </div>
              <h3 className="serif text-3xl font-bold">¡Buen trabajo!</h3>
              <p className="text-brand-olive/60">Has completado todas las series de este ejercicio.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={nextExercise}
                  className="w-full bg-gradient-to-r from-brand-olive to-[#4F46E5] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-olive/20"
                >
                  SIGUIENTE EJERCICIO
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link 
                  to="/"
                  className="w-full bg-white text-brand-ink border border-brand-olive/10 py-4 rounded-2xl font-bold hover:bg-brand-cream transition-colors"
                >
                  VOLVER AL INICIO
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
