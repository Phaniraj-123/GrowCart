const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.static("shopping")); // serve frontend files

// Load product database
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "products.json"), "utf-8")
);

// GET products by IDs
app.get("/api/products", (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(",") : [];
  const filtered = products.filter(p => ids.includes(p.id.toString()));
  res.json(filtered);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
