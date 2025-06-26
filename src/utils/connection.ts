import { openKv } from '@deno/kv';

let kvInstance: any = null;

export async function connectToKv(dbPath: string): Promise<any> {
  if (kvInstance) {
    return kvInstance;
  }
  
  try {
    kvInstance = await openKv(dbPath);
    return kvInstance;
  } catch (error) {
    throw new Error(`Failed to connect to KV database: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function closeKv(): Promise<void> {
  if (kvInstance) {
    await kvInstance.close();
    kvInstance = null;
  }
}