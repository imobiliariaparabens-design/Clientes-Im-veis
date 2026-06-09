"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { CheckboxField } from "@/components/CheckboxField";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { PropertyUpdatePayload, validatePropertyUpdate } from "@/lib/validation";

type PropertyUpdateFormProps = {
  initialCode: string;
  initialOrigin: string;
};

type FormErrors = Partial<Record<keyof PropertyUpdatePayload, string>>;

const initialForm: PropertyUpdatePayload = {
  propertyCode: "",
  ownerName: "",
  whatsapp: "",
  email: "",
  stillForSale: "",
  currentPrice: "",
  acceptsNegotiation: "",
  acceptsFinancing: "",
  acceptsExchange: "",
  acceptsVehicle: "",
  documentationOk: "",
  hasDeedRegistration: "",
  occupancy: "",
  keyLocation: "",
  keyHolderDetails: "",
  authorizesAdvertising: "",
  authorizesSign: "",
  authorizesPhotosVideos: "",
  propertyChanges: "",
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

export function PropertyUpdateForm({ initialCode, initialOrigin }: PropertyUpdateFormProps) {
  const [form, setForm] = useState<PropertyUpdatePayload>({
    ...initialForm,
    propertyCode: initialCode,
    origin: initialOrigin,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const fieldGroups = useMemo(() => ({
    sale: {
      yesNoMaybe: ["Sim", "Não", "Talvez / quero conversar"],
      negotiation: ["Sim", "Não", "Depende da proposta"],
      yesNoUnknown: ["Sim", "Não", "Não sei"],
      yesNoMaybeShort: ["Sim", "Não", "Talvez"],
    },
    docs: {
      documentation: ["Sim", "Não", "Não sei / precisa verificar"],
      occupancy: ["Sim, pelo proprietário", "Sim, por inquilino", "Não, está vazio"],
      keyLocation: ["Com proprietário", "Com terceiros", "Não se aplica / imóvel ocupado"],
    },
    advertising: ["Sim", "Não", "Quero conversar antes"],
    contact: ["Manhã", "Tarde", "Noite", "Qualquer horário"],
  }), []);

  function updateField<K extends keyof PropertyUpdatePayload>(field: K, value: PropertyUpdatePayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validatePropertyUpdate(form);
    if (!result.isValid) {
      setErrors(result.errors);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setErrors({});

    try {
      const response = await fetch("/api/submit-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.payload),
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
        <h2 className="text-xl font-bold leading-tight text-stone-950 sm:text-2xl">Cadastro atualizado com sucesso.</h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-stone-700 sm:mt-4 sm:text-base sm:leading-7">
          Obrigado! Em breve nossa equipe poderá entrar em contato para confirmar as informações.
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

      <FormSection title="1. Dados de identificação">
        <InputField
          id="propertyCode"
          label="Código do imóvel"
          required
          placeholder="Ex: IMV-0001"
          value={form.propertyCode}
          error={errors.propertyCode}
          onChange={(event) => updateField("propertyCode", event.target.value)}
        />
        <InputField
          id="ownerName"
          label="Nome completo do proprietário"
          required
          value={form.ownerName}
          error={errors.ownerName}
          onChange={(event) => updateField("ownerName", event.target.value)}
        />
        <InputField
          id="whatsapp"
          label="WhatsApp atualizado"
          type="tel"
          inputMode="tel"
          required
          value={form.whatsapp}
          error={errors.whatsapp}
          onChange={(event) => updateField("whatsapp", formatWhatsApp(event.target.value))}
        />
        <InputField
          id="email"
          label="E-mail"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </FormSection>

      <FormSection title="2. Situação do imóvel">
        <SelectField id="stillForSale" label="O imóvel ainda está à venda?" required options={fieldGroups.sale.yesNoMaybe} value={form.stillForSale} error={errors.stillForSale} onChange={(event) => updateField("stillForSale", event.target.value)} />
        <InputField id="currentPrice" label="Valor atual pretendido" required placeholder="Ex: R$ 300.000" inputMode="numeric" value={form.currentPrice} error={errors.currentPrice} onChange={(event) => updateField("currentPrice", formatCurrency(event.target.value))} />
        <SelectField id="acceptsNegotiation" label="Aceita negociação?" options={fieldGroups.sale.negotiation} value={form.acceptsNegotiation} onChange={(event) => updateField("acceptsNegotiation", event.target.value)} />
        <SelectField id="acceptsFinancing" label="Aceita financiamento?" options={fieldGroups.sale.yesNoUnknown} value={form.acceptsFinancing} onChange={(event) => updateField("acceptsFinancing", event.target.value)} />
        <SelectField id="acceptsExchange" label="Aceita permuta?" options={fieldGroups.sale.yesNoMaybeShort} value={form.acceptsExchange} onChange={(event) => updateField("acceptsExchange", event.target.value)} />
        <SelectField id="acceptsVehicle" label="Aceita veículo como parte do pagamento?" options={fieldGroups.sale.yesNoMaybeShort} value={form.acceptsVehicle} onChange={(event) => updateField("acceptsVehicle", event.target.value)} />
      </FormSection>

      <FormSection title="3. Documentação e ocupação">
        <SelectField id="documentationOk" label="A documentação está em dia?" options={fieldGroups.docs.documentation} value={form.documentationOk} onChange={(event) => updateField("documentationOk", event.target.value)} />
        <SelectField id="hasDeedRegistration" label="Possui escritura/registro?" options={fieldGroups.sale.yesNoUnknown} value={form.hasDeedRegistration} onChange={(event) => updateField("hasDeedRegistration", event.target.value)} />
        <SelectField id="occupancy" label="O imóvel está ocupado?" options={fieldGroups.docs.occupancy} value={form.occupancy} onChange={(event) => updateField("occupancy", event.target.value)} />
        <SelectField
          id="keyLocation"
          label="Onde estão as chaves do imóvel?"
          required={form.occupancy === "Não, está vazio"}
          options={fieldGroups.docs.keyLocation}
          value={form.keyLocation}
          error={errors.keyLocation}
          onChange={(event) => updateField("keyLocation", event.target.value)}
        />
        {form.keyLocation === "Com terceiros" ? (
          <InputField
            id="keyHolderDetails"
            label="Quem está com as chaves?"
            required
            placeholder="Nome e telefone, se souber"
            value={form.keyHolderDetails}
            error={errors.keyHolderDetails}
            onChange={(event) => updateField("keyHolderDetails", event.target.value)}
          />
        ) : null}
      </FormSection>

      <FormSection title="4. Divulgação">
        <SelectField id="authorizesAdvertising" label="Autoriza divulgação em site e redes sociais?" required options={fieldGroups.advertising} value={form.authorizesAdvertising} error={errors.authorizesAdvertising} onChange={(event) => updateField("authorizesAdvertising", event.target.value)} />
        <SelectField id="authorizesSign" label="Autoriza colocação de placa?" options={fieldGroups.advertising} value={form.authorizesSign} onChange={(event) => updateField("authorizesSign", event.target.value)} />
        <SelectField id="authorizesPhotosVideos" label="Autoriza nova visita para fotos ou vídeos?" options={fieldGroups.advertising} value={form.authorizesPhotosVideos} onChange={(event) => updateField("authorizesPhotosVideos", event.target.value)} />
        <TextareaField id="propertyChanges" label="O imóvel teve alguma alteração desde o último cadastro?" placeholder="Ex: reforma, pintura, troca de telhado, mudança de valor, nova construção, etc." value={form.propertyChanges} onChange={(event) => updateField("propertyChanges", event.target.value)} />
      </FormSection>

      <FormSection title="5. Contato">
        <SelectField id="bestContactTime" label="Melhor horário para contato" options={fieldGroups.contact} value={form.bestContactTime} onChange={(event) => updateField("bestContactTime", event.target.value)} />
        <TextareaField id="notes" label="Observações" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
      </FormSection>

      <FormSection title="6. Consentimento">
        <CheckboxField
          id="consent"
          label="Confirmo que as informações acima são verdadeiras e autorizo a imobiliária a usá-las para atualização cadastral e contato comercial."
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
        {status === "submitting" ? "Enviando..." : "Enviar atualização"}
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
