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

    // System prompt untuk memberikan konteks kepada Gemini
    const systemPrompt = `Anda adalah asisten virtual (AI Chatbot) resmi untuk Exaque.
Tugas Anda adalah membantu pengunjung website dengan memberikan informasi seputar layanan Exaque.
Gunakan bahasa Indonesia yang profesional, ramah, dan solutif.
Exaque menyediakan solusi seperti Manajemen Antrean, Perencanaan Sumber Daya, Kios Layanan Mandiri, Mobile Ticket, Umpan Balik Pelanggan, Business Intelligence, Pesan Otomatis, Keamanan Sistem, Tampilan Papan Informasi Digital, dan Pengumuman Suara Otomatis.
Jangan pernah menyebutkan bahwa Anda adalah produk Google, Gemini, OpenAI, atau Aranet. Anda adalah AI dari Exaque.
Jika Anda tidak tahu jawabannya, arahkan pengguna untuk menghubungi tim Exaque melalui halaman Kontak.
Jawab secara ringkas dan informatif.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error in chatController:", error);
    return res.status(500).json({ error: "Gagal memproses pesan AI. Silakan coba lagi." });
  }
};
