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
