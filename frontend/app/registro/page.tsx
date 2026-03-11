import RegisterForm from "../../components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl">Registrarse</h1>
      <p className="text-ink/70 mt-3">Crea tu cuenta para comprar mas rapido.</p>
      <div className="mt-8 bg-white/70 border border-sand rounded-3xl p-6">
        <RegisterForm />
        <p className="text-sm text-center mt-4">
          Ya tienes cuenta? <Link href="/login" className="text-terracotta">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  );
}
