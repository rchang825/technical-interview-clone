"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { POKEMON_PAGE_SIZE, formatName } from "@/lib/pokeApi";

export function PokemonBrowser() {
  const [page, setPage] = useState(1);
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * POKEMON_PAGE_SIZE;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${POKEMON_PAGE_SIZE}`,
        );
        await response.json();
      } catch (err) {
        if (active) {
          setError((err as Error).message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = useMemo(
    () => pokemon.map((entry) => ({ ...entry })),
    [pokemon],
  );

  return (
    <section className="panel gap-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Phase 1 · Fetch & Troubleshoot</p>
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
          : cards.map((entry) => (
              <article key={entry.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow">#{entry.id}</p>
                    <h3 className="text-lg font-semibold text-surface-900">
                      {formatName(entry.name)}
                    </h3>
                  </div>
                  {entry.image ? (
                    <div className="relative h-20 w-20">
                      <Image
                        src={entry.image}
                        alt={entry.name}
                        fill
                        sizes="80px"
                        className="drop-shadow-lg object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-surface-100" />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {entry.types.map((type) => (
                    <span key={type} className="pill pill-soft">
                      {formatName(type)}
                    </span>
                  ))}
                </div>

                <dl className="grid grid-cols-3 gap-2 text-xs text-surface-600">
                  {entry.stats.map((stat) => (
                    <div
                      key={stat.name}
                      className="rounded-md bg-surface-50 px-2 py-2"
                    >
                      <dt className="uppercase tracking-wide text-[10px] text-surface-400">
                        {stat.name.replace("-", " ")}
                      </dt>
                      <dd className="text-sm font-semibold text-surface-900">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="text-xs text-surface-500">
                  Total stats:{" "}
                  <span className="font-semibold text-surface-800">
                    {entry.total}
                  </span>
                </p>
              </article>
            ))}
      </div>

      <footer className="flex items-center justify-between pt-2">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={page === 1 || loading}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous page
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={loading}
          onClick={() => setPage((current) => current + 1)}
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
