import React, { useState, useEffect } from 'react';

interface Props {
  onSelect: (name: string, scryfallId: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const controller = new AbortController();
    fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setResults(data.data || []))
      .catch(() => {});
    return () => controller.abort();
  }, [query]);

  const handleSelect = async (name: string) => {
    try {
      const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
      const card = await res.json();
      onSelect(card.name, card.id);
      setQuery('');
      setResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        placeholder="Search cards..."
        onChange={e => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="autocomplete">
          {results.map(r => (
            <li key={r} onClick={() => handleSelect(r)}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
