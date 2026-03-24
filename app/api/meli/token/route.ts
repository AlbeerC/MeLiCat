// app/api/meli/token/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code, verifier } = await request.json();

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_MELI_CLIENT_ID!,
    client_secret: process.env.MELI_CLIENT_SECRET!, // SECRETO: Solo el servidor lo ve
    code: code,
    redirect_uri: process.env.NEXT_PUBLIC_URL_DEPLOY!,
    code_verifier: verifier,
  });

  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}