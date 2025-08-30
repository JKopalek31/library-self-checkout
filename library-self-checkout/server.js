// server.js
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();

// 1) Enable CORS for everyone (Electron renderer or Vite dev‐server)
app.use(cors());

// 2) Serve your TF-JS models at /models
//    Adjust the path below if your model JSON lives somewhere else in your project.
//    E.g. if you put them in src/assets/models, change accordingly.

// const MODELS_DIR = path.resolve(__dirname, "src", "renderer", "models");
// app.use("/models", express.static(MODELS_DIR));
app.use(
  '/models',
  express.static(path.join(__dirname, 'models'))
);

// 3) Start listening
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`📁 Models server listening on http://localhost:${PORT}/models`);
});
