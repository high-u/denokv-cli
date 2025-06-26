import Table from 'cli-table3';
import { KvEntry, OutputFormat } from '../types/cli-types.js';

export function formatOutput(data: KvEntry[], format: OutputFormat): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  return formatAsTable(data);
}

export function formatSingleEntry(entry: KvEntry | null, format: OutputFormat): string {
  if (format === 'json') {
    return JSON.stringify(entry, null, 2);
  }
  if (!entry) {
    return 'Key not found';
  }
  return formatAsTable([entry]);
}

function formatAsTable(entries: KvEntry[]): string {
  if (entries.length === 0) {
    return 'No entries found';
  }

  const table = new Table({
    head: ['Key', 'Value', 'Versionstamp'],
    style: {
      head: ['grey'],           // 色なし（デフォルトの端末色）
      border: ['grey'],   // ボーダーの色
      compact: false      // コンパクト表示
    }
  });

  entries.forEach(entry => {
    table.push([
      entry.key.join(':'),
      JSON.stringify(entry.value),
      entry.versionstamp
    ]);
  });

  return table.toString();
}