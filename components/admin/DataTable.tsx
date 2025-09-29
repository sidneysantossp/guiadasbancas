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
}

export default function DataTable<T>({ columns, data, getId, onSelectRows, selectable = false, actionsHeader = "Ações", renderActions, initialPageSize = 10, pageSizeOptions = [10, 20, 50] }: DataTableProps<T>) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const toggleAll = () => {
    if (!selectable) return;
    if (selected.length === data.length) {
      setSelected([]);
      onSelectRows?.([]);
    } else {
      const all = data.map(getId);
      setSelected(all);
      onSelectRows?.(all);
    }
  };

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
    if (!sortKey) return data;
    const col = columns.find((x) => x.key === sortKey);
    if (!col) return data;
    const accessor = col.sortAccessor || ((row: any) => row[col.key]);
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
  }, [data, sortKey, sortDir, columns]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = sorted.slice(start, end);

  return (
    <div className="overflow-auto border border-gray-200 rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {selectable && (
              <th className="px-3 py-2 text-left w-10">
                <input type="checkbox" className="rounded" onChange={toggleAll} checked={selected.length>0 && selected.length===data.length} aria-label="Selecionar todos"/>
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
            value={pageSize}
            onChange={(e)=>{ setPageSize(parseInt(e.target.value)); setPage(1); }}
          >
            {pageSizeOptions.map((n)=> (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage<=1} onClick={()=>setPage(1)}>{'<<'}</button>
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>{'<'}</button>
            <span className="px-2">{currentPage}/{totalPages}</span>
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage>=totalPages} onClick={()=>setPage((p)=>Math.min(totalPages,p+1))}>{'>'}</button>
            <button className="px-2 py-1 rounded border border-gray-300 disabled:opacity-50" disabled={currentPage>=totalPages} onClick={()=>setPage(totalPages)}>{'>>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
