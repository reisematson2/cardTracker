import { getClient } from '../db';

const supabase = getClient();

/**
 * Get all watched cards from the database.
 */
export async function getWatchlist(req: any, res: any) {
  const { data, error } = await supabase.from('watchlist').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

/**
 * Add a card to the watchlist.
 */
export async function addToWatchlist(req: any, res: any) {
  const { cardName, scryfallId } = req.body;
  const { data, error } = await supabase.from('watchlist').insert({
    card_name: cardName,
    scryfall_id: scryfallId,
    added_at: new Date().toISOString(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

/**
 * Remove a card from the watchlist by ID.
 */
export async function removeFromWatchlist(req: any, res: any) {
  const { id } = req.params;
  const { error } = await supabase.from('watchlist').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}
