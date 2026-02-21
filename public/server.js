import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files

// Connect to MySQL (Railway or local)
const db = await mysql.createConnection(process.env.DATABASE_URL);

// Create table if it doesn't exist
await db.query(`
  CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255)
  )
`);

// GET all books
app.get("/books", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM books");
  res.json(rows);
});

// GET single book by ID
app.get("/books/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Book not found" });
  res.json(rows[0]);
});

// ADD book
app.post("/books", async (req, res) => {
  const { title, author } = req.body;
  await db.query("INSERT INTO books (title, author) VALUES (?, ?)", [title, author]);
  res.json({ message: "Book added" });
});

// UPDATE book
app.put("/books/:id", async (req, res) => {
  const { title, author } = req.body;
  await db.query("UPDATE books SET title=?, author=? WHERE id=?", [title, author, req.params.id]);
  res.json({ message: "Book updated" });
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
  await db.query("DELETE FROM books WHERE id=?", [req.params.id]);
  res.json({ message: "Book deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));