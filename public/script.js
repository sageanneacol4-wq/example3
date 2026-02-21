let editingId = null;

document.addEventListener("DOMContentLoaded", loadBooks);

async function loadBooks() {
  const response = await fetch('/users');
  const books = await response.json();
  render(books);
}

async function saveBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !author) {
    alert("Please fill all fields");
    return;
  }

  if (editingId === null) {
    await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author })
    });
  } else {
    await fetch(`/users/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author })
    });

    editingId = null;
    document.getElementById("saveBtn").innerText = "Add Book";
  }

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";

  loadBooks();
}

function render(books) {
  const table = document.getElementById("bookTable");

  table.innerHTML = books.map(book => `
    <tr>
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>
        <button onclick="editBook(${book.id})" class="edit">Edit</button>
        <button onclick="deleteBook(${book.id})" class="delete">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function editBook(id) {
  const response = await fetch('/users');
  const books = await response.json();
  const book = books.find(b => b.id === id);

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;

  editingId = id;
  document.getElementById("saveBtn").innerText = "Update Book";
}

async function deleteBook(id) {
  await fetch(`/users/${id}`, {
    method: 'DELETE'
  });

  loadBooks();
}