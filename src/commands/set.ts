import { Command } from 'commander';
import { setEntry } from '../core/kv-operations.js';
import { validateKey, validateJsonValue, validateExpire } from '../core/validators.js';
import { getConfig } from '../utils/config.js';
import { connectToKv, closeKv } from '../utils/connection.js';

export function setupSetCommand(): Command {
  return new Command('set')
    .description('Set a KV record. The value must be a valid JSON string.')
    .argument('<key>', 'Key to set')
    .argument('<value>', 'Value to set (must be valid JSON)')
    .option('-e, --expire <expire>', 'Expiration time in seconds')
    .option('-v, --versionstamp <versionstamp>', 'Version stamp')
    .option('--db-path <path>', 'Path to the KV database file')
    .action(async (key, value, options) => {
      try {
        const config = getConfig(options.dbPath);
        const keyArray = validateKey(key);
        const jsonValue = validateJsonValue(value);
        
        const setOptions: { expire?: number } = {};
        if (options.expire) {
          setOptions.expire = validateExpire(options.expire);
        }

        const kv = await connectToKv(config.dbPath!);
        await setEntry(kv, keyArray, jsonValue, setOptions);
        
        console.log(`Successfully set ${key}`);
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      } finally {
        await closeKv();
      }
    });
}