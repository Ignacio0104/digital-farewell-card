import { signIn } from "@/auth";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-2xl text-[#23262B]">Iniciar sesión</h1>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl ?? "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42]"
          >
            Continuar con Google
          </button>
        </form>
      </div>
    </main>
  );
}
