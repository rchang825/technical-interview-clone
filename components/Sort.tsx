interface SortProps {
  sortHandler: (criteria: string, asc: boolean) => Promise<void>;
  sortCriteria: string;
  setSortCriteria: React.Dispatch<React.SetStateAction<string>>;
  asc: boolean;
  setAsc: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sort({sortHandler, sortCriteria, setSortCriteria, asc, setAsc}: SortProps) {
  return (
    <div className="flex items-center gap-2">
      <div>
        <label htmlFor="sort">Sort by: </label>
        <select className="pill-outline" name="sort" id="sort" onChange={(e) => {
          setSortCriteria(e.target.value);
          sortHandler(e.target.value, asc);
          }}>
          <option value="name">Name (Default)</option>
          <option value="type">Type</option>
          <option value="hp">HP</option>
          <option value="attack">Attack</option>
          <option value="defense">Defense</option>
          <option value="special-attack">Special Attack</option>
          <option value="special-defense">Special Defense</option>
          <option value="speed">Speed</option>
          <option value="total">Total Stats</option>
        </select>
      </div>
      <div>
        <button
          type="button"
          className={`pill ${asc ? 'btn-primary' : 'btn-primary-disabled'}`}
          onClick={() => {
            setAsc(true);
            sortHandler(sortCriteria, true);
          }}
        >
          Asc
        </button>
        <button
          type="button"
          className={`pill ${!asc ? 'btn-primary' : 'btn-primary-disabled'}`}
          onClick={() => {
            setAsc(false);
            sortHandler(sortCriteria, false);
          }}
        >
          Desc
        </button>
      </div>
    </div>
  )
}