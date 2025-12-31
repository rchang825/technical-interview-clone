'use client';

import { useState, useMemo } from 'react';
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
interface DeckSummary {
  count: number,
  avg_hp: number,
  avg_attack: number,
  avg_defense: number,
  avg_special_attack: number,
  avg_special_defense: number,
  avg_speed: number,
  avg_total: number
}
export function DeckTable() {
  const { deck, setDeck, deckLoaded } = useDeck();
  const deckSummary = useMemo(() => {
    const meta: DeckSummary = {
      count: deck.length,
      avg_hp: 0,
      avg_attack: 0,
      avg_defense: 0,
      avg_special_attack: 0,
      avg_special_defense: 0,
      avg_speed: 0,
      avg_total: 0
    }
    if (deck.length === 0) {
      return meta;
    }
    deck.forEach((p) => {
      p.stats.forEach((st) => {
        switch (st.name) {
          case 'hp':
            meta.avg_hp += st.value;
            break;
          case 'attack':
            meta.avg_attack += st.value;
            break;
          case 'defense':
            meta.avg_defense += st.value;
            break;
          case 'special-attack':
            meta.avg_special_attack += st.value;
            break;
          case 'special-defense':
            meta.avg_special_defense += st.value;
            break;
          case 'speed':
            meta.avg_speed += st.value;
            break;
          default:
            break;
        }
      });
      meta.avg_total += p.total;
    });
    (Object.keys(meta) as (keyof DeckSummary)[]).forEach((key) => {
      if (key !== 'count') {
        meta[key] = meta[key]! / meta.count;
      }
    });
    console.log('deck summary:', meta);
    return meta;
  }, [deck]);

  const [error, setError] = useState<string>('');
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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) }
      {!deckLoaded && (
        <p className="text-sm text-surface-500">
          Loading your deck...
        </p>
      )}

      {deckLoaded && deck.length === 0 ? (
        <p className="text-sm text-red-700">
          Your deck is empty. Add some Pokemon from the Browser!
        </p>
      ) :
        <div>
          <div className="summary-pill mb-4">
            <div className="pill pill-soft">
              <p className="summary-label">Deck Size</p>
              <p className="summary-value">{deckSummary.count}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg HP</p>
              <p className="summary-value">{deckSummary.avg_hp}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg Atk</p>
              <p className="summary-value">{deckSummary.avg_attack}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg Def</p>
              <p className="summary-value">{deckSummary.avg_defense}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg Sp. Atk</p>
              <p className="summary-value">{deckSummary.avg_special_attack}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg Sp. Def</p>
              <p className="summary-value">{deckSummary.avg_special_defense}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg Spd</p>
              <p className="summary-value">{deckSummary.avg_speed}</p>
            </div>
            <div className="pill pill-soft">
              <p className="summary-label">Avg Total Stats</p>
              <p className="summary-value">{deckSummary.avg_total}</p>
            </div>
          </div>
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