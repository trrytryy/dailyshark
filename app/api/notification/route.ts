import { NextResponse } from 'next/server';
import { sendNotificationMessage } from '../../utils/notification';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body', error_code: 5 },
        { status: 400 }
      );
    }
    
    const rawData = body?.data;
    await sendNotificationMessage(rawData);

    return NextResponse.json({ message: 'Success', error_code: 0 }, { status: 200 });
  } catch (err) {
    console.error('Unhandled error:', err);
    return NextResponse.json(
      { message: 'Internal server error', error_code: 2 },
      { status: 500 }
    );
  }
}
