import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Book Configuration
const BOOK_CONFIG = {
  'english': {
    name: 'UKPSC Decoded - English Edition',
    amount: 49900, // ₹499 in paise
    description: 'Complete UKPSC Study Book - English',
  },
  'hindi': {
    name: 'UKPSC Decoded - हिंदी संस्करण',
    amount: 49900, // ₹499 in paise
    description: 'Complete UKPSC Study Book - हिंदी',
  },
};

// Verify environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing Razorpay credentials in .env.local');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, address, city, pincode, state, landmark, language } = body;

    // Validate required fields
    if (!name || !phone || !email || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, email, language' },
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

    // Check if language/book exists
    const bookKey = language === 'hi' ? 'hindi' : 'english';
    if (!BOOK_CONFIG[bookKey as keyof typeof BOOK_CONFIG]) {
      return NextResponse.json(
        { error: 'Book edition not found' },
        { status: 404 }
      );
    }

    const book = BOOK_CONFIG[bookKey as keyof typeof BOOK_CONFIG];

    // Generate unique receipt ID
    const receiptId = `UKPSC_BOOK_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create Razorpay order with customer data in notes
    const order = await razorpay.orders.create({
      amount: book.amount,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: true,
      notes: {
        name: name.trim(),
        phone: phoneDigitsOnly,
        email: email?.trim() || 'N/A',
        address: address?.trim() || 'N/A',
        city: city?.trim() || 'N/A',
        pincode: pincode?.trim() || 'N/A',
        state: state?.trim() || 'N/A',
        landmark: landmark?.trim() || 'N/A',
        language: language === 'hi' ? 'हिंदी' : 'English',
        bookEdition: book.name,
        timestamp: new Date().toISOString(),
      },
    });

    console.log(`✅ Book Order created: ${order.id} for ${name} (${language})`);

    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: book.amount,
      email: email || '',
      phone: phoneDigitsOnly,
      name: name.trim(),
      receiptId,
      language,
    });
  } catch (error) {
    console.error('❌ Error creating book order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
