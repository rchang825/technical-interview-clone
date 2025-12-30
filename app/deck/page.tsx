import { DeckInitializer } from "@/components/DeckContext";
import { DeckTable } from "@/components/DeckTable";

export default function Deck() {
  return (
  <div className="mt-6 responsive-grid">
    <DeckInitializer />
    <DeckTable />
  </div>
  );
}