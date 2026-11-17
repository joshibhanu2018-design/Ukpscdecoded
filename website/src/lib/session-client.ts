"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Login state for the cached public pages. The server sends the same page
 * to everyone; the browser then works out who it is:
 *  - the readable `ukd_in` flag (set at login) says "logged in" at once;
 *  - /api/me confirms it and lists the owned products, at most once every
 *    10 minutes per tab (kept in sessionStorage);
 *  - a browser with no flag asks /api/me only once ever, so students who
 *    logged in before the flag existed are picked up, and plain visitors
 *    cost no server call after their first page.
 */
export type ClientSession = { loggedIn: boolean; owned: string[] };

const CACHE_KEY = "ukd-me";
const CHECKED_KEY = "ukd-me-checked";
const CACHE_MS = 10 * 60 * 1000;

let state: ClientSession | null = null;
let started = false;
const listeners = new Set<() => void>();

function set(next: ClientSession) {
  state = next;
  listeners.forEach((l) => l());
}

function hasHint(): boolean {
  return /(?:^|;\s*)ukd_in=1/.test(document.cookie);
}

async function refresh() {
  try {
    const res = await fetch("/api/me", { cache: "no-store", credentials: "same-origin" });
    if (!res.ok) return;
    const data = (await res.json()) as ClientSession;
    const next = { loggedIn: !!data.loggedIn, owned: Array.isArray(data.owned) ? data.owned : [] };
    set(next);
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...next, at: Date.now() }));
      localStorage.setItem(CHECKED_KEY, "1");
    } catch {}
  } catch {}
}

function start() {
  if (started) return;
  started = true;
  const hint = hasHint();
  let cached: (ClientSession & { at: number }) | null = null;
  let checked = false;
  try {
    cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    checked = localStorage.getItem(CHECKED_KEY) === "1";
  } catch {}

  if (cached && cached.loggedIn === hint && Date.now() - cached.at < CACHE_MS) {
    set({ loggedIn: cached.loggedIn, owned: cached.owned ?? [] });
    return;
  }
  set({ loggedIn: hint, owned: hint ? cached?.owned ?? [] : [] });
  if (hint || !checked) void refresh();
}

/** Call after a login, logout or purchase so the next page asks again. */
export function resetClientSession() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {}
  started = false;
  start();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** null until the browser has looked (the server always renders the logged-out view). */
export function useClientSession(): ClientSession | null {
  const value = useSyncExternalStore(subscribe, () => state, () => null);
  useEffect(start, []);
  return value;
}

export function useLoggedIn(): boolean {
  return useClientSession()?.loggedIn ?? false;
}

export function useOwned(packageId: string): boolean {
  return useClientSession()?.owned.includes(packageId) ?? false;
}
