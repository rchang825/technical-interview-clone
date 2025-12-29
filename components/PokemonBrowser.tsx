'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { POKEMON_PAGE_SIZE, formatName, fetchPokemonPage, mapPokemon } from "@/lib/pokeApi";

export function PokemonBrowser() {
  const [page, setPage] = useState<any>(1);
  const [pokemon, setPokemon] = useState<any>([]);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // TODO: Hook this up to fetch data and update loading/error/pokemon state.
    fetchPokemonPage(page).then((response) => {
      const formattedResponse: any = response?.map((p) => mapPokemon(p)) || [];
      if (formattedResponse.length === 0) {
        setError('Error fetching pokemon from API');
      } else {
        setError(null);
        setPokemon(formattedResponse);
        setLoading(false);
      }
    });
  }, [page]);

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
          : pokemon.map((entry: any) => (
              <article key={entry.name} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow">#{entry.id}</p>
                    <h3 className="text-lg font-semibold text-surface-900">
                      {entry.name}
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
                  {entry.types.map((type: any) => (
                    <span key={`${entry.name}_${type.type.name}`} className="pill pill-soft">
                      {type.type.name}
                    </span>
                  ))}
                </div>

                <dl className="grid grid-cols-3 gap-2 text-xs text-surface-600">
                  {entry.stats.map((stat: any) => (
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
                <div className="flex justify-between">
                  <p className="text-xs text-surface-500">
                    Total stats:{" "}
                    <span className="font-semibold text-surface-800">
                      {entry.total}
                    </span>
                  </p>
                </div>
              </article>
            ))}
      </div>

      <footer className="flex items-center justify-between pt-2">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={page === 1 || loading}
          onClick={() => setPage((current: any) => Math.max(1, current - 1))}
        >
          Previous page
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={loading}
          onClick={() => setPage((current: any) => current + 1)}
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
