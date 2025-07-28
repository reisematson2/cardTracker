import { getClient } from '../db';

const supabase = getClient();

/** Simulate fetching price from an API. */
async function fetchPriceFromAPI(cardId: string): Promise<number> {
  // In production, call TCGPlayer API here.
  // Simulate random price between 1 and 100 for now.
  return parseFloat((Math.random() * 99 + 1).toFixed(2));
}

/**
 * Fetch current price for a card and store it in the database.
 */
export async function fetchPrice(req: any, res: any) {
  const { cardId, scryfallId } = req.body;
  let id = cardId;

  // If scryfallId provided, look up card ID
  if (!id && scryfallId) {
    const { data, error } = await supabase.from('watchlist').select('id').eq('scryfall_id', scryfallId).single();
    if (error || !data) return res.status(404).json({ error: 'Card not found' });
    id = data.id;
  }

  if (!id) return res.status(400).json({ error: 'cardId or scryfallId required' });

  const price = await fetchPriceFromAPI(id);

  const { data, error } = await supabase.from('prices').insert({
    card_id: id,
    price,
    source: 'simulated',
    timestamp: new Date().toISOString(),
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

/**
 * Get all stored prices for a card ordered by timestamp.
 */
export async function getPrices(req: any, res: any) {
  const { cardId } = req.params;
  const { data, error } = await supabase.from('prices').select('*').eq('card_id', cardId).order('timestamp');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}
