let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  document.getElementById("saveBtn").addEventListener("click", saveBook);
});

const API_URL = "/users"; // change to full URL if needed

async function loadBooks() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const books = await response.json();
    render(books);
  } catch (error) {
    console.error("Load Error:", error);
    alert("Error loading books. Check server connection.");
  }
}

async function saveBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !author) {
    alert("Please fill all fields");
    return;
  }

  try {
    let response;

    if (editingId === null) {
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
      });
    } else {
      response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
      });

      editingId = null;
      document.getElementById("saveBtn").innerText = "Add Book";
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";

    await loadBooks();
  } catch (error) {
    console.error("Save Error:", error);
    alert("Error saving book.");
  }
}

function render(books) {
  const table = document.getElementById("bookTable");

  if (!books.length) {
    table.innerHTML = `
      <tr>
        <td colspan="4">No books found</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = books.map(book => `
    <tr>
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>
        <button class="edit" onclick="editBook(${book.id})">Edit</button>
        <button class="delete" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

async function editBook(id) {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();
    const book = books.find(b => b.id === id);

    if (!book) return;

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;

    editingId = id;
    document.getElementById("saveBtn").innerText = "Update Book";
  } catch (error) {
    console.error("Edit Error:", error);
  }
}

async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    await loadBooks();
  } catch (error) {
    console.error("Delete Error:", error);
    alert("Error deleting book.");
  }
}