'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getDeck } from '@/lib/deckApi';

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

const DeckContext = createContext<{ deck: Pokemon[]; setDeck: (deck: Pokemon[]) => void } | null>(null);

export function DeckInitializer() {
  const { setDeck } = useDeck()
  useEffect(() => {
    let alive = true
    getDeck()
      .then(d => { if (alive) setDeck(d || []) })
      .catch(() => { console.error('Error fetching deck from database') })
    return () => { alive = false }
  }, [setDeck])
  return null
}

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
}

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const [deck, setDeck] = useState<Pokemon[]>([]);

  return (
    <DeckContext.Provider value={{ deck, setDeck }}>
      {children}
    </DeckContext.Provider>
  );
}