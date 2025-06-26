import { Command } from 'commander';
import { getMultipleEntries } from '../core/kv-operations.js';
import { formatOutput } from '../core/formatters.js';
import { validateOutputFormat, validateKey } from '../core/validators.js';
import { getConfig, getDefaultFormat } from '../utils/config.js';
import { connectToKv, closeKv } from '../utils/connection.js';

export function setupGetManyCommand(): Command {
  return new Command('get-many')
    .description('Get multiple KV records')
    .argument('<keys...>', 'Keys to retrieve')
    .option('-f, --format <format>', 'Output format (table/json)', getDefaultFormat())
    .option('--db-path <path>', 'Path to the KV database file')
    .action(async (keys, options) => {
      try {
        const config = getConfig(options.dbPath);
        const format = validateOutputFormat(options.format);
        const keyArrays = keys.map((key: string) => validateKey(key));

        const kv = await connectToKv(config.dbPath!);
        const entries = await getMultipleEntries(kv, keyArrays);
        const output = formatOutput(entries, format);
        
        console.log(output);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      } finally {
        await closeKv();
      }
    });
}