const axios = require('axios');
const waService = require('../services/waService');

exports.handleLead = async (req, res) => {
  try {
    const { 
      nama, 
      email_kantor, 
      perusahaan, 
      sektor, 
      niat, 
      halaman_dilihat, 
      pertanyaan_komersial,
      timestamp 
    } = req.body;

    // Build the payload as defined in the Guideline (6.2)
    // Notifikasi WhatsApp format:
    // 🔔 LEAD BARU — CORA
    // Nama : Budi Santoso
    // Perusahaan : PT Contoh Multifinance
    // Email : budi.s@contohfinance.co.id
    // Sektor : Multifinance
    // Niat : Jadwalkan demo 🔥 (lead panas)
    // Dilihat : Studi kasus BCA Finance
    // Waktu : 27 Jun 2026, 10:31 WIB
    // ➡️ Follow-up dalam 1 jam kerja

    const formattedWaktu = new Date(timestamp || Date.now()).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + " WIB";

    let leadPanasFlag = pertanyaan_komersial || niat?.toLowerCase().includes("demo") ? "🔥 (lead panas)" : "";

    const message = `🔔 LEAD BARU — CORA\nNama : ${nama}\nPerusahaan : ${perusahaan}\nEmail : ${email_kantor}\nSektor : ${sektor || '-'}\nNiat : ${niat} ${leadPanasFlag}\nDilihat : ${halaman_dilihat}\nWaktu : ${formattedWaktu}\n\n➡️ Follow-up dalam 1 jam kerja`;

    // 1. You could save this lead into your MongoDB here if you have a Lead model.
    // e.g. await Lead.create(req.body);
    
    console.log("=== NEW LEAD CAPTURED ===");
    console.log(message);

    // 2. Trigger Webhook to Google Sheet / Make / Zapier
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      await axios.post(webhookUrl, {
        nama,
        email_kantor,
        perusahaan,
        sektor,
        niat,
        halaman_dilihat,
        pertanyaan_komersial,
        timestamp: formattedWaktu,
        message // we also send the formatted message for easy WA forwarding
      });
      console.log("Google Sheet Webhook triggered successfully.");
    } else {
      console.log("LEAD_WEBHOOK_URL not configured. Lead recorded in console only.");
    }

    // 3. Kirim Notifikasi WhatsApp
    try {
      await waService.sendWhatsAppNotification(message);
    } catch (waError) {
      console.error("Gagal mengirim WhatsApp dari leadController:", waError.message);
    }

    res.status(200).json({ success: true, message: "Lead captured successfully." });
  } catch (error) {
    console.error("Error capturing lead:", error);
    res.status(500).json({ success: false, error: "Gagal menyimpan lead." });
  }
};
