import React from 'react';
import CardItem, { WatchedCard } from './CardItem';

interface Props {
  cards: WatchedCard[];
  onSelect: (card: WatchedCard) => void;
  onRemove: (id: number) => void;
  onNoteChange: (id: number, note: string) => void;
}

const WatchlistGrid: React.FC<Props> = ({ cards, onSelect, onRemove, onNoteChange }) => (
  <div className="grid">
    {cards.map(card => (
      <CardItem
        key={card.id}
        card={card}
        onClick={() => onSelect(card)}
        onRemove={() => onRemove(card.id)}
        onNoteChange={(note) => onNoteChange(card.id, note)}
      />
    ))}
  </div>
);

export default WatchlistGrid;
