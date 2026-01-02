'use client';

import { formatName } from "@/lib/pokeApi";

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

export default function PokemonRow({ entry, buttonContent, buttonClickHandler }: { entry: Pokemon, buttonContent: string, buttonClickHandler: () => void }) {
  return (
    <tr>
      <td className="px-4 py-2 text-sm text-surface-700">#{entry.id}</td>
      <td className="px-4 py-2 text-sm text-surface-700">{formatName(entry.name)}</td>
      <td className="px-4 py-2 text-sm text-surface-700">{entry.types.join(', ')}</td>
      {
        entry.stats.map((stat: {name: string, value: number}) => (
          <td key={stat.name} className="px-4 py-2 text-sm text-surface-700">
            {stat.value}
          </td>
        ))
      }
      <td className="px-4 py-2 text-sm text-surface-700">{entry.total}</td>
      <td>
        <button
          type="button"
          className="btn text-red-700"
          onClick={buttonClickHandler}
        >
          {buttonContent}
        </button>
      </td>
    </tr>
  );
}