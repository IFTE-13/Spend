"use client"

import { GetTransactionHistoryResponseType } from "@/app/api/transaction-history/route";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
  } from "@tanstack/react-table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import SkeletonWrapper from "@/components/wrapper/SkeletonWrapper";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "@/components/datatable/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/datatable/ColumnToggle";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv"
import { DownloadIcon, MoreHorizontal } from "lucide-react";
import { TrashIcon } from "@radix-ui/react-icons";
import DeleteTranactionDialog from "./DeleteTranactionDialog";

interface Props {
    from: Date;
    to: Date;
}
type TransactionHistoryRow = GetTransactionHistoryResponseType[0]

// Define the empty data array with the correct type
const emptyData: TransactionHistoryRow[] = [];

// Define type for CSV export data
type CSVRow = {
    [key: string]: string | number;
}

export const columns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Category"} />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        cell: ({row}) => 
        <div className="flex gap-2 capitalize">
            {row.original.categoryIcon}
            <div className="capitalize">
                {row.original.category}
            </div>
        </div>
    },
    {
        accessorKey: "description",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Description"} />
        ),
        cell: ({row}) => 
        <div className="capitalize">
            {row.original.description}
        </div>
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({row}) => {
        const date = new Date(row.original.date);
        const formatedDate = date.toLocaleDateString("default", {
            timeZone: "UTC",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        })
        return (<div className="text-muted-foreground">
            {formatedDate}
        </div>)}
    },
    {
        accessorKey: "type",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Type"} />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        cell: ({row}) => 
        <div className={cn("capitalize text-lg text-center p-2",
            row.original.type === "income" && "bg-emerald-400/10",
            row.original.type === "expense" && "bg-red-400/10"
        )}>
            {row.original.type}
        </div>
    },
    {
        accessorKey: "amount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Amount"} />
        ),
        cell: ({row}) => 
        <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
            {row.original.amount}
        </p>
    },
    {
        accessorKey: "actions",
        enableHiding: false,
        cell: ({row}) => 
            <RowActions transaction={row.original} />
    },
];

const csvConfig = mkConfig({
    fieldSeparator: ".",
    decimalSeparator: ".",
    useKeysAsHeaders: true
})

export default function Transactiontable({from, to}: Props) {
  const [ sorting, setSorting ] = useState<SortingState>([]);
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([])
  const history = useQuery<GetTransactionHistoryResponseType>({
    queryKey: ["transactions", "history", from, to],
    queryFn: () => fetch(
        `/api/transaction-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
    ).then((res) => res.json())
  })

  const handleExportCSV = (data: CSVRow[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  }

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
        sorting,
        columnFilters
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const categoriesOptions = useMemo(() => {
    const categoresMap = new Map<string, { value: string; label: string }>();
    history.data?.forEach(transaction => {
        categoresMap.set(transaction.category, {
            value: transaction.category,
            label: `${transaction.categoryIcon} ${transaction.category}`
        })
    })

    const uniqueCategories = new Set(categoresMap.values())
    return Array.from(uniqueCategories)
  }, [history.data])

  if (history.isError) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Failed to load transactions. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
        <div className="flex flex-wrap items-end justify-between gap-2 py-4">
            <div className="flex gap-2">
                {table.getColumn("category") && (
                    <DataTableFacetedFilter 
                    title="Category" 
                    column={table.getColumn("category")}
                    options={categoriesOptions} 
                    />
                )}
                {table.getColumn("type") && (
                    <DataTableFacetedFilter 
                    title="Type" 
                    column={table.getColumn("type")}
                    options={[
                        {label: "Income", value: "income"},
                        {label: "Expense", value: "expense"}
                    ]} 
                    />
                )}
            </div>
            <div className="flex flex-wrap gap-2">
            <Button
                variant={"outline"}
                size={"sm"}
                className="ml-auto h-8 lg:flex"
                onClick={() => {
                    const data: CSVRow[] = table.getFilteredRowModel().rows.map(row => {
                        // Convert Date to string and handle null description
                        const date = new Date(row.original.date);
                        const formattedDate = date.toLocaleDateString("default", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        });
                        
                        return {
                            category: row.original.category,
                            categoryIcon: row.original.categoryIcon,
                            description: row.original.description ?? '', // Convert null to empty string
                            type: row.original.type,
                            amount: row.original.amount,
                            date: formattedDate,
                        }
                    })
                    handleExportCSV(data);
                }}
            >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
                <DataTableViewOptions table={table} />
            </div>
        </div>
        <SkeletonWrapper isLoading={history.isFetching}>
          <div className="rounded-md border">
            <Table>
                <TableHeader>
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
                        )
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                Previous
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                Next
                </Button>
            </div>
            </SkeletonWrapper>
    </div>
  )
}

function RowActions({transaction} : {transaction : TransactionHistoryRow}) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteTranactionDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} transactionId={transaction.id} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                    variant={"ghost"}
                    className="h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                    className="flex items-center gap-2"
                    onSelect={() => {setShowDeleteDialog(prev => !prev)}}
                    >
                        <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}