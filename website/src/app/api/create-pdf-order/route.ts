import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getEbook } from '@/lib/ebooks';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Verify environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing Razorpay credentials in .env.local');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, pdfId, email } = body;

    // Validate inputs
    if (!name || !phone || !pdfId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, pdfId' },
        { status: 400 }
      );
    }

    // Validate phone is at least 10 digits
    const phoneDigitsOnly = phone.replace(/\D/g, '');
    if (phoneDigitsOnly.length < 10) {
      return NextResponse.json(
        { error: 'Phone number must have at least 10 digits' },
        { status: 400 }
      );
    }

    const pdf = getEbook(pdfId);
    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    // Generate unique receipt ID
    const receiptId = `UKPSC_PDF_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create Razorpay order with customer data in notes
    const order = await razorpay.orders.create({
      amount: pdf.amount,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: true, // ✅ Fixed: boolean instead of number
      notes: {
        name: name.trim(),
        phone: phoneDigitsOnly,
        email: email?.trim() || 'N/A',
        pdfId: pdf.id,
        timestamp: new Date().toISOString(),
      },
    });

    console.log(`✅ Order created: ${order.id} for ${name}`);

    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: pdf.amount,
      email: email || '',
      phone: phoneDigitsOnly,
      name: name.trim(),
      receiptId,
    });
  } catch (error) {
    console.error('❌ Error creating PDF order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}