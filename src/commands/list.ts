import { Command } from 'commander';
import { listEntries } from '../core/kv-operations.js';
import { formatOutput } from '../core/formatters.js';
import { validateOutputFormat, validateLimit } from '../core/validators.js';
import { getConfig, getDefaultFormat } from '../utils/config.js';
import { connectToKv, closeKv } from '../utils/connection.js';
import { ListOptions } from '../types/cli-types.js';

export function setupListCommand(): Command {
  return new Command('list')
    .description('List KV records')
    .option('-p, --prefix <prefix>', 'Filter by key prefix')
    .option('-s, --start <start>', 'Start key')
    .option('-e, --end <end>', 'End key')
    .option('-r, --reverse', 'Reverse order')
    .option('-l, --limit <limit>', 'Maximum number of results')
    .option('-f, --format <format>', 'Output format (table/json)', getDefaultFormat())
    .option('--db-path <path>', 'Path to the KV database file')
    .action(async (options) => {
      try {
        const config = getConfig(options.dbPath);
        const format = validateOutputFormat(options.format);
        
        const listOptions: ListOptions = {
          format,
          dbPath: config.dbPath,
          prefix: options.prefix,
          start: options.start,
          end: options.end,
          reverse: options.reverse,
          limit: options.limit ? validateLimit(options.limit) : undefined
        };

        const kv = await connectToKv(config.dbPath!);
        const entries = await listEntries(kv, listOptions);
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