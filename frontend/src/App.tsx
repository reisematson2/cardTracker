import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WatchlistGrid from './components/WatchlistGrid';
import PriceChart from './components/PriceChart';
import { WatchedCard } from './components/CardItem';
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

interface PricePoint {
  timestamp: string;
  price: number;
}

const App: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<WatchedCard | null>(null);
  const [prices, setPrices] = useState<PricePoint[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const enrichCard = async (c: any): Promise<WatchedCard> => {
    const res = await fetch(`https://api.scryfall.com/cards/${c.scryfall_id}`);
    const cardData = await res.json();
    let latestPrice: number | undefined = undefined;
    try {
      const pricesRes = await fetch(`${API_BASE}/prices/${c.id}`);
      const priceData = await pricesRes.json();
      if (priceData.length > 0) {
        latestPrice = priceData[priceData.length - 1].price;
      }
    } catch {}
    return {
      ...c,
      image: cardData.image_uris?.small || cardData.image_uris?.normal,
      latestPrice,
    };
  };

  const loadWatchlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/watchlist`);
      const data = await res.json();
      const enriched = await Promise.all(data.map((c: any) => enrichCard(c)));
      setWatchlist(enriched);
    } catch (err) {
      console.error(err);
    }
  };

  const addCard = async (name: string, scryfallId: string) => {
    try {
      const res = await fetch(`${API_BASE}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName: name, scryfallId }),
      });
      if (!res.ok) return;
      const card = await res.json();
      const enriched = await enrichCard(card);
      setWatchlist([...watchlist, enriched]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeCard = async (id: number) => {
    try {
      await fetch(`${API_BASE}/watchlist/${id}`, { method: 'DELETE' });
      setWatchlist(watchlist.filter((c) => c.id !== id));
      if (selectedCard && selectedCard.id === id) setSelectedCard(null);
    } catch (err) {
      console.error(err);
    }
  };

  const updateNote = (id: number, note: string) => {
    setWatchlist(watchlist.map((c) => (c.id === id ? { ...c, note } : c)));
  };

  const loadPrices = async (card: WatchedCard) => {
    setSelectedCard(card);
    try {
      const res = await fetch(`${API_BASE}/prices/${card.id}`);
      const data = await res.json();
      setPrices(data.map((p: any) => ({ timestamp: p.timestamp, price: p.price })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <SearchBar onSelect={addCard} />
      <WatchlistGrid
        cards={watchlist}
        onSelect={loadPrices}
        onRemove={removeCard}
        onNoteChange={updateNote}
      />
      {selectedCard && <PriceChart card={selectedCard} data={prices} />}
    </div>
  );
};

export default App;
