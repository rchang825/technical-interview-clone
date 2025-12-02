"use client";

import { PokemonBrowser } from "@/components/PokemonBrowser";

export default function Home() {
  return (
    <main className="w-full p-20">
      <header className="hero flex flex-col gap-3">
        <p className="eyebrow">Technical Interview</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-surface-900">
              Pokedex deck builder
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-surface-600">
            <a
              href="https://pokeapi.co/docs/v2"
              target="_blank"
              rel="noreferrer"
              className="pill pill-primary shadow-md transition hover:translate-y-[-1px]"
            >
              View PokeAPI Docs
            </a>
          </div>
        </div>
      </header>

      <div className="mt-6 responsive-grid">
        <PokemonBrowser />
      </div>
    </main>
  );
}
