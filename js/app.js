const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    //Validar 

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad==='' || pais === '') {
        //Hubo un error

        mostrarError('Ambos campos son obligatorios');

        return; 
    }

    // Consultariamos la API

    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    
    const alert = document.querySelector('.bg-red-100');

    if (!alert) {
        //Crear una alerta

        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = 
        `
        <strong class="font-bold"<>Error</strong>
        <span class="block">${mensaje}</span>
        `;

        container.appendChild(alerta)

        //Se elimine la alerta después de 3 segundos

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }   
}

function consultarAPI(ciudad, pais) {
    
    const appId = 'f23012f58a67ffca4c1d53a52a16c190';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    fetch(url)
        .then( respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            if (datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `<div class="double-bounce1"></div>
    <div class="double-bounce2"></div>`;

    resultado.appendChild(divSpinner);

   setTimeout(() => {
    divSpinner.style.display= "none";

    const {name, main: {temp, temp_max, temp_min}} = datos;

    const centigrados = parseInt(temp - 273.15);
    const max = parseInt(temp_max - 273.15);
    const min = parseInt(temp_min - 273.15);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML= `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Máxima: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Mínima: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
   }, 3000);
}

function limpiarHTML() {
    resultado.innerHTML = "";
}
