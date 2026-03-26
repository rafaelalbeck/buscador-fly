const DUFFEL_BASE_URL = 'https://api.duffel.com';

async function duffelFetch(path, options = {}) {
  const token = process.env.DUFFEL_ACCESS_TOKEN;

  if (!token) {
    const error = new Error('O token DUFFEL_ACCESS_TOKEN não foi configurado na Vercel.');
    error.status = 500;
    throw error;
  }

  const res = await fetch(`${DUFFEL_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Duffel-Version': 'v2',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const message = data?.errors?.[0]?.message || data?.message || 'Erro ao consultar a Duffel.';
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

async function searchFlights(params) {
  const slices = [
    {
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departureDate,
    },
  ];

  if (params.returnDate) {
    slices.push({
      origin: params.destination,
      destination: params.origin,
      departure_date: params.returnDate,
    });
  }

  const payload = {
    data: {
      slices,
      passengers: [
        ...Array.from({ length: Number(params.adults || 1) }, () => ({ type: 'adult' })),
        ...Array.from({ length: Number(params.children || 0) }, () => ({ type: 'child' })),
      ],
      cabin_class: 'economy',
      max_connections: 2,
    },
  };

  const created = await duffelFetch('/air/offer_requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const offers = created?.data?.offers || [];

  return offers.map((offer, index) => {
    const firstSlice = offer.slices?.[0];
    const firstSegment = firstSlice?.segments?.[0];
    const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1];

    return {
      id: offer.id || String(index),
      airline: firstSegment?.operating_carrier?.name || firstSegment?.marketing_carrier?.name || 'Companhia aérea',
      origin: firstSegment?.origin?.iata_code || params.origin,
      destination: lastSegment?.destination?.iata_code || params.destination,
      departureTime: firstSegment?.departing_at || '',
      arrivalTime: lastSegment?.arriving_at || '',
      duration: firstSlice?.duration || '',
      stops: Math.max((firstSlice?.segments?.length || 1) - 1, 0),
      priceReais: Number(offer.total_amount || 0),
      currency: offer.total_currency || 'BRL',
    };
  });
}

module.exports = { searchFlights };
