// src/app/api/ocr/route.tsx
import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import * as temp from 'temp';
import * as fs from 'fs/promises';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return new NextResponse('No PDF file provided', { status: 400 });
    }

    // Create a temporary directory
    const tempDir = temp.mkdirSync();

    // Generate a unique file name
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${tempDir}/${fileName}`;

    // Write the uploaded file to the temporary directory
    const buffer = await file.arrayBuffer();
    await fs.writeFile(filePath, new Uint8Array(buffer));

    // Create a Tesseract.js worker
    const worker = await createWorker({
      workerPath: 'https://unpkg.com/tesseract.js@v2.1.0/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://unpkg.com/tesseract.js-core@v2.2.0/tesseract-core.wasm.js',
    });

    // Load the PDF file
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text },
    } = await worker.recognize(filePath);

    // Terminate the worker
    await worker.terminate();

    // Clean up the temporary file
    await fs.unlink(filePath);

    return NextResponse.json(
      {
        text: text.trim(),
        fileName: file.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OCR API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}