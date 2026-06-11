export type PropertyUpdatePayload = {
  propertyCode: string;
  ownerName: string;
  whatsapp: string;
  email?: string;
  stillForSale: string;
  currentPrice: string;
  acceptsNegotiation: string;
  acceptsFinancing: string;
  acceptsExchange: string;
  acceptsVehicle: string;
  documentationOk: string;
  hasDeedRegistration: string;
  occupancy: string;
  keyLocation: string;
  keyHolderDetails?: string;
  authorizesAdvertising: string;
  authorizesSign: string;
  authorizesPhotosVideos: string;
  propertyChanges?: string;
  bestContactTime: string;
  notes?: string;
  consent: boolean;
  origin?: string;
};

export const REQUIRED_FIELDS: Array<keyof PropertyUpdatePayload> = [
  "propertyCode",
  "ownerName",
  "whatsapp",
  "stillForSale",
  "currentPrice",
  "authorizesAdvertising",
  "consent",
];

const optionalStringFields = [
  "email",
  "keyHolderDetails",
  "propertyChanges",
  "notes",
  "origin",
] as const;

const optionalAirtableFieldNames: Record<(typeof optionalStringFields)[number], string> = {
  email: "E-mail",
  keyHolderDetails: "Quem está com as chaves?",
  propertyChanges: "Alterações no imóvel",
  notes: "Observações",
  origin: "Origem",
};

export function sanitizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizePayload(input: unknown): PropertyUpdatePayload {
  const data = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};

  return {
    propertyCode: sanitizeString(data.propertyCode),
    ownerName: sanitizeString(data.ownerName),
    whatsapp: sanitizeString(data.whatsapp),
    email: sanitizeString(data.email),
    stillForSale: sanitizeString(data.stillForSale),
    currentPrice: sanitizeString(data.currentPrice),
    acceptsNegotiation: sanitizeString(data.acceptsNegotiation),
    acceptsFinancing: sanitizeString(data.acceptsFinancing),
    acceptsExchange: sanitizeString(data.acceptsExchange),
    acceptsVehicle: sanitizeString(data.acceptsVehicle),
    documentationOk: sanitizeString(data.documentationOk),
    hasDeedRegistration: sanitizeString(data.hasDeedRegistration),
    occupancy: sanitizeString(data.occupancy),
    keyLocation: sanitizeString(data.keyLocation),
    keyHolderDetails: sanitizeString(data.keyHolderDetails),
    authorizesAdvertising: sanitizeString(data.authorizesAdvertising),
    authorizesSign: sanitizeString(data.authorizesSign),
    authorizesPhotosVideos: sanitizeString(data.authorizesPhotosVideos),
    propertyChanges: sanitizeString(data.propertyChanges),
    bestContactTime: sanitizeString(data.bestContactTime),
    notes: sanitizeString(data.notes),
    consent: data.consent === true,
    origin: sanitizeString(data.origin),
  };
}

