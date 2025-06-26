import { Command } from 'commander';
import { deleteEntry } from '../core/kv-operations.js';
import { validateKey } from '../core/validators.js';
import { getConfig } from '../utils/config.js';
import { connectToKv, closeKv } from '../utils/connection.js';

export function setupDeleteCommand(): Command {
  return new Command('delete')
    .description('Delete a KV record')
    .argument('<key>', 'Key to delete')
    .option('--db-path <path>', 'Path to the KV database file')
    .action(async (key, options) => {
      try {
        const config = getConfig(options.dbPath);
        const keyArray = validateKey(key);

        const kv = await connectToKv(config.dbPath!);
        await deleteEntry(kv, keyArray);
        
        console.log(`Successfully deleted ${key}`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      } finally {
        await closeKv();
      }
    });
}