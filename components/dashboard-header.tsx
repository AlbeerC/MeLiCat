"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import melicatLogo from "../public/melicat-logo.png"
import Image from "next/image"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex py-2 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image src={melicatLogo} alt="melicat-logo" height={80} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userName}</span>
          </div>
{/*           <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary max-md:text-xs"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Cerrar Sesión
          </Button> */}
        </div>
      </div>
    </header>
  )
}
