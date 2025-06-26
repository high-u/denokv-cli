import { KvEntry, ListOptions } from '../types/cli-types.js';

export async function listEntries(kv: any, options: ListOptions): Promise<KvEntry[]> {
  const listOptions: any = {};
  
  if (options.limit) {
    listOptions.limit = options.limit;
  }
  
  if (options.reverse) {
    listOptions.reverse = options.reverse;
  }

  let selector: any;
  if (options.prefix) {
    const prefixKey = options.prefix.split(':').filter(part => part.length > 0);
    selector = { prefix: prefixKey };
  } else if (options.start || options.end) {
    const startKey = options.start ? options.start.split(':').filter(part => part.length > 0) : undefined;
    const endKey = options.end ? options.end.split(':').filter(part => part.length > 0) : undefined;
    selector = { start: startKey, end: endKey };
  } else {
    selector = { prefix: [] };
  }

  const entries: KvEntry[] = [];
  const iter = kv.list(selector, listOptions);
  
  for await (const entry of iter) {
    entries.push({
      key: entry.key,
      value: entry.value,
      versionstamp: entry.versionstamp
    });
  }
  
  return entries;
}

export async function getEntry(kv: any, key: string[]): Promise<KvEntry | null> {
  const result = await kv.get(key);
  if (result.value === null) {
    return null;
  }
  
  return {
    key: result.key,
    value: result.value,
    versionstamp: result.versionstamp
  };
}

export async function getMultipleEntries(kv: any, keys: string[][]): Promise<KvEntry[]> {
  const results = await kv.getMany(keys);
  return results
    .filter((result: any) => result.value !== null)
    .map((result: any) => ({
      key: result.key,
      value: result.value,
      versionstamp: result.versionstamp
    }));
}

export async function setEntry(kv: any, key: string[], value: unknown, options?: { expire?: number }): Promise<void> {
  const setOptions: any = {};
  if (options?.expire) {
    setOptions.expireIn = options.expire * 1000;
  }
  
  await kv.set(key, value, setOptions);
}

export async function deleteEntry(kv: any, key: string[]): Promise<void> {
  await kv.delete(key);
}