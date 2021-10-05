const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if(ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios')

        return;
    }
    consultarAPI(ciudad, pais );
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {

        // Crear una alerta
        const alerta = document.createElement('div');
        
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `;
        
        container.appendChild(alerta);

        // Se elimina la alerta despues de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = '57a9bf1decaece62b5d6a80868a4df49';

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => {
            return respuesta.json();
        })
        .then(datos => {

            limpiarHTML(); //Limpiar HTML previo

            if(datos.cod === "404"){
                mostrarError('Ciudad no encontrada')
                return;
            }

            //Imprime la respuesta en el html
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    const { main: {temp, temp_min, temp_max}} = datos;
    const centigrados = kelvinACentigrados(temp);

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados}° C`;
    actual.classList.add('text-6xl', 'text-center', 'font-bold', 'mb-4');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(actual);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = temp => parseInt(temp - 273.15);

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}