const containerComics = document.querySelector('#container-comics');
const buscar = document.querySelector("#bus");

let comicJSON=[];


async function obtenerDatos () {
    const almacen = "./data/comics.json"
    const respuesta = await fetch(almacen)
    const datos = await respuesta.json()
    comicJSON = datos;
    populateComics(datos)    
}

// Populate main grid width every comics information
function populateComics(dataJSON) {
    containerComics.innerHTML=""
    dataJSON.forEach(comic => {
    
        containerComics.innerHTML +=
        `
        <div class="card shadow-lg p-3 bg-white rounded">
        <img class="card-img-top" src='img/${comic.img}' alt="Imagen del cómic" />
        <div class="card-body">
          <h5  class="card-title">${comic.title} </h5>
          <p class="card-text"><span>${comic.cartoonist}</span></span> </p>
        </div>
      </div>

        `   
    });
};


function buscarComic(){
    const buscadorTerm = buscar.value.toLowerCase();

    if (buscadorTerm === "") {
        containerComics.innerHTML = "";
        obtenerDatos();
    } else {
        containerComics.innerHTML = ""; // Limpia el contenido actual

        const comicsFiltrados = comicJSON.filter(comic => {
            return comic.title.toLowerCase().includes(buscadorTerm);
        });

        if (comicsFiltrados.length > 0) {
            populateComics(comicsFiltrados);
        } else {
            containerComics.innerHTML = "<p>No se encontraron cómics con ese título.</p> ";
        }
    }
}

// Init function

function init(){
    obtenerDatos();
    buscar.addEventListener("keyup" , buscarComic);
}

init()

    



