import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get('sellerId');
  const token = request.headers.get('Authorization');

  if (!sellerId || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.mercadolibre.com/orders/search?seller=${sellerId}`, {
      headers: { 'Authorization': token }
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Fallo al buscar órdenes' }, { status: 500 });
  }
}