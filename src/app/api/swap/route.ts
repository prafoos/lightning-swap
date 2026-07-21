import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const buyToken = searchParams.get('buyToken');
  const sellToken = searchParams.get('sellToken');
  const sellAmount = searchParams.get('sellAmount');

  if (!buyToken || !sellToken || !sellAmount) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

 

  try {
    const res = await fetch(
      `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${sellToken}&tokenOut=${buyToken}&amountIn=${sellAmount}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': 'LightningSwap'
        }
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}