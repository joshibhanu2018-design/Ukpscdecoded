import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createDownloadToken, DOWNLOAD_LINK_TTL_MS, getEbook } from '@/lib/ebooks';

/**
 * ============================================================================
 * E-BOOK PURCHASE: verify the Razorpay payment, log it to the Google Form,
 * and return a signed, expiring download link (see src/lib/ebooks.ts).
 * ============================================================================
 */

// ============================================================================
// GOOGLE FORM CONFIGURATION - YOUR VERIFIED ENTRY IDs
// ============================================================================
const GOOGLE_FORM_ID = '1FAIpQLSevnF3f2W6wit_O0i5JNTX_U_fSmCz1QpBqYBXZRK4zTBICMg';
const GOOGLE_FORM_ACTION = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

// ✅ THESE ARE YOUR ENTRY IDs (you provided these)
const GOOGLE_FORM_FIELDS = {
  name: 'entry.1555895149',      // NAME field
  phone: 'entry.594598154',      // NUMBER field
  pdfName: 'entry.1129932094',   // E-BOOK NAME field
  paymentId: 'entry.717333877'   // PAYMENT ID field
};

// ============================================================================
// UTILITY: Verify Razorpay Signature
// ============================================================================
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  try {
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');
    const isValid = digest === signature;
    
    if (!isValid) {
      console.error('❌ Signature mismatch:', { provided: signature, expected: digest });
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
}

// ============================================================================
// MAIN: Submit to Google Form
// ============================================================================
async function submitToGoogleForm(
  name: string,
  phone: string,
  pdfName: string,
  paymentId: string
): Promise<{ success: boolean; message: string; timestamp: string }> {
  const submissionTime = new Date().toISOString();
  
  try {
    // Validate inputs before submission
    if (!name || !phone || !pdfName || !paymentId) {
      console.warn('⚠️ Missing form fields:', { 
        name: name ? '✓' : '✗', 
        phone: phone ? '✓' : '✗', 
        pdfName: pdfName ? '✓' : '✗', 
        paymentId: paymentId ? '✓' : '✗' 
      });
      return { 
        success: false, 
        message: 'Missing required fields',
        timestamp: submissionTime 
      };
    }

    // Sanitize and trim all inputs
    const sanitizedName = String(name).trim().substring(0, 100);
    const sanitizedPhone = String(phone).trim().substring(0, 20);
    const sanitizedPdfName = String(pdfName).trim().substring(0, 200);
    const sanitizedPaymentId = String(paymentId).trim().substring(0, 100);

    // Create FormData for submission
    const formData = new FormData();
    formData.append(GOOGLE_FORM_FIELDS.name, sanitizedName);
    formData.append(GOOGLE_FORM_FIELDS.phone, sanitizedPhone);
    formData.append(GOOGLE_FORM_FIELDS.pdfName, sanitizedPdfName);
    formData.append(GOOGLE_FORM_FIELDS.paymentId, sanitizedPaymentId);

    // Log submission details for debugging
    console.log('📤 [FORM SUBMISSION] Starting Google Form submission...', {
      timestamp: submissionTime,
      formId: GOOGLE_FORM_ID,
      url: GOOGLE_FORM_ACTION,
      fields: {
        name: sanitizedName,
        phone: sanitizedPhone,
        pdfName: sanitizedPdfName,
        paymentId: sanitizedPaymentId,
      },
    });

    // Submit form using fetch with no-cors (required by Google Forms)
    const response = await fetch(GOOGLE_FORM_ACTION, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
      headers: {
        'Accept': '*/*',
      },
    });

    // With no-cors, response is opaque, but request was sent
    console.log('✅ [FORM SUCCESS] Form submission request sent to Google Forms');
    console.log(`📋 [DATABASE] Payment ${sanitizedPaymentId} logged for: ${sanitizedName} | ${sanitizedPhone}`);

    return { 
      success: true, 
      message: 'Form data logged to database successfully',
      timestamp: submissionTime
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ [FORM ERROR] Google Form submission failed:', {
      error: errorMessage,
      timestamp: submissionTime,
    });
    
    return { 
      success: false, 
      message: `Form submission encountered an error: ${errorMessage}`,
      timestamp: submissionTime
    };
  }
}

