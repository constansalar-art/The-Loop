import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-black text-brand">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold">
        Esta página se fue a rendir un final
      </h1>
      <p className="mt-2 text-ink-soft">
        No encontramos lo que buscabas. Pero sí sabemos algo que te puede
        interesar…
      </p>
      <Link
        href="/test"
        className="sticker mt-6 inline-flex rounded-2xl bg-brand px-6 py-3.5 font-display font-bold text-white"
      >
        Hacer el test vocacional →
      </Link>
      <Link href="/" className="mt-3 text-sm font-semibold text-ink-soft hover:text-brand">
        Volver al inicio
      </Link>
    </div>
  );
}
