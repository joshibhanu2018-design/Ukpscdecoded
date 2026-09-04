import { NextRequest, NextResponse } from 'next/server';
import { validateToken, incrementDownloadCount } from '@/lib/utils/token-manager';

// PDF Configuration with GitHub raw URLs
const PDF_CONFIG = {
  'polity-decoded': {
    name: 'Polity Decoded: The Complete Visual e-Book for PCS Prelims cum Mains',
    fileUrl: 'https://github.com/joshibhanu2018-design/Ukpscdecoded/raw/main/website/public/ULTIMATE-INDIAN-POLITY-MASTER-e-BOOK%20(Recovered).pdf',
    fileName: 'Polity-Decoded-PCS-Guide.pdf',
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const pdfId = searchParams.get('pdfId') || 'polity-decoded';

    console.log(`📥 Download request: token=${token?.substring(0, 8)}..., pdfId=${pdfId}`);

    // ==============================
    // 1. VALIDATE TOKEN
    // ==============================
    if (!token) {
      console.error('❌ No download token provided');
      return NextResponse.json(
        { error: 'No download token provided' },
        { status: 400 }
      );
    }

    const tokenData = validateToken(token);

    if (!tokenData) {
      console.error(`❌ Invalid or expired token: ${token?.substring(0, 8)}`);
      return NextResponse.json(
        { error: 'Invalid or expired download link. Please purchase again.' },
        { status: 401 }
      );
    }

    // ==============================
    // 2. VALIDATE PDF ID MATCHES TOKEN
    // ==============================
    if (tokenData.pdfId !== pdfId) {
      console.error(`❌ Token PDF mismatch: expected ${tokenData.pdfId}, got ${pdfId}`);
      return NextResponse.json(
        { error: 'Token does not match requested PDF' },
        { status: 403 }
      );
    }

    // ==============================
    // 3. VALIDATE PDF CONFIG
    // ==============================
    const pdfConfig = PDF_CONFIG[pdfId as keyof typeof PDF_CONFIG];
    if (!pdfConfig) {
      console.error(`❌ PDF configuration not found: ${pdfId}`);
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    // ==============================
    // 4. FETCH PDF FROM GITHUB
    // ==============================
    console.log(`📥 Fetching: ${pdfConfig.name} from GitHub`);
    console.log(`   Size: ~10MB | URL: ${pdfConfig.fileUrl.substring(0, 50)}...`);

    let pdfArrayBuffer: ArrayBuffer;

    try {
      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(pdfConfig.fileUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) === 0) {
        throw new Error('PDF file is empty');
      }

      pdfArrayBuffer = await response.arrayBuffer();

      if (pdfArrayBuffer.byteLength === 0) {
        throw new Error('Downloaded PDF is empty');
      }

      console.log(`✅ PDF fetched successfully: ${(pdfArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error(`❌ Error fetching PDF from GitHub: ${errorMsg}`);
      
      return NextResponse.json(
        { 
          error: 'Failed to retrieve PDF. Please try again in a few moments.',
          details: 'GitHub server may be temporarily unavailable'
        },
        { status: 503 }
      );
    }

    // ==============================
    // 5. TRACK DOWNLOAD
    // ==============================
    incrementDownloadCount(token);
    console.log(`✅ Download count incremented for ${tokenData.name} (token: ${token.substring(0, 8)}...)`);

    // ==============================
    // 6. SEND PDF TO CLIENT
    // ==============================
    console.log(`📤 Sending PDF to client: ${pdfConfig.fileName}`);

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pdfConfig.fileName}"`,
        'Content-Length': pdfArrayBuffer.byteLength.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Unexpected error in download route: ${errorMsg}`);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during download' },
      { status: 500 }
    );
  }
}