import { PokemonBrowser } from "@/components/PokemonBrowser";
import { DeckInitializer } from "@/components/DeckContext";

export default function Browser() {
  return (
  <div className="mt-6 responsive-grid">
    <DeckInitializer />
    <PokemonBrowser />
  </div>
  );
}
