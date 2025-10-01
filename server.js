import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend files from public/
app.use(express.static(path.join(__dirname, "public")));

let sessions = {};
let sessionCounter = 1;

// API: available models
app.get("/models", (req, res) => {
  res.json(["GPT-5", "Claude", "Mistral", "LLaMA"]);
});

// API: start session
app.post("/start-session", (req, res) => {
  const { model } = req.body;
  const sessionId = "s" + sessionCounter++;
  sessions[sessionId] = { model, start: Date.now() };
  res.json({ sessionId });
});

// API: end session
app.post("/end-session", (req, res) => {
  const { sessionId } = req.body;
  if (!sessions[sessionId]) return res.status(404).json({ error: "Invalid session" });

  const session = sessions[sessionId];
  const end = Date.now();
  const duration = Math.floor((end - session.start) / 1000);
  const charge = (duration / 60 * 0.05).toFixed(2); // $0.05 per minute

  delete sessions[sessionId];
  res.json({ duration, charge });
});

// API: chat (dummy AI reply for now)
app.post("/chat", (req, res) => {
  const { message } = req.body;
  res.json({ reply: "AI says: " + message.toUpperCase() });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Bot Mesh running at http://localhost:${PORT}`));
