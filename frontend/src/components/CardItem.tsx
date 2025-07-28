import React from 'react';

export interface WatchedCard {
  id: number;
  card_name: string;
  scryfall_id: string;
  image?: string;
  latestPrice?: number;
  note?: string;
}

interface Props {
  card: WatchedCard;
  onClick: () => void;
  onRemove: () => void;
  onNoteChange: (note: string) => void;
}

const CardItem: React.FC<Props> = ({ card, onClick, onRemove, onNoteChange }) => (
  <div className="card-item" onClick={onClick}>
    {card.image && <img src={card.image} alt={card.card_name} />}
    <div className="info">
      <span className="name">{card.card_name}</span>
      {card.latestPrice !== undefined && (
        <span className="price">${card.latestPrice.toFixed(2)}</span>
      )}
      <button className="remove" onClick={e => {e.stopPropagation(); onRemove();}}>×</button>
    </div>
    <input
      type="text"
      value={card.note || ''}
      placeholder="Notes / Tags"
      onClick={e => e.stopPropagation()}
      onChange={e => onNoteChange(e.target.value)}
    />
  </div>
);

export default CardItem;