export function validatePropertyUpdate(input: unknown) {
  const payload = normalizePayload(input);
  const errors: Partial<Record<keyof PropertyUpdatePayload, string>> = {};

  for (const field of REQUIRED_FIELDS) {
    if (field === "consent") {
      if (!payload.consent) {
        errors.consent = "Confirme a autorização para continuar.";
      }
      continue;
    }

    if (!payload[field]) {
      errors[field] = "Campo obrigatório.";
    }
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (payload.occupancy === "Não, está vazio" && !payload.keyLocation) {
    errors.keyLocation = "Informe onde estão as chaves.";
  }

  if (payload.keyLocation === "Com terceiros" && !payload.keyHolderDetails) {
    errors.keyHolderDetails = "Informe quem está com as chaves.";
  }

  return {
    payload,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function toAirtableFields(payload: PropertyUpdatePayload) {
  const fields: Record<string, string | boolean> = {
    "Código do imóvel": payload.propertyCode,
    "Nome completo": payload.ownerName,
    "WhatsApp": payload.whatsapp,
    "Imóvel ainda está à venda?": payload.stillForSale,
    "Valor atual pretendido": payload.currentPrice,
    "Aceita negociação?": payload.acceptsNegotiation,
    "Aceita financiamento?": payload.acceptsFinancing,
    "Aceita permuta?": payload.acceptsExchange,
    "Aceita veículo?": payload.acceptsVehicle,
    "Documentação em dia?": payload.documentationOk,
    "Escritura/registro?": payload.hasDeedRegistration,
    "Imóvel ocupado?": payload.occupancy,
    "Localização das chaves": payload.keyLocation,
    "Autoriza divulgação?": payload.authorizesAdvertising,
    "Autoriza placa?": payload.authorizesSign,
    "Autoriza fotos/vídeos?": payload.authorizesPhotosVideos,
    "Melhor horário para contato": payload.bestContactTime,
    "Consentimento": payload.consent,
    "Data de envio": new Date().toISOString(),
    "Origem": payload.origin || "Página Web Atualização Proprietário",
  };

  for (const field of optionalStringFields) {
    const value = payload[field];
    if (typeof value === "string" && value) {
      fields[optionalAirtableFieldNames[field]] = value;
    }
  }

  return fields;
}

export type BuyerLeadPayload = {
  fullName: string;
  whatsapp: string;
  email?: string;
  desiredPropertyType: string;
  city: string;
  neighborhoods?: string;
  maxBudget: string;
  paymentMethod: string;
  needsFinancing: string;
  creditApproved: string;
  availableDownPayment?: string;
  purchaseTimeline: string;
  bedrooms: string;
  needsGarage: string;
  propertyPreferences?: string;
  bestContactTime: string;
  notes?: string;
  consent: boolean;
  origin?: string;
};

export const REQUIRED_BUYER_FIELDS: Array<keyof BuyerLeadPayload> = [
  "fullName",
  "whatsapp",
  "desiredPropertyType",
  "city",
  "maxBudget",
  "paymentMethod",
  "purchaseTimeline",
  "consent",
];

const optionalBuyerStringFields = [
  "email",
  "neighborhoods",
  "availableDownPayment",
  "propertyPreferences",
  "notes",
  "origin",
] as const;

const optionalBuyerAirtableFieldNames: Record<(typeof optionalBuyerStringFields)[number], string> = {
  email: "E-mail",
  neighborhoods: "Bairros de interesse",
  availableDownPayment: "Entrada disponível",
  propertyPreferences: "Preferências do imóvel",
  notes: "Observações",
  origin: "Origem",
};

export function normalizeBuyerPayload(input: unknown): BuyerLeadPayload {
  const data = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};

  return {
    fullName: sanitizeString(data.fullName),
    whatsapp: sanitizeString(data.whatsapp),
    email: sanitizeString(data.email),
    desiredPropertyType: sanitizeString(data.desiredPropertyType),
    city: sanitizeString(data.city),
    neighborhoods: sanitizeString(data.neighborhoods),
    maxBudget: sanitizeString(data.maxBudget),
    paymentMethod: sanitizeString(data.paymentMethod),
    needsFinancing: sanitizeString(data.needsFinancing),
    creditApproved: sanitizeString(data.creditApproved),
    availableDownPayment: sanitizeString(data.availableDownPayment),
    purchaseTimeline: sanitizeString(data.purchaseTimeline),
    bedrooms: sanitizeString(data.bedrooms),
    needsGarage: sanitizeString(data.needsGarage),
    propertyPreferences: sanitizeString(data.propertyPreferences),
    bestContactTime: sanitizeString(data.bestContactTime),
    notes: sanitizeString(data.notes),
    consent: data.consent === true,
    origin: sanitizeString(data.origin),
  };
}

export function validateBuyerLead(input: unknown) {
  const payload = normalizeBuyerPayload(input);
  const errors: Partial<Record<keyof BuyerLeadPayload, string>> = {};

  for (const field of REQUIRED_BUYER_FIELDS) {
    if (field === "consent") {
      if (!payload.consent) {
        errors.consent = "Confirme a autorização para continuar.";
      }
      continue;
    }

    if (!payload[field]) {
      errors[field] = "Campo obrigatório.";
    }
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  return {
    payload,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function toBuyerAirtableFields(payload: BuyerLeadPayload) {
  const fields: Record<string, string | boolean> = {
    "Nome completo": payload.fullName,
    "WhatsApp": payload.whatsapp,
    "Tipo de imóvel desejado": payload.desiredPropertyType,
    "Cidade de interesse": payload.city,
    "Valor máximo": payload.maxBudget,
    "Forma de pagamento": payload.paymentMethod,
    "Precisa de financiamento?": payload.needsFinancing,
    "Crédito aprovado?": payload.creditApproved,
    "Prazo para compra": payload.purchaseTimeline,
    "Dormitórios": payload.bedrooms,
    "Garagem?": payload.needsGarage,
    "Melhor horário para contato": payload.bestContactTime,
    "Consentimento": payload.consent,
    "Data de envio": new Date().toISOString(),
    "Origem": payload.origin || "Página Web Cadastro Comprador",
  };

  for (const field of optionalBuyerStringFields) {
    const value = payload[field];
    if (typeof value === "string" && value) {
      fields[optionalBuyerAirtableFieldNames[field]] = value;
    }
  }

  return fields;
}
