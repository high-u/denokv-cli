export type OutputFormat = 'table' | 'json';

export interface ListOptions {
  prefix?: string;
  start?: string;
  end?: string;
  reverse?: boolean;
  limit?: number;
  format: OutputFormat;
  dbPath?: string;
  keyMultiline?: boolean;
  prettyJson?: boolean;
}

export interface GetOptions {
  format: OutputFormat;
  dbPath?: string;
}

export interface GetManyOptions {
  format: OutputFormat;
  dbPath?: string;
}

export interface SetOptions {
  expire?: number;
  versionstamp?: string;
  dbPath?: string;
}

export interface DeleteOptions {
  dbPath?: string;
}

export interface Config {
  dbPath?: string;
}

export interface KvEntry {
  key: string[];
  value: unknown;
  versionstamp: string;
}