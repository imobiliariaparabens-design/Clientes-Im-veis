import { NextResponse } from "next/server";
import { toBuyerAirtableFields, validateBuyerLead } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const validation = validateBuyerLead(body);
  if (!validation.isValid) {
    return NextResponse.json({ error: "Dados inválidos.", fields: validation.errors }, { status: 400 });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_BUYERS_TABLE_NAME;

  if (!token || !baseId || !tableName) {
    return NextResponse.json({ error: "Configuração interna incompleta." }, { status: 500 });
  }

  try {
    const airtableUrl = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`;
    const response = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: toBuyerAirtableFields(validation.payload),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao enviar para o Airtable." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
