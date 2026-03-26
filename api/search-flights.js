const { searchFlights } = require('../lib/duffel');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { origin, destination, departureDate, returnDate, adults, children } = req.body || {};

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'Preencha origem, destino e data de ida.' });
    }

    const flights = await searchFlights({
      origin: String(origin).toUpperCase(),
      destination: String(destination).toUpperCase(),
      departureDate,
      returnDate,
      adults: Number(adults || 1),
      children: Number(children || 0),
    });

    return res.status(200).json({ flights });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message || 'Erro interno ao buscar voos.' });
  }
};
