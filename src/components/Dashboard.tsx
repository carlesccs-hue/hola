import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { EXERCISES, Exercise } from "@/src/data/exercises";
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, subMonths, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CheckCircle2, ChevronRight, Zap, Heart, BarChart3, StickyNote, Flame, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import DailyInsight from "./DailyInsight";

export default function Dashboard() {
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const todayName = format(new Date(), "EEEE", { locale: es });
  const capitalizedToday = todayName.charAt(0).toUpperCase() + todayName.slice(1);

  const [selectedDay, setSelectedDay] = useState(capitalizedToday);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayExercises, setTodayExercises] = useState<Exercise[]>([]);
  const [showExtra, setShowExtra] = useState(false);
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem("vitaltrain_completed_days");
    if (saved) setCompletedDays(JSON.parse(saved));

    const savedNotes = localStorage.getItem("vitaltrain_exercise_notes");
    if (savedNotes) setExerciseNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    const dayName = format(selectedDate, "EEEE", { locale: es });
    const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    setSelectedDay(capitalized);
  }, [selectedDate]);

  useEffect(() => {
    const filtered = EXERCISES.filter(ex => 
      ex.dia_semana.includes(selectedDay) && (showExtra ? true : !ex.extra)
    );
    setTodayExercises(filtered);
  }, [selectedDay, showExtra]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = addDays(start, 41); // 6 weeks grid
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const progressData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return daysOfWeek.map((day, index) => {
      const date = addDays(start, index);
      const dateStr = format(date, "yyyy-MM-dd");
      const isCompleted = completedDays.includes(dateStr);
      return {
        name: day.substring(0, 2),
        fullDay: day,
        completed: isCompleted ? 1 : 0,
        date: dateStr
      };
    });
  }, [completedDays]);

  const selectedDateStr = useMemo(() => {
    const dayData = progressData.find(d => d.fullDay === selectedDay);
    return dayData?.date || format(new Date(), "yyyy-MM-dd");
  }, [selectedDay, progressData]);

  const completedCount = progressData.filter(d => d.completed === 1).length;

  const warmUpExercises = useMemo(() => {
    return EXERCISES.filter(ex => ex.categoria === "Calentamiento");
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-widest text-brand-olive/60 font-bold">
            {isSameDay(selectedDate, new Date()) ? "¡Hola! Hoy es " + capitalizedToday : "Viendo rutina del " + format(selectedDate, "d 'de' MMMM", { locale: es })}
          </p>
          <h2 className="serif text-4xl font-bold leading-tight text-brand-ink">
            Tu rutina de <span className="italic text-brand-accent underline decoration-brand-accent/20 underline-offset-8">bienestar</span>
          </h2>
        </div>

        {/* Monthly Calendar Section */}
        <div className="bg-white rounded-[32px] p-6 card-shadow border border-brand-olive/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-olive" />
              <h3 className="serif text-xl font-bold capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </h3>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 text-brand-olive" />
              </button>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4 text-brand-olive" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["L", "M", "X", "J", "V", "S", "D"].map(d => (
              <span key={d} className="text-[10px] font-bold text-brand-olive/30 uppercase py-2">{d}</span>
            ))}
            {calendarDays.map((date, idx) => {
              const isSel = isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const dateStr = format(date, "yyyy-MM-dd");
              const isCompleted = completedDays.includes(dateStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "relative h-10 w-full rounded-xl flex items-center justify-center text-sm transition-all",
                    !isCurrentMonth && "opacity-20",
                    isSel ? "bg-brand-olive text-white font-bold shadow-lg" : "hover:bg-brand-cream/50",
                    isTodayDate && !isSel && "text-brand-olive font-extrabold underline decoration-brand-accent decoration-2 underline-offset-4"
                  )}
                >
                  {format(date, "d")}
                  {isCompleted && (
                    <div className={cn(
                      "absolute bottom-1 w-1 h-1 rounded-full",
                      isSel ? "bg-white" : "bg-brand-accent"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Progress Summary */}
        <div className="bg-gradient-to-br from-brand-olive to-[#4F46E5] text-white rounded-[32px] p-6 shadow-xl shadow-brand-olive/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-white/80" />
              <h3 className="font-bold text-lg">Progreso Semanal</h3>
            </div>
            <span className="text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
              {completedCount} de 7 días
            </span>
          </div>
          
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white text-brand-ink p-2 rounded-lg text-[10px] font-bold shadow-lg border border-brand-olive/10">
                          {payload[0].payload.fullDay}: {payload[0].value === 1 ? '¡Completado!' : 'Pendiente'}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {progressData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.completed === 1 ? '#EC4899' : 'rgba(255,255,255,0.2)'} 
                    />
                  ))}
                </Bar>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600 }}
                  interval={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="pt-2">
            <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / 7) * 100}%` }}
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Insight Section */}
      <DailyInsight date={selectedDateStr} />

      {/* Warm-up Section */}
      <section className="space-y-4">
        <h3 className="serif text-2xl font-semibold">Calentamiento</h3>
        <div className="grid grid-cols-2 gap-4">
          {warmUpExercises.map((ex) => (
            <Link 
              key={ex.id}
              to={`/workout/${ex.id}`}
              className="p-4 bg-white rounded-3xl card-shadow border border-brand-olive/5 flex flex-col gap-3 hover:bg-brand-cream/30 transition-all"
            >
              <div className="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{ex.nombre}</h4>
                <p className="text-[10px] text-brand-olive/40 uppercase tracking-widest mt-1">Preparar cuerpo</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Routine Card */}
      <div className="bg-white rounded-[32px] p-6 card-shadow border border-brand-olive/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Rutina de {selectedDay}</h3>
              <p className="text-xs text-brand-olive/50 uppercase tracking-tighter">
                {todayExercises.length} ejercicios • ~20 min
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowExtra(!showExtra)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all border",
              showExtra 
                ? "bg-brand-accent text-white border-brand-accent shadow-lg shadow-brand-accent/20" 
                : "bg-transparent text-brand-olive border-brand-olive/20"
            )}
          >
            MODO EXTRA
          </button>
        </div>

        {/* Warm-up Reminder */}
        {todayExercises.length > 0 && (
          <div className="bg-brand-accent/10 rounded-2xl p-4 border border-brand-accent/20 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <Flame className="w-5 h-5 text-brand-accent" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-brand-olive text-sm">¡No olvides calentar!</h4>
              <p className="text-xs text-brand-olive/70 leading-relaxed">
                El calentamiento prepara tus articulaciones y previene lesiones. Dedica al menos 3-5 minutos antes de empezar.
              </p>
              <div className="flex gap-2 pt-1">
                {warmUpExercises.slice(0, 1).map(ex => (
                  <Link 
                    key={ex.id}
                    to={`/workout/${ex.id}`}
                    className="text-[10px] font-bold text-brand-olive uppercase tracking-wider hover:underline"
                  >
                    Ver calentamiento →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {todayExercises.length > 0 ? (
            todayExercises.map((ex, idx) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-brand-cream/30 hover:bg-brand-cream/60 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-olive font-serif text-xl border border-brand-olive/5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-brand-ink leading-none">{ex.nombre}</h4>
                      {exerciseNotes[ex.id] && (
                        <StickyNote className="w-3 h-3 text-brand-accent" />
                      )}
                    </div>
                    <p className="text-xs text-brand-olive/60">{ex.series} series • {ex.repeticiones}</p>
                  </div>
                </div>
                <Link 
                  to={`/workout/${ex.id}`}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-brand-olive group-hover:text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="py-10 text-center space-y-2">
              <p className="text-brand-olive/40 italic">No hay ejercicios programados para este día.</p>
            </div>
          )}
        </div>

        {todayExercises.length > 0 && (
          <Link 
            to={`/workout/${todayExercises[0]?.id}`}
            className="w-full bg-gradient-to-r from-brand-olive to-[#4F46E5] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-olive/20"
          >
            EMPEZAR ENTRENAMIENTO
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Stretching Section */}
      <section className="space-y-4">
        <h3 className="serif text-2xl font-semibold">Relajación y Estiramientos</h3>
        <div className="grid grid-cols-2 gap-4">
          {EXERCISES.filter(ex => ex.categoria === "Flexibilidad/Relajación").slice(0, 2).map((ex) => (
            <Link 
              key={ex.id}
              to={`/workout/${ex.id}`}
              className="p-4 bg-white rounded-3xl card-shadow border border-brand-olive/5 flex flex-col gap-3 hover:bg-brand-cream/30 transition-all"
            >
              <div className="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{ex.nombre}</h4>
                <p className="text-[10px] text-brand-olive/40 uppercase tracking-widest mt-1">Finalizar sesión</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Health Tip */}
      <div className="p-6 bg-brand-accent/5 rounded-[32px] border border-brand-accent/10 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-brand-accent" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-brand-ink">Consejo de salud</h4>
          <p className="text-sm text-brand-ink/70 leading-relaxed">
            Recuerda calentar suavemente antes de empezar. Si sientes algún dolor punzante, detente y consulta con tu médico.
          </p>
        </div>
      </div>
    </div>
  );
}
