import { Command } from 'commander';
import { getEntry } from '../core/kv-operations.js';
import { formatSingleEntry } from '../core/formatters.js';
import { validateOutputFormat, validateKey } from '../core/validators.js';
import { getConfig, getDefaultFormat } from '../utils/config.js';
import { connectToKv, closeKv } from '../utils/connection.js';

export function setupGetCommand(): Command {
  return new Command('get')
    .description('Get a KV record')
    .argument('<key>', 'Key to retrieve')
    .option('-f, --format <format>', 'Output format (table/json)', getDefaultFormat())
    .option('--db-path <path>', 'Path to the KV database file')
    .action(async (key, options) => {
      try {
        const config = getConfig(options.dbPath);
        const format = validateOutputFormat(options.format);
        const keyArray = validateKey(key);

        const kv = await connectToKv(config.dbPath!);
        const entry = await getEntry(kv, keyArray);
        const output = formatSingleEntry(entry, format);
        
        console.log(output);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      } finally {
        await closeKv();
      }
    });
}