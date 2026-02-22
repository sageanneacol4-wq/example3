async function loadBooks() {
  const response = await fetch("/books");
  const books = await response.json();

  const table = document.getElementById("bookTable");
  table.innerHTML = "";

  books.forEach(book => {
    table.innerHTML += `
      <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
          <button onclick="deleteBook(${book.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

async function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  await fetch("/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author })
  });

  loadBooks();
}

async function deleteBook(id) {
  await fetch(`/books/${id}`, {
    method: "DELETE"
  });

  loadBooks();
}

loadBooks();