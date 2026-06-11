import { PropertyUpdateForm } from "@/components/PropertyUpdateForm";
import Link from "next/link";

type HomeProps = {
  searchParams: Promise<{
    codigo?: string;
    origem?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-50 px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-3 rounded-lg border border-stone-200 bg-white px-4 py-5 shadow-sm sm:mb-6 sm:px-8 sm:py-8">
          <div className="mb-2 flex items-center justify-between gap-3 sm:mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800 sm:text-sm">
              Imobiliária Para-Bens
            </p>
            <Link href="/compradores" className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline">
              Compradores
            </Link>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-stone-950 sm:text-4xl">
            Atualização de Cadastro de Imóvel
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-stone-700 sm:mt-4 sm:text-lg sm:leading-7">
            Para mantermos as informações corretas e melhorar a divulgação do seu imóvel, confirme ou atualize os dados abaixo.
          </p>
          <p className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-950 sm:mt-4 sm:px-4">
            As informações serão usadas apenas para atualização interna da imobiliária e divulgação autorizada do imóvel.
          </p>
        </header>

        <PropertyUpdateForm
          initialCode={params.codigo ?? ""}
          initialOrigin={params.origem ?? ""}
        />
      </div>
    </main>
  );
}
