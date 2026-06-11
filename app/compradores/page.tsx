import Link from "next/link";
import { BuyerLeadForm } from "@/components/BuyerLeadForm";

type BuyersPageProps = {
  searchParams: Promise<{
    origem?: string;
  }>;
};

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone-50 px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-3 rounded-lg border border-stone-200 bg-white px-4 py-5 shadow-sm sm:mb-6 sm:px-8 sm:py-8">
          <div className="mb-2 flex items-center justify-between gap-3 sm:mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800 sm:text-sm">
              Imobiliária Para-Bens
            </p>
            <Link href="/" className="text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline">
              Proprietários
            </Link>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-stone-950 sm:text-4xl">
            Cadastro de Interesse em Imóvel
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-stone-700 sm:mt-4 sm:text-lg sm:leading-7">
            Informe o tipo de imóvel que você procura para que nossa equipe possa entrar em contato com opções compatíveis.
          </p>
          <p className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-950 sm:mt-4 sm:px-4">
            Seus dados serão usados apenas para atendimento comercial da imobiliária e indicação de imóveis conforme seu perfil.
          </p>
        </header>

        <BuyerLeadForm initialOrigin={params.origem ?? ""} />
      </div>
    </main>
  );
}
