"use client"

import { Link2, Link2Off, Store, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MeliConnectionCardProps {
  isConnected: boolean
  storeName: string
  onConnect: () => void
  onDisconnect: () => void
}

export function MeliConnectionCard({
  isConnected,
  storeName,
  onConnect,
  onDisconnect,
}: MeliConnectionCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Store className="h-5 w-5" />
          Conexión con Mercado Libre
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Vincula tu cuenta de MercadoLibre para sincronizar tus ventas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Cuenta Vinculada</p>
                <p className="text-sm text-muted-foreground">{storeName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onDisconnect}
              className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Link2Off className="mr-2 h-4 w-4" />
              Desconectar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE600]/10">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-[#FFE600]"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Conecta tu cuenta de MercadoLibre para comenzar a sincronizar tus ventas
            </p>
            <Button
              onClick={onConnect}
              className="bg-[#FFE600] text-[#333] hover:bg-[#FFE600]/90 font-medium"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Conectar con Mercado Libre
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
