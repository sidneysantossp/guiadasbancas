"use client";

import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  width?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number;
  hiddenOnMobile?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getId: (row: T) => string;
  onSelectRows?: (ids: string[]) => void;
  selectable?: boolean;
  actionsHeader?: string;
  renderActions?: (row: T) => React.ReactNode;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  // Server-side pagination (optional)
  serverMode?: boolean;
  serverPage?: number;
  serverPageSize?: number;
  serverTotal?: number;
  onServerPageChange?: (page: number) => void;
  onServerPageSizeChange?: (pageSize: number) => void;
}

export default function DataTable<T>({ columns, data, getId, onSelectRows, selectable = false, actionsHeader = "Ações", renderActions, initialPageSize = 10, pageSizeOptions = [10, 20, 50], serverMode = false, serverPage = 1, serverPageSize = initialPageSize, serverTotal, onServerPageChange, onServerPageSizeChange }: DataTableProps<T>) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  React.useEffect(() => {
    if (!selectable) return;
    setSelected([]);
    onSelectRows?.([]);
  }, [data, selectable, onSelectRows]);

  const toggleOne = (id: string) => {
    if (!selectable) return;
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      onSelectRows?.(next);
      return next;
    });
  };

  const onClickHeader = (c: Column<T>) => {
    if (!c.sortable) return;
    if (sortKey === c.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(c.key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sorted = React.useMemo(() => {
    if (serverMode) return data; // sorting handled by server or disabled
    if (!sortKey) return data;
    const col = columns.find((x) => x.key === sortKey);
    if (!col) return data;
    const accessor = col.sortAccessor || ((row: any) => (row as any)[col.key]);
    const arr = [...data];
    arr.sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      const na = typeof va === 'string' ? va.toString().toLowerCase() : Number(va);
      const nb = typeof vb === 'string' ? vb.toString().toLowerCase() : Number(vb);
      if (na < nb) return sortDir === 'asc' ? -1 : 1;
      if (na > nb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sortKey, sortDir, columns, serverMode]);

  const effectivePageSize = serverMode ? serverPageSize : pageSize;
  const total = serverMode ? (serverTotal ?? data.length) : sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));
  const currentPage = Math.min(serverMode ? serverPage : page, totalPages);
  const start = (currentPage - 1) * effectivePageSize;
  const end = start + effectivePageSize;
  const pageRows = serverMode ? data : sorted.slice(start, end);

  const toggleAll = () => {
    if (!selectable) return;
    // Check if all items on CURRENT PAGE are selected
    const pageIds = pageRows.map(getId);
    const allPageSelected = pageIds.every(id => selected.includes(id));
    
    if (allPageSelected) {
      // Deselect all items from current page
      const next = selected.filter(id => !pageIds.includes(id));
      setSelected(next);
      onSelectRows?.(next);
    } else {
      // Select all items from current page
      const next = [...new Set([...selected, ...pageIds])];
      setSelected(next);
      onSelectRows?.(next);
    }
  };

  return (
    <div className="overflow-auto border border-gray-200 rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {selectable && (
              <th className="px-3 py-2 text-left w-10">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  onChange={toggleAll} 
                  checked={pageRows.length > 0 && pageRows.every(row => selected.includes(getId(row)))} 
                  aria-label="Selecionar todos da página"
                />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ width: c.width, cursor: c.sortable ? 'pointer' : undefined }}
                className={`${c.hiddenOnMobile ? 'hidden sm:table-cell' : ''} px-3 py-2 text-${c.align||"left"} ${c.sortable ? 'select-none hover:bg-gray-100' : ''}`}
                onClick={() => onClickHeader(c)}
              >
                <span className="inline-flex items-center gap-1">
                  {c.header}
                  {sortKey === c.key && (
                    <span className="text-gray-400">{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
            <th className="px-3 py-2 text-right">{actionsHeader}</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row) => {
            const id = getId(row);
            return (
              <tr key={id} className="border-t">
                {selectable && (
                  <td className="px-3 py-2 w-10">
                    <input type="checkbox" className="rounded" checked={selected.includes(id)} onChange={() => toggleOne(id)} aria-label={`Selecionar ${id}`}/>
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={`${c.hiddenOnMobile ? 'hidden sm:table-cell' : ''} px-3 py-2 text-${c.align||"left"}`}>{c.render ? c.render(row) : (row as any)[c.key]}</td>
                ))}
                <td className="px-3 py-2 text-right">
                  {renderActions ? renderActions(row) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-3 text-sm text-gray-600">
        <div>
          Mostrando {Math.min(end, total)} de {total}
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden sm:block">Por página</label>
          <select
            className="rounded-md border border-gray-300 px-2 py-1"
            value={effectivePageSize}
            onChange={(e)=>{
              const next = parseInt(e.target.value);
              if (serverMode) {
                onServerPageSizeChange?.(next);
                onServerPageChange?.(1);
              } else {
                setPageSize(next); 
                setPage(1);
              }
            }}
          >
            {pageSizeOptions.map((n)=> (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage<=1} onClick={()=> serverMode ? onServerPageChange?.(1) : setPage(1)}>{'<<'}</button>
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage<=1} onClick={()=> serverMode ? onServerPageChange?.(Math.max(1, currentPage-1)) : setPage((p)=>Math.max(1,p-1))}>{'<'}</button>
            <span className="px-2">{currentPage}/{totalPages}</span>
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage>=totalPages} onClick={()=> serverMode ? onServerPageChange?.(Math.min(totalPages, currentPage+1)) : setPage((p)=>Math.min(totalPages,p+1))}>{'>'}</button>
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage>=totalPages} onClick={()=> serverMode ? onServerPageChange?.(totalPages) : setPage(totalPages)}>{'>>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
