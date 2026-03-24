"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { MeliConnectionCard } from "./meli-connection-card";
import { InvoicesTable, type Invoice } from "./invoices-table";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";
import { downloadTxtFile } from "@/utils/DownloadTxtFile";

/* interface DashboardProps {
  onLogout: () => void;
} */

export function Dashboard() {
  const [isMeliConnected, setIsMeliConnected] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(
    new Set(),
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const isTest = urlParams.get("test") === "true";

    if (code) {
      console.log("Código detectado, iniciando intercambio...");
      handleLoginSuccess(code);
    } else if (isTest) {
      setIsMeliConnected(true);
      // Cargar mocks si es necesario
    }
    // No pongas un "else" que setee la conexión a true
  }, []);

  const handleLoginSuccess = async (code: string) => {
    setLoading(true);
    try {
      const verifier = localStorage.getItem("meli_verifier");

      // 1. Intercambiamos el código por el Token en tu API Route
      const res = await fetch("/api/meli/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, verifier }),
      });

      const auth = await res.json();

      if (auth.access_token) {
        setAccessToken(auth.access_token);
        setIsMeliConnected(true);

        // Limpiamos la URL para que no quede el ?code=...
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );

        // 2. Buscamos las ventas reales usando el ID del vendedor que se logueó
        await fetchRealMeliSales(auth.access_token, auth.user_id);
      }
    } catch (err) {
      console.error("Error al conectar con MeLi:", err);
      setError(err instanceof Error ? err : new Error("Fallo en la conexión"));
    } finally {
      setLoading(false);
    }
  };

  const fetchRealMeliSales = async (token: string, sellerId: string) => {
    try {
      // LLAMADA A TU PROPIA API (Sin problemas de CORS)
      const response = await fetch(`/api/meli/orders?sellerId=${sellerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const adaptedInvoices: Invoice[] = data.results.map((order: any) => ({
        id: order.id.toString(),
        orderId: `ML-${order.id}`,
        date: new Date(order.date_created).toLocaleDateString("es-AR"),
        clientName: order.billing_info?.name || "Consumidor Final",
        cuitDni: order.billing_info?.doc_number || "0",
        amount: order.total_amount,
        status: order.status === "paid" ? "Pagado" : "Pendiente",
        type: order.billing_info?.doc_type === "CUIT" ? "A" : "B",
        cae: order.pack_id?.toString() || "",
      }));

      setInvoices(adaptedInvoices);
    } catch (err) {
      console.error("Error trayendo ventas:", err);
    }
  };

  const mockUserName = "Distribuidora SuSeguridad";
  const mockStoreName = "Distribuidora SuSeguridad";

const handleConnect = async () => {
  // Hardcodeamos los valores que YA SABEMOS que tenés bien en MeLi
  const clientId = "3167839995667880"; 
  const redirectUri = "https://meli-cat.vercel.app"; // Sin barra al final

  try {
    const verifier = generateCodeVerifier();
    localStorage.setItem("meli_verifier", verifier);
    const challenge = await generateCodeChallenge(verifier);

    // Armamos la URL manualmente
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${challenge}&code_challenge_method=S256`;

    console.log("SALTANDO A MELI:", authUrl);
    window.location.href = authUrl;
  } catch (err) {
    console.error("Error en PKCE:", err);
  }
};

  const handleDisconnectMeli = () => {
    setIsMeliConnected(false);
    setSelectedInvoiceIds(new Set());
  };

  const handleSelectAll = () => {
    if (selectedInvoiceIds.size === invoices.length) {
      setSelectedInvoiceIds(new Set());
    } else {
      setSelectedInvoiceIds(new Set(invoices.map((inv) => inv.id)));
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

  /*   const handleGenerateTxt = () => {
    const selectedData = mockInvoices.filter((inv) =>
      selectedInvoiceIds.has(inv.id),
    );
    if (selectedData.length === 0) return;

    // Función auxiliar para forzar el ancho exacto (recorta o rellena)
    const formatField = (text: string | number, width: number) => {
      const cleanText = text?.toString() || "";
      return cleanText.substring(0, width).padEnd(width, " ");
    };

    // Función para montos: SIN puntos de miles, COMA decimal y alineado a la IZQUIERDA
    const formatMontoCatedral = (valor: number) => {
      const strMonto = valor.toFixed(2).replace(".", ",");
      return strMonto.padEnd(15, " ");
    };

    let content = "";

    selectedData.forEach((inv) => {
      const esFacturaA = inv.type === "A";

      // Lógica de anonimato para Catedral:
      // Si es B, forzamos "CF" y "Consumidor Final" como en el original
      const codigoCliente = esFacturaA ? inv.clientName : "CF";
      const nombreParaArchivo = esFacturaA
        ? inv.clientName
        : "Consumidor Final";

      let line = "";

      // Columna 1 a 5: Datos del cliente y condiciones
      line += formatField(codigoCliente, 15); // Código
      line += formatField(nombreParaArchivo, 45); // Cliente
      line += formatField("Contado", 45); // Condición de Venta
      line += formatField("ML", 42); // Vendedor
      line += formatField("Factura Remito", 45); // Comprobante

      // Columna 6 a 10: Letra, CAE y Fechas
      line += formatField(inv.type, 2); // Letra (A o B)
      line += formatField(inv.cae || "", 15); // CAE (15 chars según VENTAS.TXT)
      line += formatField(inv.date, 11); // Fecha
      line += formatField(inv.date, 11); // F. Contable
      line += formatField("4", 2); // Estado

      // Columna 11 a 13: Moneda y Totales
      line += formatField("Peso", 45); // Moneda
      line += formatField("1,0000", 7); // Cotización
      line += formatMontoCatedral(inv.amount); // Total (Usa la función sin puntos de miles)

      // Columna 14 a 17: Datos finales del comprobante
      line += formatField("FAC", 4); // Código comp.
      line += formatField("5", 5); // Sucursal
      line += formatField(inv.id.padStart(5, "0"), 6); // Número de factura
      line += formatField("28/03/2026", 11); // Vto. CAE (Simulado)

      content += line + "\r\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VENTAS_MELI_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
  }; */

  const handleGenerateTxt = () => {
    const selectedData = invoices.filter((inv) =>
      selectedInvoiceIds.has(inv.id),
    );
    if (selectedData.length === 0) return;

    // 1. Definimos el encabezado (basado en VENTAS.TXT)
    const incluirEncabezado = true; // Cambiá a false si el sistema de tu amigo tira error
    const header =
      "Código\tCliente\tCondición de Venta\tVendedor\tComprobante\tLetra\tCAE\tFecha\tF.Contable\tEstado\tMoneda\tCot.\tTotal\tCódigo\tSuc.\tNúmero\tVto. CAE\t";

    let content = incluirEncabezado ? header + "\r\n" : "";

    selectedData.forEach((inv) => {
      const esFacturaA = inv.type === "A";

      // Si es Factura B, forzamos los datos de "Consumidor Final" [cite: 52, 53]
      const codigoCliente = esFacturaA ? inv.clientName.substring(0, 15) : "CF";
      const nombreParaArchivo = esFacturaA
        ? inv.clientName
        : "Consumidor Final";

      // Creamos el array de campos en el orden EXACTO del TXT
      const campos = [
        codigoCliente.padEnd(15, " "), // Col 1: Código
        nombreParaArchivo.padEnd(30, " "), // Col 2: Cliente
        "Contado".padEnd(45, " "), // Col 3: Condición
        "ML".padEnd(42, " "), // Col 4: Vendedor
        "Factura Remito".padEnd(45, " "), // Col 5: Comprobante
        inv.type, // Col 6: Letra [cite: 52, 62]
        inv.cae || "", // Col 7: CAE [cite: 52, 62]
        inv.date, // Col 8: Fecha [cite: 52, 62]
        inv.date, // Col 9: F. Contable [cite: 52, 62]
        "4", // Col 10: Estado [cite: 52, 62]
        "Peso".padEnd(45, " "), // Col 11: Moneda
        "1,0000", // Col 12: Cotización
        inv.amount.toFixed(2).replace(".", ","), // Col 13: Total
        "FAC", // Col 14: Código comprobante
        "5", // Col 15: Sucursal
        inv.id.padStart(5, "0"), // Col 16: Número
        "28/3/2026", // Col 17: Vto. CAE
      ];

      // Unimos todo con TABS y agregamos el salto de línea Windows
      content += campos.join("\t") + "\t\r\n";
    });

    // Generación del archivo para descarga
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VENTAS_MELI_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={mockUserName} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <MeliConnectionCard
            isConnected={isMeliConnected}
            storeName={mockStoreName}
            onConnect={handleConnect}
            onDisconnect={handleDisconnectMeli}
          />
          {isMeliConnected && !loading && (
            <InvoicesTable
              invoices={invoices}
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
