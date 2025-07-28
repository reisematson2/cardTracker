import { getClient } from '../db';
import fetch from 'node-fetch';
import { evaluateAlerts } from './alerts';

const supabase = getClient();

interface PriceResult {
  low: number;
  average: number;
  high: number;
  source: string;
}

/**
 * Retrieve price data for a card.
 *
 * @param scryfallId - Scryfall ID of the card
 */
async function fetchPriceFromAPI(scryfallId: string): Promise<PriceResult> {
  if (process.env.TCGPLAYER_KEY) {
    // Real integration would go here using the TCGPlayer API.
    const price = parseFloat((Math.random() * 99 + 1).toFixed(2));
    return { low: price, average: price, high: price, source: 'tcgplayer' };
  }

  const resp = await fetch(`https://api.scryfall.com/cards/${scryfallId}`);
  const json = await resp.json();
  const usd = parseFloat(json.prices.usd || '0');
  return { low: usd, average: usd, high: usd, source: 'scryfall' };
}

/**
 * Fetch the current price for a card and persist it.
 */
export async function fetchPrice(req: any, res: any) {
  const { cardId, scryfallId } = req.body;
  let id = cardId;
  let sfId = scryfallId;

  // If scryfallId provided, look up card ID
  if (!id && scryfallId) {
    const { data, error } = await supabase.from('watchlist').select('id').eq('scryfall_id', scryfallId).single();
    if (error || !data) return res.status(404).json({ error: 'Card not found' });
    id = data.id;
  }

  if (id && !sfId) {
    const { data } = await supabase.from('watchlist').select('scryfall_id').eq('id', id).single();
    sfId = data ? data.scryfall_id : undefined;
  }

  if (!id || !sfId) return res.status(400).json({ error: 'cardId or scryfallId required' });

  const priceData = await fetchPriceFromAPI(sfId);

  const { data, error } = await supabase.from('prices').insert({
    card_id: id,
    low: priceData.low,
    average: priceData.average,
    high: priceData.high,
    source: priceData.source,
    timestamp: new Date().toISOString(),
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  await evaluateAlerts(id);
  res.json(data);
}

/**
 * Get all stored prices for a card ordered by timestamp.
 */
/**
 * Retrieve all stored prices for a card ordered by timestamp.
 */
export async function getPrices(req: any, res: any) {
  const { cardId } = req.params;
  const { data, error } = await supabase.from('prices').select('*').eq('card_id', cardId).order('timestamp');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}
