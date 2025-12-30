'use client';

import { formatName } from "@/lib/pokeApi";
import Image from "next/image";
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

export default function PokemonCard({ entry, buttonContent, buttonClickHandler }: { entry: Pokemon, buttonContent: string, buttonClickHandler: () => void }) {
  // console.log(entry);
  return (
    <article className="card">
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
          <span key={`${entry.name}_${type}`} className="pill pill-soft">
            {type}
          </span>
        ))}
      </div>

      <dl className="grid grid-cols-3 gap-2 text-xs text-surface-600">
        {entry.stats.map((stat: {name: string, value: number}) => (
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
        <button
          type="button"
          className="btn btn-ghost"
          onClick={buttonClickHandler}
        >
          {buttonContent}
        </button>
      </div>
    </article>
  );
}