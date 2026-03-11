import LoginForm from "../../components/LoginForm";
import Link from "next/link";

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return (
    <section className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Iniciar sesión</h1>
      <p className="text-ink/70 mt-3">Accede para continuar con tu compra.</p>
      <div className="mt-8 bg-white/70 border border-sand rounded-3xl p-6">
        <LoginForm redirect={searchParams?.redirect} />
        <p className="text-sm text-center mt-4">
          No tienes cuenta? <Link href="/registro" className="text-terracotta">Registrarse</Link>
        </p>
      </div>
    </section>
  );
}
