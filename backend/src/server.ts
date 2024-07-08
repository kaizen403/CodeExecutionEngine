import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { executeCode } from "./execute";
import fs from "fs";
import path from "path";
import cors from "cors";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow CORS from any origin for testing purposes
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/template/:language", (req, res) => {
  const { language } = req.params;
  const templatePath = path.join(
    process.cwd(),
    "../../base_templates",
    language,
  );

  console.log(`Request received for language: ${language}`);
  console.log(`Checking path: ${templatePath}`);

  if (fs.existsSync(templatePath)) {
    const files = fs.readdirSync(templatePath).reduce(
      (acc, file) => {
        acc[file] = fs.readFileSync(path.join(templatePath, file), "utf8");
        return acc;
      },
      {} as { [key: string]: string },
    );

    console.log(`Files found: ${Object.keys(files).join(", ")}`);
    res.json(files);
  } else {
    console.error(`Invalid language: ${language}`);
    res.status(400).send("Invalid language");
  }
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("execute", async ({ language, files }) => {
    console.log(`Executing code for language: ${language}`);
    console.log(`Files: ${JSON.stringify(files)}`);
    const result = await executeCode(language, files);
    socket.emit("result", { output: result });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
