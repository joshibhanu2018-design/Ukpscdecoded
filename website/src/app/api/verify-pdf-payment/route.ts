import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  createToken,
  validateToken,
  incrementDownloadCount,
} from '@/lib/utils/token-manager';

// PDF Configuration
const PDF_CONFIG = {
  'polity-decoded': {
    name: 'Polity Decoded: The Complete Visual e-Book for PCS Prelims cum Mains',
    fileUrl: 'https://github.com/joshibhanu2018-design/Ukpscdecoded/raw/main/website/public/ULTIMATE-INDIAN-POLITY-MASTER-e-BOOK%20(Recovered).pdf',
  },
};

// Google Form configuration
const GOOGLE_FORM_ID = '1FAIpQLSevnF3f2W6wit_O0i5JNTX_U_fSmCz1QpBqYBXZRK4zTBICMg';
const GOOGLE_FORM_ACTION = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

// ✅ YOUR ACTUAL GOOGLE FORM ENTRY IDs (PROVIDED BY YOU)
const GOOGLE_FORM_FIELDS = {
  name: 'entry.1555895149',      // NAME field ✅
  phone: 'entry.594598154',      // NUMBER field ✅
  pdfName: 'entry.1129932094',   // EBOOK_NAME field ✅
  paymentId: 'entry.717333877'   // PAYMENT_ID field ✅
};

// Verify Razorpay signature
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(`${orderId}|${paymentId}`);
  const digest = shasum.digest('hex');
  return digest === signature;
}

// Submit to Google Form
async function submitToGoogleForm(
  name: string,
  phone: string,
  pdfName: string,
  paymentId: string
): Promise<boolean> {
  try {
    const formData = new URLSearchParams();
    formData.append(GOOGLE_FORM_FIELDS.name, name);
    formData.append(GOOGLE_FORM_FIELDS.phone, phone);
    formData.append(GOOGLE_FORM_FIELDS.pdfName, pdfName);
    formData.append(GOOGLE_FORM_FIELDS.paymentId, paymentId);

    const response = await fetch(GOOGLE_FORM_ACTION, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });

    console.log(`✅ Order submitted to Google Form: ${name} - ${phone}`);
    return true;
  } catch (error) {
    console.error('⚠️ Google Form submission error (non-critical):', error);
    return false;
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
      phone,
      email,
      pdfId = 'polity-decoded',
    } = body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || ''
    );

    if (!isSignatureValid) {
      console.error(`❌ Invalid signature for payment ${razorpay_payment_id}`);
      return NextResponse.json(
        { error: 'Invalid payment signature. Payment verification failed.' },
        { status: 400 }
      );
    }

    // Validate PDF exists
    const pdfConfig = PDF_CONFIG[pdfId as keyof typeof PDF_CONFIG];
    if (!pdfConfig) {
      return NextResponse.json(
        { error: 'PDF configuration not found' },
        { status: 500 }
      );
    }

    // Create secure download token (24-hour validity)
    const downloadToken = createToken(pdfId, name || 'Customer', phone || 'N/A', email);

    // Create download link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ukpscdecoded.in';
    const downloadLink = `${baseUrl}/api/download-pdf?token=${downloadToken}&pdfId=${pdfId}`;

    // Submit to Google Form (async, non-blocking)
    submitToGoogleForm(
      name || 'Customer',
      phone || 'N/A',
      pdfConfig.name,
      razorpay_payment_id
    ).catch((err) => console.error('Form submission error:', err));

    console.log(`✅ Payment verified successfully: ${razorpay_payment_id}`);

    return NextResponse.json({
      success: true,
      downloadLink,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      message: 'Payment verified successfully! Your download link is ready.',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed. Please contact support.' },
      { status: 500 }
    );
  }
}