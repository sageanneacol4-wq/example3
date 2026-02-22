const API = "https://YOUR_RAILWAY_BACKEND_URL/books";

async function loadBooks() {
    const res = await fetch(API);
    const books = await res.json();

    const table = document.getElementById("bookTable");
    table.innerHTML = "";

    books.forEach(book => {
        table.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>
                    <button class="btn-edit" onclick="editBook(${book.id}, '${book.title}', '${book.author}')">Edit</button>
                    <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;

    if (!title || !author) return alert("Please fill all fields");

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";

    loadBooks();
}

async function deleteBook(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadBooks();
}

async function editBook(id, oldTitle, oldAuthor) {
    const title = prompt("New Title:", oldTitle);
    const author = prompt("New Author:", oldAuthor);

    if (!title || !author) return;

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    loadBooks();
}

window.onload = loadBooks;