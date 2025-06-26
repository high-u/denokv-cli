import { OutputFormat } from '../types/cli-types.js';

export function validateOutputFormat(format: string): OutputFormat {
  if (format === 'table' || format === 'json') {
    return format;
  }
  throw new Error(`Invalid format: ${format}. Must be 'table' or 'json'`);
}

export function validateJsonValue(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid JSON value: ${value}`);
  }
}

export function validateKey(key: string): string[] {
  if (!key || key.trim() === '') {
    throw new Error('Key cannot be empty');
  }
  return key.split(':').filter(part => part.length > 0);
}

export function validateLimit(limit: string): number {
  const num = parseInt(limit, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error(`Invalid limit: ${limit}. Must be a positive number`);
  }
  return num;
}

export function validateExpire(expire: string): number {
  const num = parseInt(expire, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error(`Invalid expire: ${expire}. Must be a positive number`);
  }
  return num;
}