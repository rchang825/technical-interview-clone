const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

const PAGE_SIZE = 12;

export const POKEMON_PAGE_SIZE = PAGE_SIZE;

export async function fetchPokemonPage(page) {
  const offset = (page - 1) * PAGE_SIZE;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${PAGE_SIZE}`,
  );
  if (!response.ok) {
    throw new Error("Unable to load Pokemon. Please try again.");
  }
  const data = await response.json();
  return data.results ?? [];
}

export function mapPokemon(detail) {
  const stats = STAT_ORDER.map((key) => {
    const stat = detail.stats.find((item) => item.stat.name === key);
    return {
      name: key,
      value: stat?.base_stat ?? 0,
    };
  });

  const total = stats.reduce((sum, stat) => sum + stat.value, 0);

  return {
    id: detail.id,
    name: detail.name,
    image:
      detail.sprites?.other?.["official-artwork"]?.front_default ??
      detail.sprites?.front_default ??
      "",
    types: detail.types?.map((type) => type.type.name) ?? [],
    stats,
    total,
  };
}

export function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const ALL_STAT_KEYS = [...STAT_ORDER];
