// Jednotné ukladanie do localStorage. Kľúče sú vždy verzované: `dielna:<oblasť>:v<N>`.
export const storageKey = (area: string, version = 1) => `dielna:${area}:v${version}`;

export function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null; // poškodené dáta alebo súkromný režim → správaj sa ako prázdne
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* plné úložisko / súkromný režim — appka funguje ďalej bez ukladania */
  }
}
