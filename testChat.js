require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("Halo");
    console.log("Success with gemini-2.5-flash:", result.response.text());
  } catch (error) {
    console.error("Error with gemini-2.5-flash:", error.message);
  }
}
test();
