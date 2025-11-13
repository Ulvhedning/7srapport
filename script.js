// Räknare för rapportnummer
function getNextReportNumber() {
  let current = localStorage.getItem("reportCounter");
  if (!current) {
    current = 1000;
  } else {
    current = parseInt(current) + 1;
  }
  localStorage.setItem("reportCounter", current);
  return current;
}

// Generera rapport-ID
function generateReportId() {
  const number = getNextReportNumber();
  return `RPAS_${number}`;
}

// Röstinmatning för specifikt fält
function startVoiceForField(fieldId) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "sv-SE";
  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    document.getElementById(fieldId).value += " " + text;
  };
}

// Exportera rapport
function exportReport() {
  const rapport = {
    id: generateReportId(),
    spaningsfraga: document.getElementById("spaningsfraga").value,
    stund: document.getElementById("stund").value,
    stalle: document.getElementById("stalle").value,
    styrka: document.getElementById("styrka").value,
    slag: document.getElementById("slag").value,
    sysselsattning: document.getElementById("sysselsattning").value,
    symbol: document.getElementById("symbol").value,
    sagesman: document.getElementById("sagesman").value,
    timestamp: new Date().toISOString()
  };

  // Bilaga
  const fileInput = document.getElementById("bilaga");
  if (fileInput && fileInput.files.length > 0) {
    rapport.bilaga = fileInput.files[0].name;
  }
.header-img {
  max-height: 100px;
  object-fit: contain;
  border-radius: 8px;
}

  // Visa rapport
  document.getElementById("output").textContent = JSON.stringify(rapport, null, 2);

  // Skapa delningsknappar
  createShareButtons(rapport);
}
function exportPDF(rapport) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Logga (valfri)
  const headerImg = document.querySelector(".header-img");
  if (headerImg) {
    doc.addImage(headerImg.src, "PNG", 10, 10, 30, 30);
  }

  doc.setFontSize(18);
  doc.text("7S-RAPPORT RPAS", 50, 20);

  doc.setFontSize(12);
  let y = 50;
  const line = (label, value) => {
    doc.text(`${label}: ${value || "-"}`, 10, y);
    y += 8;
  };

  line("ID", rapport.id);
  line("Tidpunkt", rapport.stund);
  line("Plats", rapport.stalle);
  line("Styrka", rapport.styrka);
  line("Typ", rapport.slag);
  line("Aktivitet", rapport.sysselsattning);
  line("Märkning", rapport.symbol);
  line("Sagesman", rapport.sagesman);

  doc.text("Spaningsfråga:", 10, y + 4);
  doc.text(rapport.spaningsfraga || "-", 10, y + 12, { maxWidth: 180 });
  y += 28;

  line("Skapad", rapport.timestamp);

  // Bilaga – bädda in bild
  const fileInput = document.getElementById("bilaga");
  if (fileInput && fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgData = e.target.result;
      doc.text("Bilaga:", 10, y + 4);
      doc.addImage(imgData, "JPEG", 10, y + 10, 60, 60); // justera storlek/position
      doc.save(`${rapport.id}.pdf`);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    doc.text("Bilaga: Ingen", 10, y + 4);
    doc.save(`${rapport.id}.pdf`);
  }
}
function exportPDF(rapport) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF(); // Första sidan: stående

  // Logga (valfri)
  const headerImg = document.querySelector(".header-img");
  if (headerImg) {
    doc.addImage(headerImg.src, "PNG", 10, 10, 30, 30);
  }

  doc.setFontSize(18);
  doc.text("7S-RAPPORT RPAS", 50, 20);

  doc.setFontSize(12);
  let y = 50;
  const line = (label, value) => {
    doc.text(`${label}: ${value || "-"}`, 10, y);
    y += 8;
  };

  line("ID", rapport.id);
  line("Tidpunkt", rapport.stund);
  line("Plats", rapport.stalle);
  line("Styrka", rapport.styrka);
  line("Typ", rapport.slag);
  line("Aktivitet", rapport.sysselsattning);
  line("Märkning", rapport.symbol);
  line("Sagesman", rapport.sagesman);

  doc.text("Spaningsfråga:", 10, y + 4);
  doc.text(rapport.spaningsfraga || "-", 10, y + 12, { maxWidth: 180 });
  y += 28;

  line("Skapad", rapport.timestamp);

  const fileInput = document.getElementById("bilaga");
  if (fileInput && fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;

      // Lägg till ny sida i liggande format
      doc.addPage("a4", "landscape");
      doc.setFontSize(16);
      doc.text("📎 Bilaga", 10, 20);

      // Anpassa bild till sidan
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - 40;

      const img = new Image();
      img.onload = function () {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;
        const x = (pageWidth - imgWidth) / 2;
        const y = 30;

        doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
        doc.save(`${rapport.id}.pdf`);
      };
      img.src = imgData;
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    doc.text("Bilaga: Ingen", 10, y + 4);
    doc.save(`${rapport.id}.pdf`);
  }
}

// Formatera rapporttext för delning
function formatReportText(rapport) {
  return `
🛰️ 7S-RAPPORT RPAS
📌 ID: ${rapport.id}
📅 Tidpunkt: ${rapport.stund}
📍 Plats: ${rapport.stalle}
👥 Styrka: ${rapport.styrka}
🚛 Typ: ${rapport.slag}
⚙️ Aktivitet: ${rapport.sysselsattning}
🏷️ Märkning: ${rapport.symbol}
🧑‍✈️ Sagesman: ${rapport.sagesman
