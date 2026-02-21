let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  document.getElementById("saveBtn").addEventListener("click", saveBook);
});

async function loadBooks() {
  try {
    const response = await fetch('/users');

    if (!response.ok) {
      throw new Error("Failed to load books");
    }

    const books = await response.json();
    render(books);
  } catch (error) {
    console.error(error);
    alert("Error loading books");
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
      response = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
      });
    } else {
      response = await fetch(`/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author })
      });

      editingId = null;
      document.getElementById("saveBtn").innerText = "Add Book";
    }

    if (!response.ok) {
      throw new Error("Failed to save book");
    }

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";

    await loadBooks();

  } catch (error) {
    console.error(error);
    alert("Error saving book");
  }
}

function render(books) {
  const table = document.getElementById("bookTable");

  table.innerHTML = books.map(book => `
    <tr>
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>
        <button onclick="editBook(${book.id})">Edit</button>
        <button onclick="deleteBook(${book.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function editBook(id) {
  const response = await fetch('/users');
  const books = await response.json();
  const book = books.find(b => b.id === id);

  if (!book) return;

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;

  editingId = id;
  document.getElementById("saveBtn").innerText = "Update Book";
}

async function deleteBook(id) {
  await fetch(`/users/${id}`, { method: 'DELETE' });
  await loadBooks();
}