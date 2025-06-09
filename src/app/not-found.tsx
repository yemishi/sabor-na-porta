import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-card text-gray-800 px-6 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">Oops! Página não encontrada.</p>
      <p className="text-gray-500 mb-6">
        Parece que você se perdeu no caminho... mas não se preocupe, acontece até com os melhores!
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-xl text-lg font-medium hover:bg-primary/90 transition"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
