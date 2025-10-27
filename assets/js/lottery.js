const lotteryButton = document.getElementById('lottery-button');
const winnerElement = document.getElementById('winner');

// Lista de nombres y apellidos genéricos para el efecto de conteo rápido
const names = ["Ricardo", "Andrea", "Carlos", "Isabella", "Javier", "Laura", "Miguel", "Sofía", "Fernando", "Elena", "Alejandro", "Valeria"];
const surnames = ["Gómez", "Rodríguez", "Pérez", "Martínez", "López", "González", "Díaz", "Sánchez", "Romero", "Torres", "Vargas", "Molina"];

let intervalId = null;

// Función para generar nombres/letras aleatorias para el efecto visual
function generateRandomText() {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    return `${randomName} ${randomSurname}`;
}

// Función para iniciar el efecto de parpadeo
function startBlinking() {
    winnerElement.classList.add('parpadea');
}

// Función para detener el efecto de parpadeo
function stopBlinking() {
    winnerElement.classList.remove('parpadea');
}

// Función principal de sorteo
lotteryButton.addEventListener("click", () => {
    const url = "https://wscigna.gscloud.us/ws/suscripcion/lottery";

    // 1. Limpiar el texto y detener cualquier animación previa
    if (intervalId) {
        clearInterval(intervalId);
    }
    stopBlinking();

    winnerElement.textContent = 'Suerte...';

    // 4. Desactivar el botón para evitar clics múltiples durante el sorteo
    lotteryButton.disabled = true;

    // 5. Realizar la solicitud de la API
    fetch(url)
        .then((response) => response.text())
        .then((response) => {
            const data = JSON.parse(response);

            // 6. Establecer un temporizador para detener el efecto y mostrar el ganador final después de 5 segundos
            setTimeout(() => {
                // Detener el intervalo de texto aleatorio
                clearInterval(intervalId);

                // Mostrar el ganador real
                if (data.code == 200) {
                    winnerElement.textContent = truncarTexto(`${data.data.nombre} ${data.data.apellido}`);
                    startBlinking();
                } else {
                    winnerElement.textContent = 'Error al obtener ganador';
                }

                // Reactivar el botón
                lotteryButton.disabled = false;
            }, 1000); // 5000 milisegundos = 5 segundos
        })
        .catch((error) => {
            console.error('Error:', error);

            // Si hay un error, detener el efecto y mostrar el mensaje de error inmediatamente
            clearInterval(intervalId);
            winnerElement.textContent = 'Error al obtener ganador';
            lotteryButton.disabled = false;
        });
});

function truncarTexto(texto, maxCaracteres = 25) {
    if (texto.length > maxCaracteres) {
        return texto.substring(0, maxCaracteres) + '...';
    }
    return texto;
}