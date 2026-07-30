import { NextRequest, NextResponse } from 'next/server';

/**
 * Instamojo Payment Integration — Create Order API
 *
 * This route creates a payment request via Instamojo's API and returns the
 * payment URL to redirect the user for checkout.
 *
 * NOTE: This uses TEST MODE by default. For production:
 * - Change INSTAMOJO_API_URL to https://www.instamojo.com/api/1.1
 * - Use production API credentials
 *
 * Environment Variables Required:
 * - INSTAMOJO_AUTH_TOKEN: Your Instamojo API auth token
 * - INSTAMOJO_API_URL: Base URL for Instamojo API
 *   - Test: https://test.instamojo.com/api/1.1
 *   - Production: https://www.instamojo.com/api/1.1
 */

interface CreateOrderBody {
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderBody = await request.json();
    const { name, email, phone, amount, purpose } = body;

    // Validate required fields
    if (!name || !email || !phone || !amount || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, amount, purpose' },
        { status: 400 }
      );
    }

    // Validate phone number (10-digit Indian mobile)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount.' },
        { status: 400 }
      );
    }

    const authToken = process.env.INSTAMOJO_AUTH_TOKEN;
    const apiUrl = process.env.INSTAMOJO_API_URL || 'https://test.instamojo.com/api/1.1';

    if (!authToken) {
      console.error('INSTAMOJO_AUTH_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Payment gateway is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Create payment request on Instamojo
    const response = await fetch(`${apiUrl}/payment-requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Api-Key': authToken,
        'X-Auth-Token': authToken,
      },
      body: new URLSearchParams({
        purpose: purpose,
        amount: amount.toString(),
        buyer_name: name,
        email: email,
        phone: phone,
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/buy-book?status=success`,
        webhook: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment-webhook`,
        send_email: 'true',
        send_sms: 'true',
        allow_repeated_payments: 'false',
      }).toString(),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: data.payment_request.longurl,
        paymentRequestId: data.payment_request.id,
      });
    } else {
      console.error('Instamojo API error:', JSON.stringify(data));
      return NextResponse.json(
        {
          error: 'Failed to create payment request. Please try ordering via WhatsApp.',
          details: data.message || 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
