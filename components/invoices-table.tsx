"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export interface Invoice {
  id: string
  orderId: string
  date: string
  clientName: string
  clientUsername: string
  cuitDni: string
  amount: number
  status: string
}

interface InvoicesTableProps {
  invoices: Invoice[]
  selectedIds: Set<string>
  onSelectAll: () => void
  onSelectOne: (id: string) => void
  onGenerateTxt: () => void
}

export function InvoicesTable({
  invoices,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onGenerateTxt,
}: InvoicesTableProps) {
  const allSelected = invoices.length > 0 && selectedIds.size === invoices.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < invoices.length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <FileText className="h-5 w-5" />
          Ventas Pendientes de Facturar
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Selecciona las ventas que deseas incluir en el archivo de facturación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    data-state={someSelected ? "indeterminate" : undefined}
                    onCheckedChange={onSelectAll}
                    aria-label="Seleccionar todas"
                    className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                  />
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">ID Orden MeLi</TableHead>
                <TableHead className="text-muted-foreground font-medium">Fecha</TableHead>
                <TableHead className="text-muted-foreground font-medium">Cliente</TableHead>
                <TableHead className="text-muted-foreground font-medium">CUIT/DNI</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Monto Total</TableHead>
                <TableHead className="text-muted-foreground font-medium">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="border-border hover:bg-muted/30"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(invoice.id)}
                      onCheckedChange={() => onSelectOne(invoice.id)}
                      aria-label={`Seleccionar orden ${invoice.orderId}`}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">
                    {invoice.orderId}
                  </TableCell>
                  <TableCell className="text-foreground">{invoice.date}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{invoice.clientName}</p>
                      <p className="text-xs text-muted-foreground">@{invoice.clientUsername}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">
                    {invoice.cuitDni}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success border-0"
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onGenerateTxt}
            disabled={selectedIds.size === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generar TXT ({selectedIds.size})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
