"use client"

import { useState } from "react"
import { DashboardHeader } from "./dashboard-header"
import { MeliConnectionCard } from "./meli-connection-card"
import { InvoicesTable, type Invoice } from "./invoices-table"

interface DashboardProps {
  onLogout: () => void
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    orderId: "MLB-2000456789",
    date: "15/03/2026",
    clientName: "María González",
    clientUsername: "maria.gonzalez",
    cuitDni: "20-34567890-1",
    amount: 4500000,
    status: "Pagado",
  },
  {
    id: "2",
    orderId: "MLB-2000456790",
    date: "15/03/2026",
    clientName: "Carlos Rodríguez",
    clientUsername: "carlos_rod",
    cuitDni: "23-45678901-9",
    amount: 128500,
    status: "Pagado",
  },
  {
    id: "3",
    orderId: "MLB-2000456791",
    date: "14/03/2026",
    clientName: "Ana Martínez",
    clientUsername: "ana.martinez",
    cuitDni: "27-56789012-4",
    amount: 32750,
    status: "Pagado",
  },
  {
    id: "4",
    orderId: "MLB-2000456792",
    date: "14/03/2026",
    clientName: "Pedro Sánchez",
    clientUsername: "pedrosanchez",
    cuitDni: "20-67890123-8",
    amount: 89000,
    status: "Pagado",
  },
  {
    id: "5",
    orderId: "MLB-2000456793",
    date: "13/03/2026",
    clientName: "Laura Fernández",
    clientUsername: "lauraf_2024",
    cuitDni: "24-78901234-2",
    amount: 156200,
    status: "Pagado",
  },
]

export function Dashboard({ onLogout }: DashboardProps) {
  const [isMeliConnected, setIsMeliConnected] = useState(false)
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set())

  const mockUserName = "Juan Pérez"
  const mockStoreName = "Tienda ElectroShop Argentina"

  const handleConnectMeli = () => {
    setIsMeliConnected(true)
  }

  const handleDisconnectMeli = () => {
    setIsMeliConnected(false)
    setSelectedInvoiceIds(new Set())
  }

  const handleSelectAll = () => {
    if (selectedInvoiceIds.size === mockInvoices.length) {
      setSelectedInvoiceIds(new Set())
    } else {
      setSelectedInvoiceIds(new Set(mockInvoices.map((inv) => inv.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedInvoiceIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedInvoiceIds(newSelected)
  }

  const handleGenerateTxt = () => {
    alert(
      `Se simulará la generación del archivo Catedral para ${selectedInvoiceIds.size} facturas.`
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={mockUserName} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <MeliConnectionCard
            isConnected={isMeliConnected}
            storeName={mockStoreName}
            onConnect={handleConnectMeli}
            onDisconnect={handleDisconnectMeli}
          />
          {isMeliConnected && (
            <InvoicesTable
              invoices={mockInvoices}
              selectedIds={selectedInvoiceIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onGenerateTxt={handleGenerateTxt}
            />
          )}
        </div>
      </main>
    </div>
  )
}
