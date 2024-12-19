window.onload = () => {
    // Pedimos a la API los libros actuales en base de datos
    fetchBooks();

    // Añadimos al botón de submit del formulario un listener para enlazarlo a la función createBook
    document.getElementById('book-form').addEventListener('submit', createBook);
}

async function fetchBooks() {
    let apiUrl = "http://localhost/library_crud/api2.php";
    let res = await fetch(apiUrl);
    let books = await res.json();
    // console.log(books);

    //Borramos el contenido de la tabla
    eraseTable();
    // Poblamos la tabla con el contenido del JSON
    updateTable(books);
}

function eraseTable() {
    // Accedemos a la lista de filas de la tabla <tr> y las borramos todas
    document.getElementById("book-table").innerHTML = "";
}

function updateTable(books) {
    let table = document.getElementById("book-table");
    // Iteramos books: por cada book
    books.forEach(book => {
        // Creamos y añadimos a la tabla una nueva fila (<tr>)
        let row = document.createElement("tr");
        
        // Creamos y añadimos a la fila las celdas de id, título, autor, año, acciones.
        // Las celdas id, título, autor, año se deben rellenar con la info del JSON.
        // Las celdas título, autor, año deben tener el atributo contenteditable a true.
        row.innerHTML = `
            <td>${book.id}</td>
            <td contenteditable="true">${book.title}</td>
            <td contenteditable="true">${book.author}</td>
            <td contenteditable="true">${book.year}</td>
            <td>
                <button onclick="editBook(event)">Editar</button>
                <button onclick="deleteBook(event)">Eliminar</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

async function deleteBook(event) {
    // Leemos el contenido de la columna id de esa fila
    let row = event.target.parentElement.parentElement;
    let id = row.children[0].innerText.trim();

    // Validar que el ID es válido
    if (!id || isNaN(id)) {
        alert("Error: ID no válido para eliminar.");
        return;
    }

    try {
        // Hacer la petición de eliminación al backend con el método DELETE
        let res = await fetch("http://localhost/library_crud/api2.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${id}`
        });

        // Verificar la respuesta del backend
        let response = await res.json();
        console.log("Respuesta de la API:", response);

        if (!res.ok || response.error) {
            alert("Error al eliminar el libro. Verifica que el ID existe.");
        } else {
            // Volvemos a pedir libros para actualizar la tabla
            fetchBooks();
        }
    } catch (error) {
        console.error("Error al eliminar el libro:", error);
    }
}

async function editBook(event) {
    // Leemos el contenido de las columnas id, título, autor, año de esa fila
    let row = event.target.parentElement.parentElement;
    let id = row.children[0].innerText.trim();
    let title = row.children[1].innerText.trim();
    let author = row.children[2].innerText.trim();
    let year = row.children[3].innerText.trim();

    // Hacemos la petición de PUT correspondiente pasando un FormData en el cuerpo del mensaje
    let formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year);

    try {
        let res = await fetch("http://localhost/library_crud/api2.php", {
            method: "PUT",
            body: formData
        });

        // Muestra respuesta de la API (JSON) por consola
        let response = await res.json();
        console.log(response);

        //Volvemos a pedir libros
        fetchBooks();
    } catch (error) {
        console.error("Error al editar el libro:", error);
    }
}

async function createBook(event) {
    // Leemos el contenido del formulario: título, autor, año
    event.preventDefault();

    let title = document.getElementById("book-title").value;
    let author = document.getElementById("book-author").value;
    let year = document.getElementById("book-year").value;

    // Hacemos la petición de POST correspondiente pasando un FormData en el cuerpo del mensaje
    let formData = new FormData();
    formData.append('action', 'create');
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year);

    try {
        let res = await fetch("http://localhost/library_crud/api2.php", {
            method: "POST",
            body: formData
        });

        // Muestra respuesta de la API (JSON) por consola
        let response = await res.json();
        console.log(response);

        //Volvemos a pedir libros
        fetchBooks();
        document.getElementById("book-form").reset();
    } catch (error) {
        console.error("Error al crear el libro:", error);
    }
}
