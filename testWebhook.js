const axios = require('axios');
const webhookUrl = "https://script.google.com/macros/s/AKfycbyZIHHAckI-XFds5S1nbFnfeTqVxmjSXrzJtOimeFQQCes7qhYSeQTERqyg3ch-SmtK/exec";

async function test() {
  try {
    const res = await axios.post(webhookUrl, {
      nama: "Test",
      email_kantor: "test@test.com",
      perusahaan: "Test PT",
      sektor: "Perbankan",
      niat: "Demo",
      halaman_dilihat: "/",
      pertanyaan_komersial: false,
      timestamp: new Date().toISOString(),
      message: "Test message"
    });
    console.log("Success:", res.status, res.data);
  } catch (err) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Response:", err.response.status, err.response.data);
    }
  }
}
test();
