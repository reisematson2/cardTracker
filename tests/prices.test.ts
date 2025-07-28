import nock from 'nock';
import { fetchPrice } from '../src/controllers/prices';
import * as db from '../src/db';

jest.mock('../src/db');

const mockClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnValue({}),
  maybeSingle: jest.fn().mockReturnValue({}),
};

describe('fetchPrice', () => {
  beforeEach(() => {
    (db.getClient as jest.Mock).mockReturnValue(mockClient);
  });

  it('fetches prices from scryfall', async () => {
    nock('https://api.scryfall.com')
      .get('/cards/test')
      .reply(200, { prices: { usd: '2.00' } });
    const req: any = { body: { cardId: 1, scryfallId: 'test' } };
    const res: any = { json: jest.fn() };
    mockClient.select.mockReturnValueOnce({ data: { scryfall_id: 'test' } });
    mockClient.insert.mockReturnValueOnce({ select: () => ({ single: () => ({}) }) });
    await fetchPrice(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});

