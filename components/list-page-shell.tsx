"use client"

import { useState } from "react"
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"
import { Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/data-table"

export type FilterConfig = {
  type: "select"
  label: string
  columnId: string
  options: { value: string; label: string }[]
}

type Props<TData> = {
  title: string
  description: string
  data: TData[]
  columns: ColumnDef<TData>[]
  searchPlaceholder?: string
  filters?: FilterConfig[]
  extra?: React.ReactNode
}

export default function ListPageShell<TData>({
  title,
  description,
  data,
  columns,
  searchPlaceholder,
  filters,
  extra,
}: Props<TData>) {
  const [search, setSearch] = useState("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleFilterChange = (columnId: string, value: string) => {
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== columnId)
      if (!value || value === "all") return rest
      return [...rest, { id: columnId, value }]
    })
  }

  const filterValue = (columnId: string) =>
    columnFilters.find((f) => f.id === columnId)?.value as string | undefined

  const hasFilters = !!(searchPlaceholder || (filters && filters.length > 0))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {hasFilters && (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {searchPlaceholder && (
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  البحث
                </Label>
                <div className="relative">
                  <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    className="pr-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            )}
            {filters?.map((filter) => (
              <div key={filter.columnId}>
                <Label className="mb-2 block text-sm font-medium">
                  {filter.label}
                </Label>
                <Select
                  value={filterValue(filter.columnId) ?? "all"}
                  onValueChange={(v) =>
                    handleFilterChange(filter.columnId, v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
        <DataTable
          columns={columns}
          data={data}
          globalFilter={search}
          onGlobalFilterChange={setSearch}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
        />
      </CardContent>
    </Card>
  )
}
