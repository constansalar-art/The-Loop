"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS, TOTAL_QUESTIONS, type Points } from "@/data/quiz";
import { computeResult } from "@/lib/scoring";
import { AREAS } from "@/data/areas";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Points[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  const question = QUESTIONS[step];
  const progress = ((step + (picked ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  const finish = useCallback(
    (allAnswers: Points[]) => {
      setCalculating(true);
      const { area } = computeResult(allAnswers);
      const slug = AREAS[area].slug;
      // Pequeño "redoble" antes del reveal en la página de resultado.
      window.setTimeout(() => {
        router.push(`/resultado/${slug}`);
      }, 1300);
    },
    [router],
  );

  function choose(optionId: string, points: Points) {
    if (picked) return; // evitar doble tap
    setPicked(optionId);
    const nextAnswers = [...answers, points];

    window.setTimeout(() => {
      if (step + 1 >= TOTAL_QUESTIONS) {
        setAnswers(nextAnswers);
        finish(nextAnswers);
      } else {
        setAnswers(nextAnswers);
        setStep((s) => s + 1);
        setPicked(null);
      }
    }, 260);
  }

  function goBack() {
    if (step === 0 || picked) return;
    setAnswers((a) => a.slice(0, -1));
    setStep((s) => s - 1);
  }

  if (calculating) {
    return <Calculating />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl flex-col px-4 pb-10 pt-4">
      {/* Barra de progreso */}
      <div className="sticky top-16 z-10 -mx-4 bg-paper/80 px-4 pb-3 pt-2 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink-soft">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 enabled:hover:text-brand disabled:opacity-30"
            aria-label="Volver a la pregunta anterior"
          >
            ← Atrás
          </button>
          <span className="font-display">
            {step + 1}
            <span className="text-ink-soft/50">/{TOTAL_QUESTIONS}</span>
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full border-2 border-ink/10 bg-white">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div className="flex flex-1 flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <p className="font-display text-xs font-bold uppercase tracking-widest text-brand">
              Pregunta {question.id}
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {question.prompt}
            </h1>

            <div className="mt-6 space-y-3">
              {question.options.map((opt, i) => {
                const isPicked = picked === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    onClick={() => choose(opt.id, opt.points)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`sticker flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left ${
                      isPicked ? "bg-brand text-white" : "bg-white text-ink"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg font-display text-sm font-black ${
                        isPicked ? "bg-white/20 text-white" : "bg-brand-soft text-brand"
                      }`}
                    >
                      {OPTION_LETTERS[i]}
                    </span>
                    <span className="text-[15px] font-medium leading-snug">{opt.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Pantalla de "redoble de tambores" mientras se calcula el resultado. */
function Calculating() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-16 w-16 rounded-full border-4 border-brand-soft border-t-brand"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 font-display text-2xl font-extrabold"
      >
        Calculando tu resultado…
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-1 text-ink-soft"
      >
        Redoble de tambores 🥁
      </motion.p>
    </div>
  );
}
