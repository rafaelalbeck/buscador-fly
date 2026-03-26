# Buscador de passagens pronto para Vercel + Duffel

Este projeto já está organizado nos lugares certos.

## O que você precisa fazer

### 1. Subir esta pasta para o GitHub
Suba **todo o conteúdo** desta pasta para um repositório no GitHub.

### 2. Importar na Vercel
Na Vercel:
- clique em **Add New Project**
- escolha o repositório
- clique em **Deploy**

### 3. Adicionar o token da Duffel
Na Vercel, abra o projeto e vá em:
- **Settings**
- **Environment Variables**

Crie esta variável:

- **Name:** `DUFFEL_ACCESS_TOKEN`
- **Value:** cole seu token da Duffel

### 4. Fazer novo deploy
Depois de salvar a variável, faça um **Redeploy**.

### 5. Abrir o site
Abra a URL gerada pela Vercel.

## Estrutura correta dos arquivos

- `index.html` → tela principal
- `style.css` → visual do site
- `app.js` → faz a busca no frontend
- `api/search-flights.js` → rota da API
- `lib/duffel.js` → integração com a Duffel
- `vercel.json` → configuração da Vercel
- `.env.example` → exemplo do nome da variável

## Importante

- O campo de origem e destino usa **código de aeroporto**: `GRU`, `GIG`, `CGH`, `BSB` etc.
- A busca de **milhas** ainda não está integrada. Hoje o projeto busca **preços reais em dinheiro**.
- Sem o token `DUFFEL_ACCESS_TOKEN`, o site não vai funcionar.
