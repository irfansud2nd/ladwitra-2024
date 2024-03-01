"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import AtletPaymentDialog from "@/components/silat/atlet/AtletPaymentDialog";
import { AtletState } from "@/utils/silat/atlet/atletConstats";

interface SelectableTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children: React.ReactNode;
}

export function SelectableTable<TData, TValue>({
  columns,
  data,
  children,
}: SelectableTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div className="h-full grid grid-rows-[1fr_auto] max-h-[calc(100vh-155px)]">
      <div className="relative w-full max-w-full overflow-auto">
        <Table>
          <TableHeader
            className="bg-secondary"
            style={{
              position: "sticky",
              top: "0",
              zIndex: "10",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data kosong.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          rows: table.getFilteredRowModel().rows,
          selectedRows: table.getSelectedRowModel().rows,
        })
      )}
    </div>
  );
}
