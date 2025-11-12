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

  // Visa rapport
  document.getElementById("output").textContent = JSON.stringify(rapport, null, 2);

  // Skapa delningsknappar
  createShareButtons(rapport);
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
