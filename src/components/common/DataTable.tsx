import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({ 
  columns, 
  data, 
  loading = false,
  onRowClick,
  emptyMessage = 'No data available',
  actions
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  if (loading) {
    return (
      <Card className="bubo-glass overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="bubo-glass p-12 text-center">
        <p className="text-mist-gray">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="bubo-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-gray/20">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm text-mist-gray ${
                    column.sortable ? 'cursor-pointer hover:text-white select-none' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span>
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-left text-sm text-mist-gray w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-slate-gray/10 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-white/5' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm">
                    {column.render 
                      ? column.render((row as any)[column.key], row)
                      : String((row as any)[column.key] || '-')
                    }
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    {actions(row)}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
