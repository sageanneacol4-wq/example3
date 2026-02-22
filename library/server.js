require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
});

db.connect(err => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

/* CREATE */
app.post("/books", (req, res) => {
    const { title, author } = req.body;

    db.query(
        "INSERT INTO books (title, author) VALUES (?, ?)",
        [title, author],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Book added" });
        }
    );
});

/* READ */
app.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* UPDATE */
app.put("/books/:id", (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;

    db.query(
        "UPDATE books SET title=?, author=? WHERE id=?",
        [title, author, id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Book updated" });
        }
    );
});

/* DELETE */
app.delete("/books/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM books WHERE id=?",
        [id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Book deleted" });
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});