"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FullLoading from "@/components/loadings/FullLoading";
import { useDownloadExcel } from "react-export-table-to-excel";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface AdminTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  page?: number;
  nextPage?: () => void;
  prevPage?: () => void;
  disableNextPage?: boolean;
  disablePrevPage?: boolean;
  loading?: boolean;
  showAll?: () => void;
  downloadable?: boolean;
  customFileName?: string;
  hFit?: boolean;
  refresh?: () => void;
}

export function AdminTable<TData, TValue>({
  columns,
  data,
  title,
  page,
  nextPage,
  prevPage,
  disableNextPage,
  disablePrevPage,
  loading,
  showAll,
  downloadable,
  customFileName,
  hFit,
  refresh,
}: AdminTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: customFileName ?? "Tabel",
    sheet: "Data",
  });

  return (
    <div
      className={`relative w-full max-w-full grid grid-rows-[auto_1fr] overflow-auto max-h-full
      ${hFit ? "h-fit" : "h-full"}`}
    >
      <div className="flex flex-wrap2 items-center w-full py-1 gap-1 max-w-[calc(100vw-18px)] sm:max-w-[calc(100vw-194px)] sticky left-0">
        <h1 className="capitalize text-lg font-semibold">{title}</h1>
        {/* COLUMN VISIBILITY */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" size={"sm"}>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* MOBILE BUTTONS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:hidden" size={"sm"}>
              <IoMdMore />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={showAll} disabled={loading}>
              Show All
            </DropdownMenuItem>
            {downloadable && (
              <DropdownMenuItem onClick={onDownload} disabled={loading}>
                Download
              </DropdownMenuItem>
            )}
            {refresh && (
              <DropdownMenuItem onClick={refresh} disabled={loading}>
                refresh
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* SHOW ALL BUTTON */}
        {showAll && (
          <Button
            size="sm"
            onClick={showAll}
            disabled={loading}
            className="max-sm:hidden"
          >
            Show All
          </Button>
        )}
        {/* DOWNLOAD BUTTON */}
        {downloadable && (
          <Button
            size="sm"
            onClick={onDownload}
            disabled={loading}
            className="max-sm:hidden"
          >
            Download
          </Button>
        )}
        {/* REFRESH BUTTON */}
        {refresh && (
          <Button
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="max-sm:hidden"
          >
            Refresh
          </Button>
        )}
        {/* PAGINATION */}
        {nextPage && prevPage && (
          <div className=" flex gap-1 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={disablePrevPage || loading}
            >
              <MdSkipPrevious />
            </Button>
            <p className="text-xs">Page: {page}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={disableNextPage || loading}
            >
              <MdSkipNext />
            </Button>
          </div>
        )}
      </div>
      <Table className={loading ? "h-full" : "h-fit"} ref={tableRef}>
        <TableHeader
          className="bg-secondary"
          style={{ position: "sticky", top: "0" }}
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
        <TableBody className="whitespace-nowrap">
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <FullLoading overlay />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Data kosong.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
