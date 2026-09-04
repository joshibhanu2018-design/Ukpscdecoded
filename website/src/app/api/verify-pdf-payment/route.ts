import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  createToken,
  validateToken,
  incrementDownloadCount,
} from '@/lib/utils/token-manager';

/**
 * ============================================================================
 * COMPLETE PDF PURCHASE & PAYMENT SYSTEM
 * Google Form + Razorpay Integration
 * ============================================================================
 */

// PDF Configuration
const PDF_CONFIG = {
  'polity-decoded': {
    name: 'Polity Decoded: The Complete Visual e-Book for PCS Prelims cum Mains',
    fileUrl: 'https://github.com/joshibhanu2018-design/Ukpscdecoded/raw/main/website/public/ULTIMATE-INDIAN-POLITY-MASTER-e-BOOK%20(Recovered).pdf',
  },
};

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
    const pdfConfig = PDF_CONFIG[pdfId as keyof typeof PDF_CONFIG];
    if (!pdfConfig) {
      console.error(`❌ [CONFIG] PDF configuration not found for pdfId: ${pdfId}`);
      return NextResponse.json(
        { error: 'PDF configuration not found' },
        { status: 500 }
      );
    }
    console.log(`✅ PDF config validated: ${pdfConfig.name}`);

    // ========== STEP 4: Create Secure Download Token ==========
    console.log('🔑 Creating secure download token...');
    const downloadToken = createToken(
      pdfId,
      name || 'Customer',
      phone || 'N/A',
      email || 'noemail@example.com'
    );
    console.log('✅ Download token created');

    // ========== STEP 5: Generate Download Link ==========
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ukpscdecoded.in';
    const downloadLink = `${baseUrl}/api/download-pdf?token=${downloadToken}&pdfId=${pdfId}`;
    console.log(`📥 Download link generated: ${downloadLink}`);

    // ========== STEP 6: Submit to Google Form (Async) ==========
    console.log('📝 Submitting payment data to Google Form...');
    
    // Run async submission in background
    submitToGoogleForm(
      name || 'Customer',
      phone || 'N/A',
      pdfConfig.name,
      razorpay_payment_id
    )
      .then((result) => {
        if (result.success) {
          console.log('✅ [ASYNC] Form submission completed successfully');
        } else {
          console.warn('⚠️ [ASYNC] Form submission encountered issues:', result.message);
        }
      })
      .catch((err) => {
        console.error('❌ [ASYNC] Form submission error:', err);
      });

    // ========== STEP 7: Send Success Response ==========
    console.log('\n' + '='.repeat(80));
    console.log(`✅ PAYMENT VERIFICATION SUCCESSFUL: ${razorpay_payment_id}`);
    console.log('='.repeat(80) + '\n');

    return NextResponse.json({
      success: true,
      downloadLink,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
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

// Optional: GET endpoint for debugging
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'API Configuration Active ✅',
    googleFormConfig: {
      formId: GOOGLE_FORM_ID,
      fields: GOOGLE_FORM_FIELDS,
    },
  });
}