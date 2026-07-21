import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Test vocacional — 10 preguntas",
  description:
    "Respondé 10 preguntas rápidas y descubrí qué carrera universitaria va con vos y dónde estudiarla en Argentina.",
  alternates: { canonical: "/test" },
  // El resultado se comparte, no el quiz en sí.
  robots: { index: true, follow: true },
};

export default function TestPage() {
  return <Quiz />;
}
