'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  onTextExtracted: (text: string) => void;
};

const PDFExtractor = ({ onTextExtracted }: Props) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const extractText = async () => {
    if (pdfFile) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const response = await fetch("http://localhost:8000/convert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pdfFile: base64Data.split(",")[1] }),
          });

          if (response.ok) {
            const { text } = await response.json();
            onTextExtracted(text);
          } else {
            console.error("Text extraction failed");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      reader.readAsDataURL(pdfFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={extractText} disabled={!pdfFile}>
        Extract Text
      </Button>
    </div>
  );
};

export default PDFExtractor;
