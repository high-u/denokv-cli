# denokv - Deno KV CLI Explorer Tool

A command-line interface tool for exploring and managing Deno KV databases. This tool provides an easy way to interact with Deno KV stores through simple commands.

## Acknowledgments

This tool was inspired by [denoro](https://github.com/davrodpin/denoro), an excellent Deno KV CLI tool. We appreciate their innovative approach to Deno KV management.

## Features

- **List records** with filtering, pagination, and sorting options
- **Get single or multiple records** by key
- **Set records** with JSON values and expiration support
- **Delete records** by key
- **Multiple output formats** (table and JSON)
- **Unicode support** for proper display of multibyte characters
- **Environment variable support** for database path configuration

## Installation

```bash
npm install -g @high-u/denokv
```

## Usage

### Basic Syntax

```bash
denokv <command> [options] [arguments]
```

### Global Options

- `--db-path <path>` - Path to the KV database file
- `--help` - Show help for a command
- `--version` - Show version information

### Environment Variables

You can set the database path using an environment variable:

```bash
export DENO_KV_CLI_DB_PATH=/path/to/your/database.db
```

## Commands

### 1. list - List KV Records

List all records in the database with optional filtering and formatting.

```bash
denokv list [options]
```

#### Options

- `-p, --prefix <prefix>` - Filter records by key prefix
- `-s, --start <start>` - Start key for range queries
- `-e, --end <end>` - End key for range queries
- `-r, --reverse` - Reverse the order of results
- `-l, --limit <limit>` - Maximum number of results to return
- `-f, --format <format>` - Output format: `table` (default) or `json`
- `--db-path <path>` - Path to the KV database file

#### Examples

```bash
# List all records in table format
denokv list --db-path ./my-database.db

# List records with prefix "user"
denokv list --prefix user --db-path ./my-database.db

# List first 10 records in JSON format
denokv list --limit 10 --format json --db-path ./my-database.db

# List records in reverse order
denokv list --reverse --db-path ./my-database.db

# List records between "user:001" and "user:999"
denokv list --start "user:001" --end "user:999" --db-path ./my-database.db
```

### 2. get - Get a Single Record

Retrieve a single record by its key.

```bash
denokv get <key> [options]
```

#### Arguments

- `<key>` - The key to retrieve (use colon `:` to separate key parts)

#### Options

- `-f, --format <format>` - Output format: `table` (default) or `json`
- `--db-path <path>` - Path to the KV database file

#### Examples

```bash
# Get a record by key
denokv get "user:123" --db-path ./my-database.db

# Get a record in JSON format
denokv get "user:123" --format json --db-path ./my-database.db

# Get a record with complex key
denokv get "app:users:profile:456" --db-path ./my-database.db
```

### 3. get-many - Get Multiple Records

Retrieve multiple records by their keys in a single command.

```bash
denokv get-many <key1> <key2> [...keyN] [options]
```

#### Arguments

- `<keys...>` - Multiple keys to retrieve

#### Options

- `-f, --format <format>` - Output format: `table` (default) or `json`
- `--db-path <path>` - Path to the KV database file

#### Examples

```bash
# Get multiple records
denokv get-many "user:123" "user:456" "user:789" --db-path ./my-database.db

# Get multiple records in JSON format
denokv get-many "config:app" "config:db" --format json --db-path ./my-database.db
```

### 4. set - Set a Record

Create or update a record with a key-value pair.

```bash
denokv set <key> <value> [options]
```

#### Arguments

- `<key>` - The key to set (use colon `:` to separate key parts)
- `<value>` - The value to set (must be valid JSON)

#### Options

- `-e, --expire <seconds>` - Set expiration time in seconds
- `-v, --versionstamp <versionstamp>` - Specify version stamp
- `--db-path <path>` - Path to the KV database file

#### Examples

```bash
# Set a simple string value
denokv set "user:123" '"John Doe"' --db-path ./my-database.db

# Set a JSON object
denokv set "user:456" '{"name":"Jane","age":30}' --db-path ./my-database.db

# Set a value with expiration (1 hour)
denokv set "session:abc" '"active"' --expire 3600 --db-path ./my-database.db

# Set a number value
denokv set "counter:visits" '42' --db-path ./my-database.db

# Set an array value
denokv set "tags:popular" '["javascript","deno","kv"]' --db-path ./my-database.db
```

### 5. delete - Delete a Record

Remove a record from the database by its key.

```bash
denokv delete <key> [options]
```

#### Arguments

- `<key>` - The key to delete

#### Options

- `--db-path <path>` - Path to the KV database file

#### Examples

```bash
# Delete a record
denokv delete "user:123" --db-path ./my-database.db

# Delete a record with complex key
denokv delete "app:cache:session:xyz" --db-path ./my-database.db
```

## Key Format

Keys in Deno KV are arrays of strings, numbers, or other primitive values. In this CLI:

- Use colon `:` to separate key parts
- Example: `"user:123"` becomes `["user", "123"]` in the database
- Example: `"app:config:theme"` becomes `["app", "config", "theme"]`

## Value Format

Values must be provided as valid JSON strings:

- Strings: `'"hello world"'` (note the inner quotes)
- Numbers: `'42'` or `'3.14'`
- Booleans: `'true'` or `'false'`
- Objects: `'{"name":"John","age":30}'`
- Arrays: `'[1,2,3]'` or `'["a","b","c"]'`
- Null: `'null'`

## Output Formats

### Table Format (Default)

Pretty-printed table with Unicode support for multibyte characters:

```
┌─────────────┬─────────────────────────┬─────────────────────────────────────────────┐
│ Key         │ Value                   │ Versionstamp                                │
├─────────────┼─────────────────────────┼─────────────────────────────────────────────┤
│ user:123    │ "John Doe"              │ 00000000000000010000                        │
│ user:456    │ {"name":"Jane","age":30}│ 00000000000000020000                        │
└─────────────┴─────────────────────────┴─────────────────────────────────────────────┘
```

### JSON Format

Raw JSON output suitable for programmatic processing:

```json
[
  {
    "key": ["user", "123"],
    "value": "John Doe",
    "versionstamp": "00000000000000010000"
  },
  {
    "key": ["user", "456"],
    "value": {"name": "Jane", "age": 30},
    "versionstamp": "00000000000000020000"
  }
]
```

## Error Handling

The CLI provides clear error messages for common issues:

- **Missing database path**: Provide `--db-path` option or set `DENO_KV_CLI_DB_PATH` environment variable
- **Invalid JSON value**: Ensure values are properly formatted JSON strings
- **Key not found**: The specified key doesn't exist in the database
- **Invalid format**: Output format must be either `table` or `json`

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/high-u/denokv-cli.git
cd denokv-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm start -- list --db-path ./test.db
```

### Development Mode

```bash
# Run in development mode with file watching
npm run dev
```

## Architecture

This CLI follows the **functional core, imperative shell** architecture pattern:

- **Core functions** (`src/core/`): Pure functions for KV operations, validation, and formatting
- **Commands** (`src/commands/`): Imperative shells that handle CLI interaction and orchestrate core functions
- **Utilities** (`src/utils/`): Configuration and connection management
- **Types** (`src/types/`): TypeScript type definitions

## Requirements

- Node.js 18.0.0 or higher
- Deno KV database file

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
