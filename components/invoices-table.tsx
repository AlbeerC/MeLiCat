"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface Invoice {
  id: string;
  orderId: string;
  date: string;
  clientName: string;
  cuitDni: string;
  amount: number;
  status: string;
  type: "A" | "B";
  cae: string;
}

interface InvoicesTableProps {
  invoices: Invoice[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onGenerateTxt: () => void;
}

export function InvoicesTable({
  invoices,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onGenerateTxt,
}: InvoicesTableProps) {
  const allSelected =
    invoices.length > 0 && selectedIds.size === invoices.length;
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < invoices.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

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
                <TableHead className="w-16 text-muted-foreground font-medium">
                  Tipo
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Cliente / Razón Social
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  CUIT/DNI
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Fecha
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">
                  Monto Total
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">
                  Estado MeLi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="border-border hover:bg-muted/30"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(inv.id)}
                      onCheckedChange={() => onSelectOne(inv.id)}
                      className="border-muted-foreground cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold ${
                        inv.type === "A"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      FAC {inv.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {inv.clientName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.cuitDni}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.date}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${inv.amount.toLocaleString("es-AR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                      {inv.status}
                    </span>
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
  );
}
