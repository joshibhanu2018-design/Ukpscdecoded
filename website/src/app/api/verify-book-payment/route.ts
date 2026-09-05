import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Verify environment variables
if (!process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing RAZORPAY_KEY_SECRET in .env.local');
}

// Function to submit order to Google Sheets
async function submitToGoogleSheet(orderData: any): Promise<void> {
  try {
    await fetch(
      'https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        mode: 'no-cors',
      }
    );
    console.log(`✅ Order submitted to Google Sheet: ${orderData.orderId}`);
  } catch (error) {
    console.error('❌ Failed to submit to Google Sheet:', error);
    // Don't throw - sheet submission failure shouldn't fail payment verification
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      name,
      email,
      phone,
      address,
      city,
      pincode,
      state,
      landmark,
      language,
    } = body;

    // Verify signature
    const body_string = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body_string)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error('❌ Invalid payment signature');
      return NextResponse.json(
        { error: 'Payment verification failed: Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`✅ Payment verified: ${razorpay_payment_id}`);

    // Prepare order data for Google Sheet
    const orderData = {
      name: name?.trim() || 'N/A',
      email: email?.trim() || 'N/A',
      phone: phone?.trim() || 'N/A',
      address: address?.trim() || 'N/A',
      city: city?.trim() || 'N/A',
      pincode: pincode?.trim() || 'N/A',
      state: state?.trim() || 'N/A',
      landmark: landmark?.trim() || 'N/A',
      language: language === 'hi' ? 'हिंदी' : 'English',
      timestamp: new Date().toISOString(),
      orderId,
      paymentId: razorpay_payment_id,
      status: 'PAYMENT_RECEIVED',
    };

    // Submit to Google Sheet (async - don't wait for it)
    await submitToGoogleSheet(orderData);

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error verifying book payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment. Please contact support.' },
      { status: 500 }
    );
  }
}
