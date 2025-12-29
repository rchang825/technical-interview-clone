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

export async function fetchPokemonPage(page: any) {
  /*
   * TODO:
   * - Accept a page number and calculate offset/limit using PAGE_SIZE.
   * - Call the public PokeAPI list endpoint with that pagination.
   * - Handle non-OK responses with a thrown error.
   * - Parse the JSON, and return the results array (or an empty array) for further mapping.
   */
  // find limit using page number
  // endpoint: https://pokeapi.co/api/v2/pokemon
  // [name: weedle, url: pokeapi/12] =>
  const offset: number = (page - 1)  * PAGE_SIZE;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`, {
      method: 'GET',
    });
    if (response.ok) {
      let pokemon = await response.json();
        return Promise.all(pokemon.results.map(async (p: any) => {
          const details = await fetch(p.url);
          const detailsJSON = await details.json();
            return {
              name: p.name,
              id: detailsJSON.id,
              image: detailsJSON.sprites.front_default,
              types: detailsJSON.types,
              stats: detailsJSON.stats
            }
        }));
    } else {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

export function mapPokemon(detail: any) {
  /*
   * TODO:
   * - Validate the shape of the incoming detail payload
   * - Map stats in STAT_ORDER into objects with name/value pairs (use 0 when missing).
   * - Compute the total by summing mapped stat values.
   * - Derive a display image
   * - Return a normalized object with id, name, image, types array, stats array, and total.
   */
  type Pokemon = {
    id: number,
    name: string,
    image: string,
    types: string[],
    stats: any[],
    total: number
  };

  const pokemon: Pokemon = {
    id: detail.id,
    name: formatName(detail.name),
    image: detail.image,
    types: detail.types,
    stats: STAT_ORDER.map((stat) => {
      const normalizedStat: {name: string, value: number} = {name: stat, value: 0};
      const foundStat = detail.stats.find((s: any) => s.stat.name === stat);
      normalizedStat.value = foundStat ? foundStat.base_stat : 0;
      return normalizedStat;
    }),
    total: 0
  };
  let total: number = 0;
  pokemon.stats.forEach((st: {name: string, value: number}) => {
    total += st.value;
  });
  pokemon.total = total;
  return pokemon;
}

export function formatName(name: any): string {
  /*
   * TODO:
   * - Normalize a Pokemon name for display (e.g., capitalize first letter).
   * - Handle edge cases like empty/undefined input gracefully.
   */
  if (name && name.length > 0) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }
  return name;
}

export const ALL_STAT_KEYS = [...STAT_ORDER];
