'use server';
import pool from '../db';

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

export async function getDeck() {
  // SELECT * ...
  // default sort is by id ascending
  try {
    const queryStr: string = `SELECT * FROM pokemon ORDER BY id ASC`;
    const result = await pool.query(queryStr, []);
    const formattedResult: Pokemon[] = result.rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        image: row.image,
        types: [],
        stats: [
          { name: 'hp', value: row.hp },
          { name: 'attack', value: row.attack },
          { name: 'defense', value: row.defense },
          { name: 'special-attack', value: row.special_attack },
          { name: 'special-defense', value: row.special_defense },
          { name: 'speed', value: row.speed },
        ],
        total: row.total,
      };
    });
    for (const pokemon of formattedResult) {
      const typeResult = await pool.query(
        `SELECT type.name FROM types type
         JOIN pokemon_types pt ON type.id = pt.type_id
         WHERE pt.pokemon_id = $1`,
        [pokemon.id]
      );
      pokemon.types = typeResult.rows.map((typeRow) => typeRow.name);
    }
    return formattedResult;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch deck from database');
  }
};

// export async function getMetadata() {
//   // count, avg for each stat, avg total
//   try {
//     const queryStr = `
//     SELECT COUNT(id), AVG(hp) AS average_hp, AVG(attack) AS average_attack,
//     AVG(defense) AS average_defense, AVG(special_attack) AS average_special_attack,
//     AVG(special_defense) AS average_special_defense, AVG(speed) AS average_speed,
//     AVG(total) AS average_total
//     FROM pokemon`;
//     const summary = await pool.query(queryStr, []);
//     return summary.rows;
//   } catch (err) {
//     console.error('Error calculating metadata:', err);
//     throw err;
//   }
// }

export async function addToDeck(entry: Pokemon) {
  // INSERT ...
  try {
    const { id, name, image, types, stats, total } = entry;
    const queryStr =
      'INSERT INTO pokemon (id, name, image, hp, attack, defense, special_attack, special_defense, speed, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    await pool.query(queryStr, [
      id,
      name,
      image,
      stats.find((stat) => stat.name === 'hp')?.value,
      stats.find((stat) => stat.name === 'attack')?.value,
      stats.find((stat) => stat.name === 'defense')?.value,
      stats.find((stat) => stat.name === 'special-attack')?.value,
      stats.find((stat) => stat.name === 'special-defense')?.value,
      stats.find((stat) => stat.name === 'speed')?.value,
      total,
    ]);

    for (const type of types) {
      const typeMatch = await pool.query(
        'SELECT id FROM types WHERE name = $1',
        [type]
      );
      const typeId = typeMatch.rows[0]?.id;
      if (typeof typeId !== 'number') {
        throw new Error(`Type ${type} not found in types table`);
      }
      await pool.query('INSERT INTO pokemon_types (pokemon_id, type_id) VALUES ($1, $2)', [id, typeId]);
    }
  } catch (err) {
    console.error('One or more errors occurred while adding to deck:', err);
    throw err;
  }
}

export async function removeFromDeck(entry: Pokemon) {
  // DELETE ...
  try {
    await pool.query('DELETE FROM pokemon WHERE id = $1', [entry.id]);
  } catch (err) {
    console.error(`Error removing ${entry.name} from deck:`, err);
    throw err;
  }
}

/*
  filter deck by type
  search deck by name
  sort by name, types, each stat key, and total (asc/desc)
*/