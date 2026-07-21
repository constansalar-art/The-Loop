import type { AreaCode } from "./areas";

/**
 * Las 10 preguntas del test.
 *
 * Cada opción suma puntos a una o dos áreas. Para ajustar el balance del test
 * después de testear, tocá los números de `points` acá (y los pesos globales /
 * el desempate en lib/scoring.ts). La lógica de cálculo NO vive en este archivo.
 */

export type Points = Partial<Record<AreaCode, number>>;

export interface Option {
  id: "A" | "B" | "C" | "D";
  text: string;
  points: Points;
}

export interface Question {
  id: number;
  prompt: string;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Sábado a la tarde, sin planes ni obligaciones. ¿Qué te tienta?",
    options: [
      { id: "A", text: "Cacharrear con la compu, armar o desarmar algo, ver cómo funciona", points: { TEC: 2 } },
      { id: "B", text: "Pensar una idea para ganar plata o revender algo", points: { NEG: 2 } },
      { id: "C", text: "Leer o ver algo sobre lo que pasa en el mundo, meterte en un debate", points: { SOC: 2 } },
      { id: "D", text: "Editar un video, dibujar, hacer algo que quede lindo", points: { ART: 2 } },
    ],
  },
  {
    id: 2,
    prompt: "En un trabajo en grupo, vos sos el que…",
    options: [
      { id: "A", text: "Organiza todo y reparte las tareas", points: { NEG: 2 } },
      { id: "B", text: "Se asegura de que quede impecable: el diseño, la presentación", points: { ART: 2 } },
      { id: "C", text: "Investiga a fondo y arma el contenido serio", points: { SOC: 1, SAL: 1 } },
      { id: "D", text: "Resuelve la parte técnica o los números que nadie entiende", points: { TEC: 2 } },
    ],
  },
  {
    id: 3,
    prompt: "La materia que más bancabas en el secundario",
    options: [
      { id: "A", text: "Matemática / Física", points: { TEC: 1, NEG: 1 } },
      { id: "B", text: "Lengua / Historia / Filosofía", points: { SOC: 1, DER: 1 } },
      { id: "C", text: "Biología / Química", points: { SAL: 2 } },
      { id: "D", text: "Arte / algo manual y creativo", points: { ART: 2 } },
    ],
  },
  {
    id: 4,
    prompt: "Si pudieras elegir un superpoder…",
    options: [
      { id: "A", text: "Entender cómo funciona cualquier máquina o sistema", points: { TEC: 2 } },
      { id: "B", text: "Convencer a cualquiera de lo que quieras", points: { DER: 1, NEG: 1 } },
      { id: "C", text: "Curar a la gente con solo tocarla", points: { SAL: 2 } },
      { id: "D", text: "Crear imágenes y mundos con la mente", points: { ART: 2 } },
    ],
  },
  {
    id: 5,
    prompt: "Un amigo está en un quilombo. ¿Qué hacés?",
    options: [
      { id: "A", text: "Le armás un plan paso a paso para salir", points: { NEG: 1, TEC: 1 } },
      { id: "B", text: "Lo escuchás y lo ayudás a entender qué le pasa", points: { SAL: 1, SOC: 1 } },
      { id: "C", text: "Le explicás qué derechos tiene y cómo reclamar", points: { DER: 2 } },
      { id: "D", text: "Le levantás el ánimo con algo creativo", points: { ART: 2 } },
    ],
  },
  {
    id: 6,
    prompt: "Lo que más orgullo te daría lograr",
    options: [
      { id: "A", text: "Crear un producto o app que use un montón de gente", points: { TEC: 2 } },
      { id: "B", text: "Tener tu propia empresa", points: { NEG: 2 } },
      { id: "C", text: "Mejorar o salvar la vida de alguien", points: { SAL: 2 } },
      { id: "D", text: "Que algo que creaste emocione a la gente", points: { ART: 1, SOC: 1 } },
    ],
  },
  {
    id: 7,
    prompt: "En una discusión picante, ¿qué te sale?",
    options: [
      { id: "A", text: "Traer datos y lógica hasta cerrar el tema", points: { TEC: 1, DER: 1 } },
      { id: "B", text: "Argumentar fino, encontrarle la vuelta formal", points: { DER: 2 } },
      { id: "C", text: "Entender al otro y buscar el punto medio", points: { SOC: 2 } },
      { id: "D", text: "Verlo como una negociación y sacar ventaja", points: { NEG: 2 } },
    ],
  },
  {
    id: 8,
    prompt: "Tu ambiente de laburo ideal",
    options: [
      { id: "A", text: "Una startup tech, pantallas y código por todos lados", points: { TEC: 2 } },
      { id: "B", text: "Tu propio negocio, cerrando tratos", points: { NEG: 2 } },
      { id: "C", text: "Un hospital o consultorio, rodeado de gente", points: { SAL: 2 } },
      { id: "D", text: "Un estudio creativo o una agencia", points: { ART: 2 } },
    ],
  },
  {
    id: 9,
    prompt: "¿Qué te mueve más a la hora de laburar?",
    options: [
      { id: "A", text: "Resolver problemas difíciles", points: { TEC: 2 } },
      { id: "B", text: "Ganar bien y crecer rápido", points: { NEG: 2 } },
      { id: "C", text: "Que lo que hago le sirva a alguien", points: { SAL: 1, SOC: 1 } },
      { id: "D", text: "Tener libertad para crear", points: { ART: 2 } },
    ],
  },
  {
    id: 10,
    prompt: "En 10 años te ves…",
    options: [
      { id: "A", text: "Con tu propia startup o liderando un equipo técnico", points: { TEC: 1, NEG: 1 } },
      { id: "B", text: "Con una empresa o consultora tuya", points: { NEG: 2 } },
      { id: "C", text: "Atendiendo pacientes o investigando", points: { SAL: 2 } },
      { id: "D", text: "Ejerciendo, defendiendo casos en un estudio", points: { DER: 2 } },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
