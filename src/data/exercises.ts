export interface Exercise {
  id: string;
  nombre: string;
  categoria: 'Tren inferior' | 'Zona abdominal/lumbar' | 'Tren superior' | 'Cardio' | 'Flexibilidad/Relajación' | 'Calentamiento';
  dia_semana: string[];
  series: number;
  repeticiones: string;
  descanso_segundos: number;
  equipamiento: string[];
  instrucciones: string;
  extra: boolean;
}

export const EXERCISES: Exercise[] = [
  // Lunes / Jueves: Tren Inferior
  {
    id: "low_001",
    nombre: "Sentadilla pies juntos",
    categoria: "Tren inferior",
    dia_semana: ["Lunes", "Jueves"],
    series: 3,
    repeticiones: "12",
    descanso_segundos: 60,
    equipamiento: ["Silla (opcional)"],
    instrucciones: "Mantener los pies juntos y realizar el descenso de forma controlada. Puedes apoyarte en una silla si es necesario.",
    extra: false
  },
  {
    id: "low_002",
    nombre: "Zancada lateral",
    categoria: "Tren inferior",
    dia_semana: ["Lunes", "Jueves"],
    series: 3,
    repeticiones: "10 por pierna",
    descanso_segundos: 60,
    equipamiento: ["Silla para apoyo"],
    instrucciones: "Desplaza una pierna hacia el lado manteniendo la otra estirada. Vuelve al centro con control.",
    extra: false
  },
  {
    id: "low_extra_001",
    nombre: "Sentadilla con salto (Suave)",
    categoria: "Tren inferior",
    dia_semana: ["Lunes", "Jueves"],
    series: 2,
    repeticiones: "8",
    descanso_segundos: 90,
    equipamiento: ["Ninguno"],
    instrucciones: "Realiza una sentadilla y al subir haz un pequeño salto. Amortigua bien la caída.",
    extra: true
  },

  // Martes: Zona Abdominal/Lumbar
  {
    id: "core_001",
    nombre: "Plancha frontal apoyado en silla",
    categoria: "Zona abdominal/lumbar",
    dia_semana: ["Martes"],
    series: 3,
    repeticiones: "30 segundos",
    descanso_segundos: 45,
    equipamiento: ["Silla estable"],
    instrucciones: "Apoya los antebrazos en la silla y mantén el cuerpo recto como una tabla.",
    extra: false
  },
  {
    id: "core_002",
    nombre: "Elevación de pelvis (Puente)",
    categoria: "Zona abdominal/lumbar",
    dia_semana: ["Martes"],
    series: 3,
    repeticiones: "15",
    descanso_segundos: 60,
    equipamiento: ["Esterilla"],
    instrucciones: "Tumbado boca arriba, eleva la cadera apretando glúteos y abdomen.",
    extra: false
  },

  // Miércoles / Viernes: Tren Superior
  {
    id: "upper_001",
    nombre: "Flexiones en pared",
    categoria: "Tren superior",
    dia_semana: ["Miércoles", "Viernes"],
    series: 3,
    repeticiones: "12",
    descanso_segundos: 60,
    equipamiento: ["Pared"],
    instrucciones: "Apoya las manos en la pared a la altura de los hombros y realiza flexiones controladas.",
    extra: false
  },
  {
    id: "upper_002",
    nombre: "Press de hombros con botellas",
    categoria: "Tren superior",
    dia_semana: ["Miércoles", "Viernes"],
    series: 3,
    repeticiones: "12",
    descanso_segundos: 60,
    equipamiento: ["2 botellas de agua"],
    instrucciones: "Sentado o de pie, eleva las botellas desde los hombros hacia el techo.",
    extra: false
  },

  // Transversales
  {
    id: "warm_001",
    nombre: "Movilidad articular suave",
    categoria: "Calentamiento",
    dia_semana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    series: 1,
    repeticiones: "2 minutos",
    descanso_segundos: 0,
    equipamiento: ["Ninguno"],
    instrucciones: "Realiza círculos suaves con hombros, muñecas y tobillos. Mueve el cuello de lado a lado.",
    extra: false
  },
  {
    id: "warm_002",
    nombre: "Marcha en el sitio",
    categoria: "Calentamiento",
    dia_semana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    series: 1,
    repeticiones: "1 minuto",
    descanso_segundos: 0,
    equipamiento: ["Ninguno"],
    instrucciones: "Camina sin moverte del sitio, elevando ligeramente las rodillas y braceando con naturalidad.",
    extra: false
  },
  {
    id: "flex_001",
    nombre: "Estiramiento de cuello",
    categoria: "Flexibilidad/Relajación",
    dia_semana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    series: 1,
    repeticiones: "20 segundos por lado",
    descanso_segundos: 0,
    equipamiento: ["Ninguno"],
    instrucciones: "Lleva suavemente la oreja hacia el hombro. Mantén la espalda recta.",
    extra: false
  }
];
