# cardTracker

Magic: The Gathering card price tracker backend using Express and Supabase.

## Setup

1. Install dependencies (requires internet access):
   ```bash
   npm install
   ```
2. Configure environment variables `SUPABASE_URL` and `SUPABASE_KEY`.
3. Build and start the server:
   ```bash
   npm run build
   npm start
   ```

## Database Schema

- **watchlist**
  - `id` (serial primary key)
  - `card_name` text
  - `scryfall_id` text
  - `added_at` timestamp

- **prices**
  - `id` (serial primary key)
  - `card_id` references watchlist(id)
  - `price` numeric
  - `source` text
  - `timestamp` timestamp

## Frontend

A React (TypeScript) frontend is provided in the `frontend` directory. It uses Vite and implements:

- Card search using the Scryfall autocomplete API.
- Watchlist grid showing each card's image, latest price and a notes field.
- Clicking a card displays its price history using Chart.js.
- Ability to add and remove cards via the backend API.

To run locally (requires internet access to install dependencies):

```bash
cd frontend
npm install
npm run dev
```

