import { getClient } from '../db';

const supabase = getClient();

/**
 * Evaluate price alerts for a card.
 */
export async function evaluateAlerts(cardId: string) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: pastPrice } = await supabase
    .from('prices')
    .select('average')
    .eq('card_id', cardId)
    .lte('timestamp', sevenDaysAgo)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!pastPrice) return;

  const { data: latest } = await supabase
    .from('prices')
    .select('average, timestamp')
    .eq('card_id', cardId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();
  if (!latest) return;

  const change = ((latest.average - pastPrice.average) / pastPrice.average) * 100;
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('card_id', cardId)
    .is('triggered_at', null);

  if (!alerts) return;

  for (const alert of alerts) {
    if (
      (alert.direction === 'up' && change >= alert.threshold_pct) ||
      (alert.direction === 'down' && change <= -alert.threshold_pct)
    ) {
      await supabase
        .from('alerts')
        .update({ triggered_at: latest.timestamp })
        .eq('id', alert.id);
      // In real app, enqueue message/notification here
    }
  }
}

/**
 * Retrieve all pending alerts.
 */
export async function getAlerts(req: any, res: any) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .is('triggered_at', null);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

