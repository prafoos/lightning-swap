import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const buyToken = searchParams.get('buyToken');
  const sellToken = searchParams.get('sellToken');
  const sellAmount = searchParams.get('sellAmount');

  if (!buyToken || !sellToken || !sellAmount) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_ZEROX_API_KEY || '';

  try {
    const res = await fetch(
      `https://base.api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}`,
      {
        headers: {
          '0x-api-key': apiKey,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}