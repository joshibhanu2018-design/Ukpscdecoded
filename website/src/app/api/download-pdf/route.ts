import { NextRequest, NextResponse } from 'next/server';

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
    const pdfId = searchParams.get('pdfId') || 'polity-decoded';

    console.log(`📥 Download request for: ${pdfId}`);

    // ==============================
    // 1. VALIDATE PDF CONFIG
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
    // 2. FETCH PDF FROM GITHUB
    // ==============================
    console.log(`📥 Fetching PDF from GitHub: ${pdfConfig.fileUrl.substring(0, 60)}...`);

    let pdfArrayBuffer: ArrayBuffer;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(pdfConfig.fileUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      console.log(`📊 PDF Size: ${contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) + 'MB' : 'Unknown'}`);

      pdfArrayBuffer = await response.arrayBuffer();

      if (pdfArrayBuffer.byteLength === 0) {
        throw new Error('Downloaded PDF is empty');
      }

      console.log(`✅ PDF fetched successfully: ${(pdfArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error(`❌ Error fetching PDF: ${errorMsg}`);
      
      return NextResponse.json(
        { 
          error: 'Failed to retrieve PDF. Please try again.',
          details: errorMsg,
        },
        { status: 503 }
      );
    }

    // ==============================
    // 3. SEND PDF TO CLIENT
    // ==============================
    console.log(`📤 Sending PDF to client: ${pdfConfig.fileName}`);

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pdfConfig.fileName}"`,
        'Content-Length': pdfArrayBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Download error: ${errorMsg}`);
    
    return NextResponse.json(
      { error: 'Download failed', details: errorMsg },
      { status: 500 }
    );
  }
}