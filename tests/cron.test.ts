import fetch from 'node-fetch';
import { updateAllPrices } from '../src/cron';
import * as db from '../src/db';

jest.mock('node-fetch');
jest.mock('../src/db');

const mockedFetch = fetch as unknown as jest.Mock;

describe('updateAllPrices', () => {
  it('hits fetch-price for each watchlist entry', async () => {
    (db.getClient as jest.Mock).mockReturnValue({
      from: () => ({ select: () => ({ data: [{ id: 1, scryfall_id: 'x' }] }) })
    });
    mockedFetch.mockResolvedValue({});
    await updateAllPrices();
    expect(mockedFetch).toHaveBeenCalled();
  });
});