// ============================================================================
// MAIN API HANDLER: POST /api/verify-pdf-payment
// ============================================================================
export async function POST(request: NextRequest) {
  const requestTime = new Date().toISOString();
  console.log('\n' + '='.repeat(80));
  console.log(`[${requestTime}] 🚀 PAYMENT VERIFICATION STARTED`);
  console.log('='.repeat(80) + '\n');

  try {
    // Parse request body
    const body = await request.json();
    console.log('📥 Received payment data:', {
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      name: body.name,
      phone: body.phone,
      pdfId: body.pdfId || 'polity-decoded',
    });

    // Extract payment details
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

    // ========== STEP 1: Validate Input ==========
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ [VALIDATION] Missing payment verification data');
      return NextResponse.json(
        { 
          error: 'Missing payment verification data',
          fields: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        },
        { status: 400 }
      );
    }

    // ========== STEP 2: Verify Razorpay Signature ==========
    console.log('🔐 Verifying Razorpay signature...');
    const isSignatureValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || ''
    );

    if (!isSignatureValid) {
      console.error(`❌ [SECURITY] Invalid signature for payment ${razorpay_payment_id}`);
      return NextResponse.json(
        { error: 'Invalid payment signature. Payment verification failed.' },
        { status: 400 }
      );
    }
    console.log('✅ Razorpay signature verified successfully');

    // ========== STEP 3: Validate PDF Configuration ==========
    const pdfConfig = getEbook(pdfId);
    if (!pdfConfig) {
      console.error(`❌ [CONFIG] PDF configuration not found for pdfId: ${pdfId}`);
      return NextResponse.json(
        { error: 'PDF configuration not found' },
        { status: 400 }
      );
    }

    // ========== STEP 4: Check the order really is this e-book at full price ==========
    // The signature only proves Razorpay created the order with our key — the
    // course store shares that key, so a cheap course order must not unlock this.
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
      });
      const order = await razorpay.orders.fetch(razorpay_order_id);
      if (Number(order.amount) !== pdfConfig.amount || order.notes?.pdfId !== pdfConfig.id) {
        console.error(`❌ [SECURITY] Order ${razorpay_order_id} is not a ${pdfConfig.id} order`);
        return NextResponse.json(
          { error: 'This payment is not for this e-book. Please contact support.' },
          { status: 400 }
        );
      }
    } catch (orderError) {
      console.error('❌ Could not fetch Razorpay order:', orderError);
      return NextResponse.json(
        { error: `Could not confirm the order. Please contact support with Payment ID: ${razorpay_payment_id}` },
        { status: 502 }
      );
    }

    // ========== STEP 5: Signed download link ==========
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ukpscdecoded.in';
    const downloadLink = `${baseUrl}/api/download-pdf?token=${createDownloadToken(pdfConfig.id, razorpay_payment_id)}`;

    // ========== STEP 6: Submit to Google Form (Async) ==========
    console.log('📝 Submitting payment data to Google Form...');
    
    // Awaited: on Vercel, work left running after the response can be cut off.
    const formResult = await submitToGoogleForm(
      name || 'Customer',
      phone || 'N/A',
      pdfConfig.name,
      razorpay_payment_id
    );
    if (!formResult.success) console.warn('⚠️ Form submission encountered issues:', formResult.message);

    // ========== STEP 7: Send Success Response ==========
    console.log('\n' + '='.repeat(80));
    console.log(`✅ PAYMENT VERIFICATION SUCCESSFUL: ${razorpay_payment_id}`);
    console.log('='.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      downloadLink,
      expiresAt: Date.now() + DOWNLOAD_LINK_TTL_MS,
      message: 'Payment verified successfully! Your download link is ready.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      pdfName: pdfConfig.name,
      customer: {
        name: name || 'Customer',
        phone: phone || 'N/A',
        email: email || 'N/A',
      },
    });

  } catch (error) {
    console.error('\n❌ [FATAL ERROR] Payment verification failed:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed. Please contact support.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
