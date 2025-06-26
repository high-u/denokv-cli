import { Config } from '../types/cli-types.js';

export function getConfig(cliDbPath?: string): Config {
  const dbPath = cliDbPath || process.env.DENO_KV_CLI_DB_PATH;
  
  if (!dbPath) {
    throw new Error('Database path is required. Provide --db-path option or set DENO_KV_CLI_DB_PATH environment variable.');
  }
  
  return { dbPath };
}

export function getDefaultFormat(): 'table' {
  return 'table';
}