"use client";

import { usePathname } from "next/navigation";
import Link from 'next/link';

export default function Nav() {
  const pathname = usePathname();

  return (
    <section className="flex gap-4 p-4 bg-surface-100">
      <button
        type="button"
        className={`btn ${pathname === '/browser' ? 'btn-primary' : 'btn-primary-disabled'}`}
      >
        <Link href='/browser'>Pokemon Browser</Link>
      </button>
      <button
        type="button"
        className={`btn ${pathname === '/deck' ? 'btn-primary' : 'btn-primary-disabled'}`}
      >
        <Link href='/deck'>My Deck</Link>
      </button>
    </section>
  );
}