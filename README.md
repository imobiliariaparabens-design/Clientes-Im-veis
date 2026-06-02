# Para-Bens - Atualização de Cadastro de Imóvel

Aplicação web pública para proprietários e vendedores atualizarem dados de imóveis da imobiliária Para-Bens, de Cachoeira do Sul/RS. O formulário é otimizado para celular, pode receber o código do imóvel por query string e envia os dados para o Airtable por uma API interna do Next.js.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- API route server-side
- Airtable via `fetch` nativo
- Pronto para deploy na Vercel

## Instalar dependências

```bash
npm install
```

## Configurar ambiente local

Crie um arquivo `.env.local` na raiz do projeto com base no `.env.example`:

```bash
AIRTABLE_TOKEN=pat_xxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxxxx
AIRTABLE_TABLE_NAME=Imoveis
```

Importante: não use `NEXT_PUBLIC_` para o token. A variável `AIRTABLE_TOKEN` é lida apenas na API route server-side em `app/api/submit-property/route.ts`.

## Configurar a tabela no Airtable

Crie uma tabela no Airtable com o nome informado em `AIRTABLE_TABLE_NAME`. Os campos esperados são:

- Código do imóvel
- Nome completo
- WhatsApp
- E-mail
- Imóvel ainda está à venda?
- Valor atual pretendido
- Aceita negociação?
- Aceita financiamento?
- Aceita permuta?
- Aceita veículo?
- Documentação em dia?
- Escritura/registro?
- Imóvel ocupado?
- Autoriza divulgação?
- Autoriza placa?
- Autoriza fotos/vídeos?
- Alterações no imóvel
- Melhor horário para contato
- Observações
- Consentimento
- Data de envio
- Origem

Os campos podem ser criados como texto curto ou texto longo, conforme fizer sentido. `Consentimento` pode ser checkbox, e `Data de envio` pode ser data/hora.

## Rodar localmente

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Também é possível preencher automaticamente o código do imóvel pela URL:

```text
http://localhost:3000?codigo=IMV-0001
```

E informar uma origem personalizada:

```text
http://localhost:3000?codigo=IMV-0001&origem=whatsapp
```

## Testar build

```bash
npm run build
```

## Deploy pelo GitHub + Vercel

1. Suba o projeto para um repositório no GitHub.
2. No painel da Vercel, clique em `Add New Project`.
3. Importe o repositório do GitHub.
4. Em `Environment Variables`, configure:
   - `AIRTABLE_TOKEN`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE_NAME`
5. Faça o deploy.

A Vercel detecta o Next.js automaticamente. Após o deploy, teste o formulário com um imóvel real ou de teste e confirme se o registro apareceu na tabela do Airtable.

## Segurança

- O token do Airtable nunca é enviado ao navegador.
- O front-end chama apenas `/api/submit-property`.
- A API valida campos obrigatórios novamente antes de enviar ao Airtable.
- Erros retornam mensagens simples, sem expor token ou dados sensíveis.
