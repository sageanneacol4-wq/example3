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

// Serve frontend files
app.use(express.static(__dirname));

// Connect to Railway MySQL
const db = await mysql.createConnection(process.env.DATABASE_URL);

// Create table if not exists
await db.query(`
  CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255)
  )
`);

// GET all books
app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM books");
  res.json(rows);
});

// ADD book
app.post("/users", async (req, res) => {
  const { title, author } = req.body;
  await db.query(
    "INSERT INTO books (title, author) VALUES (?, ?)",
    [title, author]
  );
  res.json({ message: "Book added" });
});

// UPDATE book
app.put("/users/:id", async (req, res) => {
  const { title, author } = req.body;
  await db.query(
    "UPDATE books SET title=?, author=? WHERE id=?",
    [title, author, req.params.id]
  );
  res.json({ message: "Book updated" });
});

// DELETE book
app.delete("/users/:id", async (req, res) => {
  await db.query("DELETE FROM books WHERE id=?", [req.params.id]);
  res.json({ message: "Book deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));