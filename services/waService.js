const axios = require('axios');

/**
 * Mengirim notifikasi WhatsApp menggunakan API Fonnte
 * @param {string} message Pesan yang akan dikirim
 * @param {string} [targetNumber] Nomor tujuan (default ke SALES_WA_NUMBER di .env)
 * @returns {Promise<any>}
 */
const sendWhatsAppNotification = async (message, targetNumber = process.env.SALES_WA_NUMBER) => {
  const waToken = process.env.FONNTE_TOKEN;
  
  if (!waToken || !targetNumber) {
    console.log("FONNTE_TOKEN atau target number belum diisi. Mengabaikan pengiriman WA.");
    return null;
  }

  // Fonnte mendukung multi-nomor yang dipisahkan dengan koma.
  // Pastikan tidak ada spasi agar formatnya benar: "0812..,0813.."
  const formattedTargets = Array.isArray(targetNumber) 
    ? targetNumber.join(',') 
    : targetNumber.replace(/\s+/g, '');

  try {
    const response = await axios.post(
      'https://api.fonnte.com/send',
      {
        target: formattedTargets,
        message: message,
      },
      {
        headers: { 
          Authorization: waToken 
        }
      }
    );
    console.log("Notifikasi WhatsApp berhasil terkirim ke:", targetNumber);
    return response.data;
  } catch (waError) {
    console.error("Gagal mengirim WhatsApp:", waError.response?.data || waError.message);
    throw waError;
  }
};

/**
 * Mengirim notifikasi Inquiry Baru via WhatsApp
 * @param {Object} inquiryData Data inquiry
 */
const sendInquiryWhatsApp = async (inquiryData) => {
  const message = `🔔 *INQUIRY BARU MASUK* 🔔
  
*Nama:* ${inquiryData.first_name || '-'} ${inquiryData.last_name || ''}
*Email:* ${inquiryData.email || '-'}
*Perusahaan:* ${inquiryData.company || '-'}
*Jabatan:* ${inquiryData.job_title || '-'}
*Kebutuhan:* ${inquiryData.service_needed || '-'}
*Pesan:* ${inquiryData.message || '-'}

Silakan cek dashboard admin untuk detail lebih lanjut.`;

  return sendWhatsAppNotification(message);
};

module.exports = {
  sendWhatsAppNotification,
  sendInquiryWhatsApp
};
