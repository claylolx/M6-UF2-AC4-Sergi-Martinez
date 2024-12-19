window.onload = () => {
    fetchBooks();
    document.getElementById('book-form').addEventListener('submit', createBook);
};

async function fetchBooks() {
    let apiUrl = "http://localhost/library_crud/api.php";
    console.log("Demanant dades a:", apiUrl);

    let res = await fetch(apiUrl);
    if (!res.ok) {
        console.error("Error en la resposta de l'API:", res.status, res.statusText);
        return;
    }

    let books = await res.json();
    console.log("Dades rebudes:", books); // Verifica si arriben dades correctes

    eraseTable();
    updateTable(books);
}


function eraseTable() {
    document.getElementById("book-table").innerHTML = "";
}

function updateTable(books) {
    let table = document.getElementById("book-table");
    eraseTable(); // Assegura't que no queden dades velles

    books.forEach(book => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.id}</td>
            <td contenteditable="true">${book.title}</td>
            <td contenteditable="true">${book.author}</td>
            <td contenteditable="true">${book.year}</td>
            <td>
                <button onclick="editBook(this)">Editar</button>
                <button onclick="deleteBook(this)">Eliminar</button>
            </td>
        `;
        table.appendChild(row);
    });

    console.log("Taula actualitzada correctament.");
}


async function deleteBook(button) {
    let row = button.parentElement.parentElement;
    let id = row.children[0].innerText;

    await fetch("http://localhost/library_crud/api.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    fetchBooks();
}

async function editBook(button) {
    let row = button.parentElement.parentElement;
    let id = row.children[0].innerText;
    let title = row.children[1].innerText;
    let author = row.children[2].innerText;
    let year = row.children[3].innerText;

    await fetch("http://localhost/library_crud/api.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, author, year })
    });
    fetchBooks();
}

async function createBook(event) {
    event.preventDefault();
    let title = document.getElementById("book-title").value;
    let author = document.getElementById("book-author").value;
    let year = document.getElementById("book-year").value;

    await fetch("http://localhost/library_crud/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, year })
    });
    document.getElementById("book-form").reset();
    fetchBooks();
}
