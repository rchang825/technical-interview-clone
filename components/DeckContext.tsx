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

const DeckContext = createContext<{ deck: Pokemon[]; setDeck: (deck: Pokemon[]) => void; deckLoaded: boolean; setDeckLoaded: (loaded: boolean) => void } | null>(null);

export function DeckInitializer() {
  const { setDeck, setDeckLoaded } = useDeck()
  useEffect(() => {
    let alive = true;
    getDeck()
      .then((d) => {
        if (alive) {
          setDeck(d || []);
        }
      })
      .catch(() => {
        console.error('Error fetching deck from database');
      })
      .finally(() => {
        if (alive) {
          setDeckLoaded(true);
        }
      });
    return () => { alive = false }
  }, [setDeck, setDeckLoaded])
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
  const [deckLoaded, setDeckLoaded] = useState<boolean>(false);

  return (
    <DeckContext.Provider value={{ deck, setDeck, deckLoaded, setDeckLoaded }}>
      {children}
    </DeckContext.Provider>
  );
}