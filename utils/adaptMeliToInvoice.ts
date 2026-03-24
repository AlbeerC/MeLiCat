import { Invoice } from "@/components/invoices-table";

// Esta función toma la orden "cruda" de la API de MeLi
export const adaptMeliOrderToInvoice = (order: any): Invoice => {
  // Lógica para determinar si es A o B
  // Generalmente, si hay CUIT y es Responsable Inscripto, es A.
  const isCuit = order.billing_info?.doc_type === 'CUIT';
  const tipoFactura = isCuit ? 'A' : 'B';

  return {
    id: order.id.toString(),
    orderId: `MLB-${order.id}`,
    // Convertimos la fecha ISO de MeLi (2026-03-23T...) al formato DD/MM/YYYY
    date: new Date(order.date_created).toLocaleDateString('es-AR'),
    clientName: order.billing_info?.name || "Consumidor Final",
    cuitDni: order.billing_info?.doc_number || "0",
    amount: order.total_amount,
    status: order.status === 'paid' ? 'Pagado' : 'Pendiente',
    type: tipoFactura,
    // El CAE no viene en la orden de venta, se genera al facturar.
    // Para las pruebas, podemos usar un placeholder o el campo de MeLi si ya facturaron.
    cae: order.pack_id?.toString() || "0" 
  };
};