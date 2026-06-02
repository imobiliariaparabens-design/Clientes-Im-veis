import { PropertyUpdateForm } from "@/components/PropertyUpdateForm";

type HomeProps = {
  searchParams: Promise<{
    codigo?: string;
    origem?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 rounded-lg border border-stone-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-emerald-800">
            Imobiliária Para-Bens
          </p>
          <h1 className="text-3xl font-bold text-stone-950 sm:text-4xl">
            Atualização de Cadastro de Imóvel
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-700 sm:text-lg">
            Para mantermos as informações corretas e melhorar a divulgação do seu imóvel, confirme ou atualize os dados abaixo.
          </p>
          <p className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">
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
