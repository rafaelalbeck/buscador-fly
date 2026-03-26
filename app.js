const form = document.getElementById('searchForm');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const submitBtn = document.getElementById('submitBtn');

function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function renderResults(flights) {
  if (!flights || !flights.length) {
    resultsEl.innerHTML = '<div class="empty">Nenhum voo encontrado para essa busca.</div>';
    return;
  }

  resultsEl.innerHTML = flights.map(f => `
    <article class="result-card">
      <div class="row">
        <div>
          <div class="airline">${f.airline}</div>
          <div class="route">${f.origin} → ${f.destination}</div>
          <div class="meta">Saída: ${f.departureTime || '-'} · Chegada: ${f.arrivalTime || '-'} · Duração: ${f.duration || '-'} · Escalas: ${f.stops}</div>
          <div class="tag">Milhas em breve</div>
        </div>
        <div class="price">${formatBRL(f.priceReais)}</div>
      </div>
    </article>
  `).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Buscando voos reais...';
  statusEl.className = 'status';
  submitBtn.disabled = true;
  resultsEl.innerHTML = '';

  const payload = {
    origin: document.getElementById('origin').value.trim().toUpperCase(),
    destination: document.getElementById('destination').value.trim().toUpperCase(),
    departureDate: document.getElementById('departureDate').value,
    returnDate: document.getElementById('returnDate').value || undefined,
    adults: Number(document.getElementById('adults').value || 1),
    children: Number(document.getElementById('children').value || 0),
  };

  try {
    const res = await fetch('/api/search-flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Não foi possível buscar os voos.');
    }

    statusEl.textContent = `${data.flights.length} opção(ões) encontrada(s).`;
    renderResults(data.flights);
  } catch (err) {
    statusEl.textContent = err.message || 'Erro ao buscar voos.';
    statusEl.className = 'status error';
  } finally {
    submitBtn.disabled = false;
  }
});
