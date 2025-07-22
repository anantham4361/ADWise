import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (report: any) => {
  
  if (!report) {
    console.error('No report data provided for PDF export');
    return;
  }
  const doc = new jsPDF();
  const marginLeft = 15;
  let y = 20;

  // Title
  doc.setFontSize(16);
  doc.text('Ad Analysis Report', marginLeft, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(report.created_at).toLocaleDateString()}`, marginLeft, y);
  y += 10;

  // Persona Section
  doc.setFontSize(12);
  doc.text('Persona Details', marginLeft, y);
  y += 8;

  const p = report.personas;

  doc.setFontSize(10);
  const addLine = (label: string, value: string | number | string[] | null) => {
    if (Array.isArray(value)) value = value.length ? value.join(', ') : 'N/A';
    doc.text(`${label}: ${value ?? 'N/A'}`, marginLeft, y);
    y += 6;
  };

  addLine('Name', p?.name);
  addLine('Description', p?.description);

  y += 4;
  doc.setFontSize(12);
  doc.text('Analysis Results', marginLeft, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(`Ad Type: ${report.ad_type}`, marginLeft, y); y += 6;
  doc.text(`Winner: ${report.winner}`, marginLeft, y); y += 6;

  

  const totalA = report.ad_a_scores?.total;
  const totalB = report.ad_b_scores?.total;

  doc.text(`Ad A Total Score: ${totalA}`, marginLeft, y); y += 6;
  doc.text(`Ad B Total Score: ${totalB}`, marginLeft, y); y += 8;

  // Table of Criteria Scores
  const allCriteria = Array.from(
    new Set([...Object.keys(report.ad_a_scores), ...Object.keys(report.ad_b_scores)])
  );

  const tableRows = allCriteria.map((criteria, index) => [
    index + 1,
    criteria,
    report.ad_a_scores[criteria] ?? 'N/A',
    report.ad_b_scores[criteria] ?? 'N/A',
  ]);

  autoTable(doc, {
    head: [['#', 'Criteria', 'Ad A Score', 'Ad B Score']],
    body: tableRows,
    startY: y,
    styles: { fontSize: 10 },
    margin: { left: marginLeft, right: 15 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Explanation Section
  doc.setFontSize(12);
  doc.text('Explanation:', marginLeft, y);
  y += 6;

  doc.setFontSize(10);
  const splitExplanation = doc.splitTextToSize(report.explanation, 180);
  doc.text(splitExplanation, marginLeft, y);

  // Save the PDF
  doc.save(`Ad_Analysis_Report_${report.id}.pdf`);
};
  
