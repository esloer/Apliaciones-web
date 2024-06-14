const contenedor = document.querySelector("#container");
const buscador = document.querySelector("#bus");
const imagenCancion = document.querySelector("#imagen-cancion");
const imgInfo = document.querySelector(".img-info");
const totalCanciones = document.querySelector("#totalCanciones");
const duracionTotal = document.querySelector("#duracionTotal");

let canciones = []; // Variable para almacenar las canciones

async function getSongs() {
    const url = '/data/data.json'; // La URL de la API
    const response = await fetch(url); // Hacemos la solicitud fetch a la URL
    const data = await response.json(); // Convertimos la respuesta a JSON
    canciones = data; // Guardamos las canciones en la variable global
    console.log(canciones)
    mostrarCanciones(canciones);
   
    // Recuperar los estados de favorito del localStorage y aplicarlos a los elementos correspondientes
    canciones.forEach(song => {
        const isFavorito = localStorage.getItem(song.titulo);
        if (isFavorito === 'true') {
            const titulos = contenedor.querySelectorAll('.titulo');
            titulos.forEach(tituloElement => {
                if (tituloElement.textContent === song.titulo) {
                    tituloElement.parentElement.querySelector('.fa-heart').classList.add('favorito');
                }
            });
        }
    });

}

function mostrarCanciones(data) {
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar contenido
    let totalMinutos = 0; // Variable para almacenar la duración total en minutos
    canciones.forEach((song, index) => { // Iteramos sobre los resultados
        console.log(canciones[index].titulo)
        contenedor.innerHTML += `
            <tr>
                <td>
                    <span id="play-span-${index}"><i class="fa-solid fa-play" onclick="reproducir(${index})"></i></span>
                    <span id="pause-span-${index}" class="oculto"><i class="fa-solid fa-pause" onclick="pausar(${index})"></i></span>
                </td>
                <td>
                    <i class="fa-solid fa-heart" onclick="favorito(this)"></i>
                </td>
                <td class="titulo">${song.titulo}</td>
                <td>${song.artista}</td>
                <td>${song.album}</td>
                <td>${song.fecha}</td>
                <td>${song.duracion}</td>
            </tr>
        `;

        // Calcula el número de canciones y actualiza el texto en el HTML
        const numeroCanciones = data.length;
        totalCanciones.textContent = `${numeroCanciones}`;

        // Convertir la duración de la canción a minutos y sumarla al total
        const [minutos, segundos] = song.duracion.split(':').map(Number);
        totalMinutos += minutos + segundos / 60;
    });

    // Calcular horas y minutos
    const horas = Math.floor(totalMinutos / 60);
    const minutosRestantes = Math.round(totalMinutos % 60);

    // Actualizar el texto en el HTML
    const infoDuracion = `${horas}hr ${minutosRestantes}min`;
    duracionTotal.textContent = infoDuracion;


}

// Función para pintar el corazón de rojo añadiendo la clase favorito y en localstorage
function favorito(corazon) {
    corazon.classList.toggle("favorito");
    
    if (corazon.classList.contains("favorito")) {
        // Si el corazón está marcado como favorito, guardar 'true' en localStorage
        localStorage.setItem(corazon.parentElement.parentElement.querySelector('.titulo').textContent, 'true');
    } else {
        // Si el corazón no está marcado como favorito, eliminar el elemento del localStorage
        localStorage.removeItem(corazon.parentElement.parentElement.querySelector('.titulo').textContent);
    }
}


function reproducir(index) {
    // Ocultar todos los íconos de pausa visibles en la tabla
    const pausaSpans = contenedor.querySelectorAll("span:not(.oculto) .fa-pause");
    pausaSpans.forEach(pausaSpan => {
        pausaSpan.parentElement.classList.add("oculto");
        const playSpanId = pausaSpan.parentElement.id.replace('pause', 'play');
        document.getElementById(playSpanId).classList.remove("oculto");
    });

    // Ocultar el ícono de play y mostrar el ícono de pausa en la fila donde se hizo clic
    document.getElementById(`play-span-${index}`).classList.add("oculto");
    document.getElementById(`pause-span-${index}`).classList.remove("oculto");

    // Actualizar la imagen de la canción
    const song = canciones[index];
    imagenCancion.src = `/img/${song.img}`;
    // pasar la imagen oculta a visibles
    imgInfo.classList.remove("no-visible")
}

function pausar(index) {
    // Ocultar el ícono de pausa y mostrar el ícono de play
    document.getElementById(`pause-span-${index}`).classList.add("oculto");
    document.getElementById(`play-span-${index}`).classList.remove("oculto");
}

function parar() {
    // Seleccionar todos los íconos de pausa y cambiarlos a play
    const pausaSpans = contenedor.querySelectorAll("span:not(.oculto) .fa-pause");
    pausaSpans.forEach(pausaSpan => {
        pausaSpan.parentElement.classList.add("oculto");
        const playSpanId = pausaSpan.parentElement.id.replace('pause', 'play');
        document.getElementById(playSpanId).classList.remove("oculto");
    });

    // Oculta la imagen cuando se para
    imgInfo.classList.add("no-visible")
}

// Función para buscar canciones por título
function buscarCancion() {
    const filtro = buscador.value.toLowerCase();
    const filas = contenedor.querySelectorAll("tr");

    filas.forEach(fila => {
        const titulo = fila.querySelector(".titulo").textContent.toLowerCase();
        if (titulo.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}


function init() {
    getSongs();
    buscador.addEventListener("input", buscarCancion);
    
}

init();

