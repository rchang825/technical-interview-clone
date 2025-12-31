'use client';

import { useState } from 'react';
import PokemonCard from './PokemonCard';
import { removeFromDeck } from '@/lib/deckApi';
import { useDeck } from './DeckContext';

interface Stat {
  name: string,
  value: number
}
interface Pokemon {
  id: number,
  name: string,
  image: string,
  types: string[],
  stats: Stat[],
  total: number
}

export function DeckTable() {
  const { deck, setDeck } = useDeck();
  const [error, setError] = useState<string>(
    deck.length === 0
      ? 'Your deck is empty. Please add some Pokemon to your deck.'
      : ''
  );
  async function removeHandler(entry: Pokemon): Promise<void> {
    console.log(`removing ${entry.name} from deck...`);
    try {
      // call db to remove pokemon from deck
      await removeFromDeck(entry);
      // update global state
      setDeck(deck.filter(p => p.id !== entry.id));
      if (deck.length === 0) {
        setError('Your deck is empty. Please add some Pokemon to your deck.');
      } else {
        setError('');
      }
    } catch (err) {
      console.error(`Error removing ${entry.name} from deck:`, err);
      setError(`Failed to remove ${entry.name} from deck.`);
    }
  }

  return (
    <section className="panel gap-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-surface-900">
            My Pokemon Deck
          </h2>
          <p className="text-sm text-surface-500">
            View, search, sort, edit pokemon in deck
          </p>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) :
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {deck.map((entry: Pokemon) => (
            <PokemonCard
              key={entry.name} entry={entry}
              buttonContent='Remove from deck'
              buttonClickHandler={() => {
                removeHandler(entry);
              }}
            />
          ))}
        </div>
      }
    </section>
  );
};

/*
 * TODO: Create the deck table component with the following features:
 * - Integrate global state management to access the current deck of Pokemon.
 * - Accept deck data (array of Pokemon) and render rows with id, name, types, stats, and total.
 * - Provide search/filter by name or type.
 * - Support sortable columns: name, types, each stat key, and total (toggle asc/desc).
 * - Show a deck summary pill with count and average stats across the deck.
 * - Include a remove action per row to drop a Pokemon from the deck.
 * - Handle the empty state gracefully with a helpful message.
 * - Preserve styling hooks used previously (table headers, hover states, pills, summary pill).
 */