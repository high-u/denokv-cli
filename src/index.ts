#!/usr/bin/env node

import { Command } from 'commander';
import { setupListCommand } from './commands/list.js';
import { setupGetCommand } from './commands/get.js';
import { setupGetManyCommand } from './commands/get-many.js';
import { setupSetCommand } from './commands/set.js';
import { setupDeleteCommand } from './commands/delete.js';

const program = new Command();

program
  .name('denokv')
  .description('Deno KV CLI Explorer Tool')
  .version('0.0.1');

program.addCommand(setupListCommand());
program.addCommand(setupGetCommand());
program.addCommand(setupGetManyCommand());
program.addCommand(setupSetCommand());
program.addCommand(setupDeleteCommand());

program.parse();