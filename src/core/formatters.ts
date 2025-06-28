import Table from 'cli-table3';
import { KvEntry, OutputFormat, ListOptions } from '../types/cli-types.js';

export function formatOutput(data: KvEntry[], format: OutputFormat, options?: Pick<ListOptions, 'keyMultiline' | 'prettyJson'>): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  return formatAsTable(data, options);
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

function formatAsTable(entries: KvEntry[], options?: Pick<ListOptions, 'keyMultiline' | 'prettyJson'>): string {
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
    // Format key based on keyMultiline option
    const keyDisplay = options?.keyMultiline 
      ? entry.key.join('\n')
      : entry.key.join(':');

    // Format value based on prettyJson option
    const valueDisplay = options?.prettyJson
      ? JSON.stringify(entry.value, null, 2)
      : JSON.stringify(entry.value);

    table.push([
      keyDisplay,
      valueDisplay,
      entry.versionstamp
    ]);
  });

  return table.toString();
}