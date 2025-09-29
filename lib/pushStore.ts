// Simple persisted push subscription store for dev/testing.
// Persists to data/push-subs.json and also uses globalThis to survive HMR in dev.

import fs from 'fs';
import path from 'path';

export type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime?: number | null;
  keys?: { p256dh: string; auth: string };
};

type Store = {
  subs: PushSubscriptionJSON[];
  filePath: string;
};

function ensureDataFile(): string {
  const fp = path.join(process.cwd(), 'data', 'push-subs.json');
  try {
    const dir = path.dirname(fp);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(fp)) fs.writeFileSync(fp, '[]', 'utf-8');
  } catch {}
  return fp;
}

function loadFromDisk(filePath: string): PushSubscriptionJSON[] {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveToDisk(filePath: string, subs: PushSubscriptionJSON[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(subs, null, 2), 'utf-8');
  } catch {}
}

const g = globalThis as any;
if (!g.__pushStore) {
  const filePath = ensureDataFile();
  const subs = loadFromDisk(filePath);
  g.__pushStore = { subs, filePath } as Store;
}

export const pushStore: Store = g.__pushStore;

export function addSubscription(s: PushSubscriptionJSON) {
  const exists = pushStore.subs.find((x) => x.endpoint === s.endpoint);
  if (!exists) {
    pushStore.subs.push(s);
    saveToDisk(pushStore.filePath, pushStore.subs);
  }
}

export function listSubscriptions() {
  return pushStore.subs;
}

export function clearSubscriptions() {
  pushStore.subs = [];
  saveToDisk(pushStore.filePath, pushStore.subs);
}
