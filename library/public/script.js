// ✅ Your Railway Backend URL
const BASE_URL = "https://example3-production.up.railway.app";
const API = ${BASE_URL}/books;

// Load books when page loads
window.addEventListener("DOMContentLoaded", loadBooks);

async function loadBooks() {
  try {
    const res = await fetch(API);

    if (!res.ok) {
      throw new Error("Failed to fetch books");
    }

    const books = await res.json();

    const table = document.getElementById("bookTable");
    table.innerHTML = "";

    if (books.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4">No books found</td>
        </tr>
      `;
      return;
    }

    books.forEach(book => {
      const row = `
        <tr>
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>
            <button onclick="editBook(${book.id}, '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}')">
              Edit
            </button>
            <button onclick="deleteBook(${book.id})">
              Delete
            </button>
          </td>
        </tr>
      `;
      table.innerHTML += row;
    });

  } catch (error) {
    console.error("Load Error:", error);
    alert("Cannot connect to server. Check Railway deployment.");
  }
}

async function addBook() {
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, author })
    });

    if (!res.ok) {
      throw new Error("Failed to add book");
    }

    titleInput.value = "";
    authorInput.value = "";

    await loadBooks();

  } catch (error) {
    console.error("Add Error:", error);
    alert("Failed to add book.");
  }
}

async function deleteBook(id) {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(${API}/${id}, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error("Failed to delete book");
    }

    await loadBooks();

  } catch (error) {
    console.error("Delete Error:", error);
    alert("Failed to delete book.");
  }
}

async function editBook(id, oldTitle, oldAuthor) {
  const title = prompt("New Title:", oldTitle);
  const author = prompt("New Author:", oldAuthor);

  if (!title || !author) return;

  try {
    const res = await fetch(${API}/${id}, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, author })
    });

    if (!res.ok) {
      throw new Error("Failed to update book");
    }

    await loadBooks();

  } catch (error) {
    console.error("Edit Error:", error);
    alert("Failed to update book.");
  }
}
example3-production.up.railway.app
Jan Lester
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

db.connect(err => {
    if (err) {
        console.log("❌ DB Error:", err);
    } else {
        console.log("✅ Connected to MySQL");

        // Create table if not exists
        db.query(`
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                author VARCHAR(255)
            )
        `);
    }
});

// Root route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

/* CREATE */
app.post("/books", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author)
        return res.status(400).json({ message: "Missing fields" });

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
    console.log(🚀 Server running on port ${PORT});
});