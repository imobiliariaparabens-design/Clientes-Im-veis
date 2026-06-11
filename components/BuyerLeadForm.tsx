"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { CheckboxField } from "@/components/CheckboxField";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import type { BuyerLeadPayload } from "@/lib/validation";

type BuyerLeadFormProps = {
  initialOrigin: string;
};

type FormErrors = Partial<Record<keyof BuyerLeadPayload, string>>;

const initialForm: BuyerLeadPayload = {
  fullName: "",
  whatsapp: "",
  email: "",
  desiredPropertyType: "",
  city: "",
  neighborhoods: "",
  maxBudget: "",
  paymentMethod: "",
  needsFinancing: "",
  creditApproved: "",
  availableDownPayment: "",
  purchaseTimeline: "",
  bedrooms: "",
  needsGarage: "",
  propertyPreferences: "",
  bestContactTime: "",
  notes: "",
  consent: false,
  origin: "",
};

function formatWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const number = Number(digits);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(number);
}

function validateBuyerForm(form: BuyerLeadPayload) {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) errors.fullName = "Campo obrigatório.";
  if (!form.whatsapp.trim()) errors.whatsapp = "Campo obrigatório.";
  if (!form.desiredPropertyType.trim()) errors.desiredPropertyType = "Campo obrigatório.";
  if (!form.city.trim()) errors.city = "Campo obrigatório.";
  if (!form.maxBudget.trim()) errors.maxBudget = "Campo obrigatório.";
  if (!form.paymentMethod.trim()) errors.paymentMethod = "Campo obrigatório.";
  if (!form.purchaseTimeline.trim()) errors.purchaseTimeline = "Campo obrigatório.";
  if (!form.consent) errors.consent = "Confirme a autorização para continuar.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function BuyerLeadForm({ initialOrigin }: BuyerLeadFormProps) {
  const [form, setForm] = useState<BuyerLeadPayload>({
    ...initialForm,
    origin: initialOrigin,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const options = useMemo(() => ({
    propertyTypes: ["Casa", "Apartamento", "Terreno", "Sítio / Chácara", "Comercial", "Indiferente"],
    payment: ["À vista", "Financiamento", "FGTS", "Consórcio", "Ainda não sei"],
    yesNoMaybe: ["Sim", "Não", "Talvez / preciso conversar"],
    credit: ["Sim", "Não", "Em análise", "Não sei"],
    timeline: ["Imediato", "Até 30 dias", "1 a 3 meses", "3 a 6 meses", "Sem pressa"],
    bedrooms: ["1", "2", "3", "4 ou mais", "Indiferente"],
    garage: ["Sim", "Não", "Indiferente"],
    contact: ["Manhã", "Tarde", "Noite", "Qualquer horário"],
  }), []);

  function updateField<K extends keyof BuyerLeadPayload>(field: K, value: BuyerLeadPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateBuyerForm(form);
    if (!result.isValid) {
      setErrors(result.errors);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/submit-buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="rounded-lg border border-emerald-200 bg-white px-4 py-8 text-center shadow-sm sm:px-8 sm:py-10">
        <h2 className="text-xl font-bold leading-tight text-stone-950 sm:text-2xl">Cadastro recebido com sucesso.</h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-stone-700 sm:mt-4 sm:text-base sm:leading-7">
          Obrigado! Em breve nossa equipe poderá entrar em contato com opções de imóveis compatíveis com o seu perfil.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-lg border border-stone-200 bg-white px-4 py-5 shadow-sm sm:space-y-5 sm:px-8 sm:py-8">
      {status === "error" ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800" role="alert">
          Não foi possível enviar agora. Por favor, tente novamente ou entre em contato pelo WhatsApp da imobiliária.
        </div>
      ) : null}

      <FormSection title="1. Dados de contato">
        <InputField id="fullName" label="Nome completo" required value={form.fullName} error={errors.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
        <InputField id="whatsapp" label="WhatsApp" type="tel" inputMode="tel" required value={form.whatsapp} error={errors.whatsapp} onChange={(event) => updateField("whatsapp", formatWhatsApp(event.target.value))} />
        <InputField id="email" label="E-mail" type="email" value={form.email} error={errors.email} onChange={(event) => updateField("email", event.target.value)} />
        <SelectField id="bestContactTime" label="Melhor horário para contato" options={options.contact} value={form.bestContactTime} onChange={(event) => updateField("bestContactTime", event.target.value)} />
      </FormSection>

      <FormSection title="2. Imóvel desejado">
        <SelectField id="desiredPropertyType" label="Tipo de imóvel desejado" required options={options.propertyTypes} value={form.desiredPropertyType} error={errors.desiredPropertyType} onChange={(event) => updateField("desiredPropertyType", event.target.value)} />
        <InputField id="city" label="Cidade de interesse" required placeholder="Ex: Cachoeira do Sul" value={form.city} error={errors.city} onChange={(event) => updateField("city", event.target.value)} />
        <InputField id="neighborhoods" label="Bairros de interesse" placeholder="Ex: Centro, Soares, Marina" value={form.neighborhoods} onChange={(event) => updateField("neighborhoods", event.target.value)} />
        <InputField id="maxBudget" label="Valor máximo pretendido" required placeholder="Ex: R$ 300.000" inputMode="numeric" value={form.maxBudget} error={errors.maxBudget} onChange={(event) => updateField("maxBudget", formatCurrency(event.target.value))} />
        <SelectField id="bedrooms" label="Dormitórios" options={options.bedrooms} value={form.bedrooms} onChange={(event) => updateField("bedrooms", event.target.value)} />
        <SelectField id="needsGarage" label="Precisa de garagem?" options={options.garage} value={form.needsGarage} onChange={(event) => updateField("needsGarage", event.target.value)} />
        <TextareaField id="propertyPreferences" label="Preferências do imóvel" placeholder="Ex: pátio, suíte, piscina, próximo ao centro, aceita reforma, térreo, etc." value={form.propertyPreferences} onChange={(event) => updateField("propertyPreferences", event.target.value)} />
      </FormSection>

      <FormSection title="3. Compra e pagamento">
        <SelectField id="paymentMethod" label="Forma de pagamento" required options={options.payment} value={form.paymentMethod} error={errors.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)} />
        <SelectField id="needsFinancing" label="Precisa de financiamento?" options={options.yesNoMaybe} value={form.needsFinancing} onChange={(event) => updateField("needsFinancing", event.target.value)} />
        <SelectField id="creditApproved" label="Já possui crédito aprovado?" options={options.credit} value={form.creditApproved} onChange={(event) => updateField("creditApproved", event.target.value)} />
        <InputField id="availableDownPayment" label="Entrada disponível" placeholder="Ex: R$ 50.000" inputMode="numeric" value={form.availableDownPayment} onChange={(event) => updateField("availableDownPayment", formatCurrency(event.target.value))} />
        <SelectField id="purchaseTimeline" label="Prazo para compra" required options={options.timeline} value={form.purchaseTimeline} error={errors.purchaseTimeline} onChange={(event) => updateField("purchaseTimeline", event.target.value)} />
      </FormSection>

      <FormSection title="4. Observações e autorização">
        <TextareaField id="notes" label="Observações" placeholder="Conte algo importante para ajudarmos na busca do imóvel." value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
        <CheckboxField
          id="consent"
          label="Confirmo que autorizo a imobiliária a usar estas informações para contato comercial e indicação de imóveis compatíveis com meu interesse."
          required
          checked={form.consent}
          error={errors.consent}
          onChange={(event) => updateField("consent", event.target.checked)}
        />
      </FormSection>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="sticky bottom-3 z-10 w-full rounded-md bg-emerald-800 px-5 py-4 text-base font-bold text-white shadow-lg transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-stone-400 sm:static sm:shadow-sm"
      >
        {status === "submitting" ? "Enviando..." : "Enviar cadastro"}
      </button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0 space-y-3 border-t border-stone-200 pt-4 first:border-t-0 first:pt-0 sm:space-y-4 sm:pt-5">
      <h2 className="text-base font-bold leading-tight text-stone-950 sm:text-lg">{title}</h2>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">{children}</div>
    </section>
  );
}
