"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { MeliConnectionCard } from "./meli-connection-card";
import { InvoicesTable, type Invoice } from "./invoices-table";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";
import { downloadTxtFile } from "@/utils/DownloadTxtFile";

interface DashboardProps {
  onLogout: () => void;
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
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [isMeliConnected, setIsMeliConnected] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(
    new Set(),
  );

  /*   useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Por ahora, como es MVP, simulamos que el código es válido
      // En el futuro, acá harías el canje por el Token real
      setIsMeliConnected(true);

      // Limpiamos la URL para que no se vea el código
      window.history.replaceState({}, document.title, window.location.pathname);

      console.log("Conectado con éxito a MeLi. Código recibido:", code);
    }
  }, []); */

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Si entramos con ?test=true, activamos todo sin pedirle nada a MeLi
    if (code || window.location.search.includes("test=true")) {
      setIsMeliConnected(true);
      console.log("Modo Test activado");
    }
  }, []);

  const mockUserName = "Juan Pérez";
  const mockStoreName = "Tienda ElectroShop Argentina";

  const handleConnect = async () => {
    const verifier = generateCodeVerifier();
    // ¡CLAVE!: Guardamos el verifier en localStorage para cuando el usuario vuelva
    localStorage.setItem("meli_verifier", verifier);

    const challenge = await generateCodeChallenge(verifier);

    const clientId = process.env.NEXT_PUBLIC_MELI_CLIENT_ID;
    const redirectUri = process.env.PUBLIC_URL_DEPLOY;

    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&code_challenge=${challenge}&code_challenge_method=S256`;

    // Redirigimos a Mercado Libre
    window.location.href = authUrl;
  };

  const handleDisconnectMeli = () => {
    setIsMeliConnected(false);
    setSelectedInvoiceIds(new Set());
  };

  const handleSelectAll = () => {
    if (selectedInvoiceIds.size === mockInvoices.length) {
      setSelectedInvoiceIds(new Set());
    } else {
      setSelectedInvoiceIds(new Set(mockInvoices.map((inv) => inv.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedInvoiceIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInvoiceIds(newSelected);
  };

  const handleGenerateTxt = () => {
    // Filtramos solo las facturas que el usuario marcó en el checkbox
    const selectedData = mockInvoices.filter((inv) =>
      selectedInvoiceIds.has(inv.id),
    );

    if (selectedData.length === 0) return;

    // Creamos el encabezado (esto lo ajustaremos con el Excel de Catedral)
    let content = "Fecha;ID_Orden;Cliente;CUIT_DNI;Monto;Estado\n";

    // Agregamos cada fila
    selectedData.forEach((inv) => {
      content += `${inv.date};${inv.orderId};${inv.clientName};${inv.cuitDni};${inv.amount};${inv.status}\n`;
    });

    // Generamos el nombre del archivo con la fecha de hoy
    const fileName = `Ventas_MeLi_${new Date().toISOString().split("T")[0]}.txt`;

    // Disparamos la descarga
    downloadTxtFile(content, fileName);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={mockUserName} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <MeliConnectionCard
            isConnected={isMeliConnected}
            storeName={mockStoreName}
            onConnect={handleConnect}
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
  );
}
