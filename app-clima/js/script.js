const API_KEY = 'e54d2490c801cfcac6d76600f361ad3d';
const URL_BASE = 'https://api.openweathermap.org/data/2.5/weather';

const inputCiudad = document.getElementById('inputCiudad');
const btnBuscar = document.getElementById('btnBuscar');
const resultado = document.getElementById('resultado');
const error = document.getElementById('error');

const temperatura = document.getElementById('temperatura');
const descripcion = document.getElementById('descripcion');
const humedad = document.getElementById('humedad');
const viento = document.getElementById('viento');
const iconoClima = document.getElementById('iconoClima');

btnBuscar.addEventListener('click', buscarClima);
inputCiudad.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarClima();
});

async function buscarClima() {
  const ciudad = inputCiudad.value.trim();

  if (!ciudad) {
    mostrarError('Por favor ingresá una ciudad');
    return;
  }

  ocultarResultado();
  ocultarError();

  try {
    const respuesta = await fetch(`${URL_BASE}?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`);

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        mostrarError('Ciudad no encontrada. Verificá el nombre.');
      } else if (respuesta.status === 401) {
        mostrarError('Error de autenticación. Revisá la API key.');
      } else {
        mostrarError('Error del servidor. Intentá de nuevo más tarde.');
      }
      return;
    }

    const datos = await respuesta.json();
    mostrarClima(datos);
  } catch {
    mostrarError('Error de conexión. Revisá tu internet.');
  }
}

function mostrarClima(datos) {
  temperatura.textContent = `${Math.round(datos.main.temp)}°C`;
  descripcion.textContent = datos.weather[0].description;
  humedad.textContent = `${datos.main.humidity}%`;
  viento.textContent = `${Math.round(datos.wind.speed * 3.6)} km/h`;
  iconoClima.src = `https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png`;
  iconoClima.alt = datos.weather[0].description;

  resultado.classList.remove('oculto');
}

function mostrarError(mensaje) {
  error.textContent = mensaje;
  error.classList.remove('oculto');
}

function ocultarResultado() {
  resultado.classList.add('oculto');
}

function ocultarError() {
  error.classList.add('oculto');
}