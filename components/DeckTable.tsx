'use client';

import { useState, useMemo } from 'react';
import PokemonRow from './PokemonRow';
import { removeFromDeck, getFilteredDeck } from '@/lib/deckApi';
import { useDeck } from './DeckContext';
import Sort from './Sort';

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
  const [error, setError] = useState<string>('');
  const [asc, setAsc] = useState<boolean>(true);
  const [sortCriteria, setSortCriteria] = useState<string>('name');
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [filteredDeck, setFilteredDeck] = useState<Pokemon[] | null>(null);

  function applySearch(list: Pokemon[], term: string): Pokemon[] {
    const q = term.trim().toLowerCase();
    if (!q) return list;
    const searchedList = list.filter((p) => p.name.toLowerCase().includes(q));
    if (searchedList.length === 0) {
      setError(`No pokemon found matching "${term}"`);
    } else {
      setError('');
    }
    return searchedList;
  }

  function applySort(list: Pokemon[], criteria: string, asc: boolean): Pokemon[] {
    const arr = [...list];
    switch (criteria) {
      case 'id':
        arr.sort((a, b) => (asc ? a.id - b.id : b.id - a.id));
        break;
      case 'name':
        arr.sort((a, b) => (asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
        break;
      case 'type': {
        arr.sort((a, b) => {
          const aTypes = [...a.types].sort();
          const bTypes = [...b.types].sort();
          const typeA = asc ? aTypes[0] : aTypes[aTypes.length - 1];
          const typeB = asc ? bTypes[0] : bTypes[bTypes.length - 1];
          if (typeA === typeB) return a.id - b.id;
          return asc ? typeA.localeCompare(typeB) : typeB.localeCompare(typeA);
        });
        break;
      }
      case 'hp':
      case 'attack':
      case 'defense':
      case 'special-attack':
      case 'special-defense':
      case 'speed':
        arr.sort((a, b) => {
          const statA = a.stats.find((s) => s.name === criteria)?.value || 0;
          const statB = b.stats.find((s) => s.name === criteria)?.value || 0;
          if (statA === statB) return a.id - b.id;
          return asc ? statA - statB : statB - statA;
        });
        break;
      case 'total':
        arr.sort((a, b) => {
          if (a.total === b.total) return a.id - b.id;
          return asc ? a.total - b.total : b.total - a.total;
        });
        break;
      default:
        break;
    }
    return arr;
  }

  const displayDeck = useMemo(() => {
    const source = filteredDeck ? filteredDeck : deck;
    console.log(`Updating displayed pokemon with sortCriteria: ${sortCriteria}, asc: ${asc}, search: ${search}, type: ${typeFilter}`);
    let updated = applySearch(source, search);
    updated = applySort(updated, sortCriteria, asc);
    return updated;
  }, [deck, filteredDeck, sortCriteria, asc, search, typeFilter]);

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

  async function removeHandler(entry: Pokemon): Promise<void> {
    console.log(`removing ${entry.name} from deck...`);
    try {
      await removeFromDeck(entry);
      const newDeck = deck.filter(p => p.id !== entry.id);
      setDeck(newDeck);
      if (typeFilter) {
        setFilteredDeck((prev) => prev ? prev.filter((p) => p.id !== entry.id) : prev);
      }
    } catch (err) {
      console.error(`Error removing ${entry.name} from deck:`, err);
      setError(`Failed to remove ${entry.name} from deck.`);
    }
  }
  async function sortHandler(criteria: string, asc: boolean): Promise<void> {
    console.log(`sorting by ${criteria} in ${asc ? 'ascending' : 'descending'} order...`);
    setSortCriteria(criteria);
    setAsc(asc);
  }
  async function filterHandler(type: string): Promise<void> {
    console.log(`filtering by Type ${type}...`);
    try {
      setTypeFilter(type);
      if (type) {
        const filtered = await getFilteredDeck(type);
        setFilteredDeck(filtered);
        if (deck.length > 0 && filtered.length === 0) {
          setError(`No [${type}] type pokemon found in deck.`);
        } else {
          setError('');
        }
      } else {
        setFilteredDeck(null);
        setError('');
      }
    } catch (err) {
      console.error('Error filtering deck:', err);
      setError('Failed to filter deck.');
    }
  }
  async function searchHandler(search: string): Promise<void> {
    console.log(`searching for ${search}...`);
    try {
      setError('');
      setSearch(search);
    } catch (err) {
      console.error('Error searching deck:', err);
      setError('Failed to search deck.');
    }
  }

  async function resetHandler(): Promise<void> {
    console.log('Resetting deck sorts, filters, search terms...');
    try {
      (document.getElementById('search') as HTMLInputElement)!.value = '';
      (document.getElementById('type') as HTMLSelectElement)!.value = '';
      setSortCriteria('name');
      (document.getElementById('sort') as HTMLSelectElement)!.value = 'name';
      setAsc(true);
      setSearch('');
      setFilteredDeck(null);
      setTypeFilter('');
      setError('');
    } catch (err) {
      console.error('Error resetting deck:', err);
      setError('Failed to reset deck.');
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
      {!deckLoaded && (
        <p className="text-sm text-surface-500">
          Loading your deck...
        </p>
      )}
      {deckLoaded && <DeckSummary deckSummary={deckSummary} /> }
      {deckLoaded && (
        <div className="panel">
          <div className="flex items-center gap-2 mb-4">
            <input className="pill-outline" type="text" id="search" placeholder="Search for a Pokemon name" size={25}/>
            <button className="btn btn-primary"
              onClick={() => {
                const input = (document.getElementById('search') as HTMLInputElement).value;
                searchHandler(input);
              }}
            >Search</button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Sort sortHandler={sortHandler} sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} asc={asc} setAsc={setAsc} />
            <div>
              <label htmlFor="type">Filter by type: </label>
              <select className="pill-outline" name="type" id="type" onChange={(e) => {
                filterHandler(e.target.value);
                }}>
                <option value="">All Types (Default)</option>
                <option value="normal">Normal</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="grass">Grass</option>
                <option value="electric">Electric</option>
                <option value="ice">Ice</option>
                <option value="fighting">Fighting</option>
                <option value="poison">Poison</option>
                <option value="ground">Ground</option>
                <option value="flying">Flying</option>
                <option value="psychic">Psychic</option>
                <option value="bug">Bug</option>
                <option value="rock">Rock</option>
                <option value="ghost">Ghost</option>
                <option value="dragon">Dragon</option>
                <option value="dark">Dark</option>
                <option value="steel">Steel</option>
                <option value="fairy">Fairy</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={resetHandler}>Reset All</button>
          </div>
        </div>
      )}
      {deckLoaded && deck.length === 0 ? (
        <p className="text-sm text-red-700">
            Your deck is empty. Add some Pokemon from the Browser!
        </p>
      ) :
        <div className="table-scroll">
          <table className="table-auto m-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm text-surface-700">ID</th>
                <th className="px-4 py-2 text-sm text-surface-700">Name</th>
                <th className="px-4 py-2 text-sm text-surface-700">Types</th>
                <th className="px-4 py-2 text-sm text-surface-700">HP</th>
                <th className="px-4 py-2 text-sm text-surface-700">Attack</th>
                <th className="px-4 py-2 text-sm text-surface-700">Defense</th>
                <th className="px-4 py-2 text-sm text-surface-700">Sp. Atk</th>
                <th className="px-4 py-2 text-sm text-surface-700">Sp. Def</th>
                <th className="px-4 py-2 text-sm text-surface-700">Speed</th>
                <th className="px-4 py-2 text-sm text-surface-700">Total</th>
                <th className="px-4 py-2 text-sm text-surface-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayDeck.map((entry: Pokemon) => (
                <PokemonRow
                  key={entry.name} entry={entry}
                  buttonContent='Remove from deck'
                  buttonClickHandler={() => {
                    removeHandler(entry);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      }
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
};

function DeckSummary({ deckSummary }: { deckSummary: DeckSummary }) {
  return (
    <div className="summary-pill">
      <div className="pill pill-soft">
        <p className="summary-label">Deck Size</p>
        <p className="summary-value">{deckSummary.count}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg HP</p>
        <p className="summary-value">{deckSummary.avg_hp.toFixed(2)}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg Atk</p>
        <p className="summary-value">{deckSummary.avg_attack.toFixed(2)}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg Def</p>
        <p className="summary-value">{deckSummary.avg_defense.toFixed(2)}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg Sp. Atk</p>
        <p className="summary-value">{deckSummary.avg_special_attack.toFixed(2)}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg Sp. Def</p>
        <p className="summary-value">{deckSummary.avg_special_defense.toFixed(2)}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg Spd</p>
        <p className="summary-value">{deckSummary.avg_speed.toFixed(2)}</p>
      </div>
      <div className="pill pill-soft">
        <p className="summary-label">Avg Total Stats</p>
        <p className="summary-value">{deckSummary.avg_total.toFixed(2)}</p>
      </div>
    </div>
  );
}
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