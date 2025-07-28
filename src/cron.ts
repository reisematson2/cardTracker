import cron from 'node-cron';
import fetch from 'node-fetch';
import { getClient } from './db';

const supabase = getClient();

/**
 * Call the existing `/fetch-price` endpoint for a card.
 *
 * @param cardId - ID of the card in the watchlist
 * @param scryfallId - Scryfall ID of the card
 */
async function callFetchPrice(cardId: string, scryfallId: string): Promise<void> {
  await fetch(`http://localhost:${process.env.PORT || 3000}/fetch-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, scryfallId })
  });
}

/**
 * Fetch all cards from the watchlist and trigger a price fetch for each.
 */
export async function updateAllPrices(): Promise<void> {
  const { data, error } = await supabase.from('watchlist').select('id, scryfall_id');
  if (error || !data) return;
  for (const card of data) {
    await callFetchPrice(card.id, card.scryfall_id);
  }
}

/**
 * Start the scheduled cron job that updates prices daily at midnight.
 */
export function startPriceCron(): void {
  cron.schedule('0 0 * * *', () => {
    updateAllPrices().catch(err => console.error('Cron update error', err));
  });
}

