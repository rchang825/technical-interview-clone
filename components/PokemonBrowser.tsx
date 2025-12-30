'use client';


import { useEffect, useState } from "react";
import { useDeck } from "./DeckContext";
import { POKEMON_PAGE_SIZE, formatName, fetchPokemonPage, mapPokemon } from "@/lib/pokeApi";
import PokemonCard from './PokemonCard';
import { addToDeck } from "@/lib/deckApi";

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

export function PokemonBrowser() {
  const { deck, setDeck } = useDeck();
  const [page, setPage] = useState<number>(1);
  const [pokemon, setPokemon] = useState<Pokemon[]>(new Array<Pokemon>);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // TODO: Hook this up to fetch data and update loading/error/pokemon state.
    fetchPokemonPage(page).then((response) => {
      const formattedResponse: any = response?.map((p) => mapPokemon(p)) || [];
      if (formattedResponse.length === 0) {
        setError('Error fetching pokemon from API');
      } else {
        setError('');
        setPokemon(formattedResponse);
        setLoading(false);
      }
    });
  }, [page]);
  async function addHandler(entry: Pokemon): Promise<void> {
    if (deck.includes(entry)) {
      console.log(`${entry.name} is already in deck`);
      return;
    }
    console.log(`adding ${entry.name} to deck...`);
    // call db to add pokemon to deck
    await addToDeck(entry);
    // optimistically update global state
    setDeck([...deck, entry]);
      // toggle button content and button click handler to be remove from deck
  }
  return (
    <section className="panel gap-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-surface-900">
            Browse Pokemon
          </h2>
          <p className="text-sm text-surface-500">
            Load a page of Pokemon, inspect the data, and add to your deck.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full bg-surface-100 px-4 py-2 text-xs font-medium text-surface-700">
          <span>Page</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            {page}
          </span>
          <span className="text-surface-400">
            ({POKEMON_PAGE_SIZE} per page)
          </span>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))
          : pokemon.map((entry: Pokemon) => (
            // BUG: buttonContent always shows 'Add to Deck' on refresh if pokemon is already in deck
              <PokemonCard key={entry.name} entry={entry} buttonContent={deck.includes(entry) ? 'In Deck' : 'Add to Deck'} buttonClickHandler={() => addHandler(entry)}/>
            ))}
      </div>

      <footer className="flex items-center justify-between pt-2">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={page === 1 || loading}
          onClick={() => setPage((current: number) => Math.max(1, current - 1))}
        >
          Previous page
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={loading}
          onClick={() => setPage((current: number) => current + 1)}
        >
          Next page
        </button>
      </footer>
    </section>
  );
}

function SkeletonCard() {
  return (
    <article className="card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-4 w-20 rounded bg-surface-100" />
        <div className="h-12 w-12 rounded-lg bg-surface-100" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-surface-100" />
        <div className="h-6 w-12 rounded-full bg-surface-100" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-12 rounded bg-surface-100" />
        <div className="h-12 rounded bg-surface-100" />
        <div className="h-12 rounded bg-surface-100" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-24 rounded bg-surface-100" />
      </div>
    </article>
  );
}
