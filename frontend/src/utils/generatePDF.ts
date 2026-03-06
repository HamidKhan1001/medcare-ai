// src/utils/generatePDF.ts
import jsPDF from 'jspdf';

export const generateMedicalPDF = (data: {
  scanType: string;
  report: string;
  severity: string;
  confidence: number;
  time: number;
  filename: string;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(27, 79, 138);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MedCare AI', 20, 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Pakistan\'s First AI Medical Platform', 20, 24);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 31);

  // Reset color
  doc.setTextColor(0, 0, 0);

  // Scan Info Box
  doc.setFillColor(240, 247, 255);
  doc.rect(15, 42, pageWidth - 30, 28, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Scan Information', 20, 52);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Scan Type: ${data.scanType.toUpperCase()}`, 20, 60);
  doc.text(`File: ${data.filename}`, 80, 60);
  doc.text(`Confidence: ${data.confidence}%`, 20, 67);
  doc.text(`Analysis Time: ${data.time}s`, 80, 67);

  // Severity
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Severity Level:', 20, 82);
  doc.setFontSize(16);

  const severityColor =
    data.severity.includes('Normal')   ? [39, 174, 96]   :
    data.severity.includes('Mild')     ? [243, 156, 18]  :
    data.severity.includes('Moderate') ? [230, 126, 34]  :
    [231, 76, 60];

  doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
  doc.text(data.severity, 70, 82);
  doc.setTextColor(0, 0, 0);

  // Report
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Medical Report', 20, 95);

  doc.setDrawColor(27, 79, 138);
  doc.line(20, 97, pageWidth - 20, 97);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const lines = doc.splitTextToSize(data.report, pageWidth - 40);
  let yPos = 105;

  lines.forEach((line: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 20, yPos);
    yPos += 6;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(27, 79, 138);
    doc.rect(0, 283, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      'MedCare AI — Syed Hassan Tayyab — Atomcamp Cohort 15 — 2026',
      pageWidth / 2, 291, { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, 291);
  }

  // Disclaimer
  doc.setPage(pageCount);
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  const disclaimer = '⚠️ This AI-generated report requires doctor verification before clinical use.';
  doc.text(disclaimer, pageWidth / 2, yPos + 10, { align: 'center' });

  // Download
  doc.save(`MedCare_AI_${data.scanType}_${Date.now()}.pdf`);
};