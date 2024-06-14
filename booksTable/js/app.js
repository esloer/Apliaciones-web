const containerBooks = document.querySelector("#list-books");
const inputSearch = document.querySelector("#input-seach");
let booksJSON = [];

// Init function
document.addEventListener("DOMContentLoaded", () => {
    getBooks();
    inputSearch.addEventListener("keyup", searchBook);
    inputSearch.addEventListener('keydown', function() {
        if(inputSearch.value===""){
            populateTable(booksJSON);
        }
        
    });
});


function getBooks() {
    fetch('data/books.json')
        .then(result => result.json())
        .then(data => {
            booksJSON = data;
            populateTable(data);
        });
}

function populateTable(data) {
    // Init container
    containerBooks.innerHTML = "";
    // For every book we must create a row
    data.forEach(book => {
        console.log("datos del libro", book.title);

        // Content of info writers
        let htmlWriters = "";
        book.writers.forEach(writer => {
            htmlWriters += `${writer.name} ${writer.surname} ,`;
        });
        htmlWriters = htmlWriters.substr(0, htmlWriters.length - 1);

        let htmlBook = `
              <tr>
                  <td>${book.title}</td>
                  <td>${book.yearRelease}</td>
                  <td>${book.price}&euro;</td>
                  <td>${htmlWriters}</td>
              </tr>
          `;
        // Add the new row with all data of one book
        containerBooks.innerHTML += htmlBook;

    });
}

function searchBook() {
    if (this.value.length >= 3) {
        let titleSearch = this.value.toLowerCase();
        let results = booksJSON.filter(book => {
                let title = book.title.toLowerCase();
                return title.includes(titleSearch);
                //return title.indexOf(titleSearch) > -1;
            });
        populateTable(results);
    }
}