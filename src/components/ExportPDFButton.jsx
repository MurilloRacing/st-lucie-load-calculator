import html2pdf from 'html2pdf.js';

export default function ExportPDFButton({ unitName, buildingId, spaceNumber }) {
  const exportPDF = () => {
    const content = document.getElementById('export-content');
    if (!content) return;

    const opt = {
      margin: 0.5,
      filename: `${unitName || 'Load_List'}_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(content).set(opt).save();
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={exportPDF}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow"
      >
        📄 Export PDF
      </button>
    </div>
  );
}
