let editingId = null;
const API_URL = "/books";

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  document.getElementById("saveBtn").addEventListener("click", saveBook);
});

async function loadBooks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(await res.text());
    const books = await res.json();
    renderBooks(books);
  } catch (err) {
    console.error("Load Error:", err);
    alert("Failed to load books. Check server connection.");
  }
}

async function saveBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !author) {
    alert("Please fill all fields");
    return;
  }

  const payload = { title, author };

  try {
    let res;
    if (editingId === null) {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      editingId = null;
      document.getElementById("saveBtn").innerText = "Add Book";
    }

    if (!res.ok) throw new Error(await res.text());

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    await loadBooks();
  } catch (err) {
    console.error("Save Error:", err);
    alert("Failed to save book.");
  }
}

function renderBooks(books) {
  const table = document.getElementById("bookTable");

  if (!books.length) {
    table.innerHTML = `<tr><td colspan="4">No books found</td></tr>`;
    return;
  }

  table.innerHTML = books
    .map(
      (b) => `
    <tr>
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>
        <button class="edit" data-id="${b.id}">Edit</button>
        <button class="delete" data-id="${b.id}">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");

  // Attach button event listeners
  table.querySelectorAll(".edit").forEach((btn) =>
    btn.addEventListener("click", () => editBook(btn.dataset.id))
  );
  table.querySelectorAll(".delete").forEach((btn) =>
    btn.addEventListener("click", () => deleteBook(btn.dataset.id))
  );
}

async function editBook(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(await res.text());
    const book = await res.json();

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;

    editingId = id;
    document.getElementById("saveBtn").innerText = "Update Book";
  } catch (err) {
    console.error("Edit Error:", err);
    alert("Failed to fetch book details.");
  }
}

async function deleteBook(id) {
  if (!confirmlet editingId = null;

// ✅ CHANGE THIS TO YOUR REAL BACKEND URL
const BASE_URL = "https://YOUR-BACKEND.up.railway.app";
const API_URL = `${BASE_URL}/books`;

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  document.getElementById("saveBtn").addEventListener("click", saveBook);
});

async function loadBooks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(await res.text());
    const books = await res.json();
    renderBooks(books);
  } catch (err) {
    console.error("Load Error:", err);
    alert("Failed to load books. Check server connection.");
  }
}

async function saveBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !author) {
    alert("Please fill all fields");
    return;
  }

  const payload = { title, author };

  try {
    let res;

    if (editingId === null) {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      editingId = null;
      document.getElementById("saveBtn").innerText = "Add Book";
    }

    if (!res.ok) throw new Error(await res.text());

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    await loadBooks();
  } catch (err) {
    console.error("Save Error:", err);
    alert("Failed to save book.");
  }
}

function renderBooks(books) {
  const table = document.getElementById("bookTable");

  if (!books.length) {
    table.innerHTML = `<tr><td colspan="4">No books found</td></tr>`;
    return;
  }

  table.innerHTML = books
    .map(
      (b) => `
      <tr>
        <td>${b.id}</td>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>
          <button class="edit" data-id="${b.id}">Edit</button>
          <button class="delete" data-id="${b.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join("");

  table.querySelectorAll(".edit").forEach((btn) =>
    btn.addEventListener("click", () => editBook(btn.dataset.id))
  );
  table.querySelectorAll(".delete").forEach((btn) =>
    btn.addEventListener("click", () => deleteBook(btn.dataset.id))
  );
}

async function editBook(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(await res.text());
    const book = await res.json();

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;

    editingId = id;
    document.getElementById("saveBtn").innerText = "Update Book";
  } catch (err) {
    console.error("Edit Error:", err);
    alert("Failed to fetch book details.");
  }
}

async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    await loadBooks();
  } catch (err) {
    console.error("Delete Error:", err);
    alert("Failed to delete book.");
  }
}("Are you sure you want to delete this book?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    await loadBooks();
  } catch (err) {
    console.error("Delete Error:", err);
    alert("Failed to delete book.");
  }
}