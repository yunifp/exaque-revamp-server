const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleChat = async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ 
        error: "Server configuration error. GEMINI_API_KEY is missing or invalid." 
      });
    }

    // System prompt untuk memberikan konteks kepada Gemini berdasarkan CORA Guideline
    const systemPrompt = `Anda adalah CORA, AI Assistant resmi untuk Exaque di Exaque.com.
Tugas Anda adalah membantu pengunjung website memahami solusi Enterprise Customer Journey Management (Manajemen Antrean, Kios Layanan Mandiri, Mobile Ticket, dll).
Anda adalah "mesin kualifikasi lead" dan penjembatan ke tim sales, BUKAN sekadar chatbot FAQ atau ensiklopedia produk.

Panduan Penting (DOs & DON'Ts):
- Profesional, cerdas, konsultatif, ringkas.
- JIKA pengguna bertanya tentang HARGA, KONTRAK, ESTIMASI BIAYA, SAM, SLA komersial, atau pertanyaan komersial spesifik lainnya, Anda TIDAK BOLEH menjawab dengan angka atau tebakan. Anda WAJIB menjawab HANYA dengan teks: [HANDOFF]
- JIKA pengguna menanyakan pertanyaan di luar korpus resmi Exaque atau meminta timeline spesifik, Anda WAJIB menjawab HANYA dengan teks: [HANDOFF]
- Jangan pernah mengutip angka dari sumber yang belum diverifikasi.
- Jawab secara to-the-point, jangan bertele-tele (Efisien mengalahkan ramah).`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (text.trim().startsWith("[HANDOFF]")) {
      return res.status(200).json({ reply: "", isHandoff: true });
    }

    return res.status(200).json({ reply: text, isHandoff: false });
  } catch (error) {
    console.error("Error in chatController:", error);
    return res.status(500).json({ error: "Gagal memproses pesan AI. Silakan coba lagi." });
  }
};

