function saveName() {
    const playerName = document.getElementById("playerName").value.trim();
    
    // Validar solo letras, dígitos y guion bajo (_), con longitud entre 4 y 8 caracteres
    const nameValid = /^[a-zA-Z0-9_]{4,8}$/;
    
    if (!nameValid.test(playerName)) {
        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "El nombre debe tener entre 4 y 8 caracteres y solo puede contener letras, números y '_'.",
            confirmButtonColor: "#d33"
        });
        return;
    }

    // Recuperar la lista de jugadores desde localStorage o inicializar un array vacío
    let players = JSON.parse(localStorage.getItem("players")) || [];

    // Verificar si el nombre ya existe en la lista
    if (!players.some(player => player.name === playerName)) {
        const dateSaved = new Date().toISOString(); // Capturar la fecha actual
        players.push({ name: playerName, date: dateSaved }); // Guardar nombre y fecha
        localStorage.setItem("players", JSON.stringify(players));
        
        Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: `Tu nombre ha sido guardado como: ${playerName} (Fecha: ${new Date(dateSaved).toLocaleString()})`,
            confirmButtonColor: "#28a745"
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Nombre duplicado",
            text: "Este nombre ya está registrado. Intenta con otro.",
            confirmButtonColor: "#ffc107"
        });
    }
}

// Mostrar el último nombre guardado al cargar la página
window.onload = function () {
    let players = JSON.parse(localStorage.getItem("players")) || [];
    if (players.length > 0) {
        document.getElementById("playerName").value = players[players.length - 1].name;
    }
};

// Modificar selectCharacter para recibir el ID del botón (mario o luigi)
function selectCharacter(character, buttonId) {
    var playerName = document.getElementById("playerName").value;
    // Guardar el nombre, el personaje y el botón presionado en la URL
    window.location.href = `levels.html?character=${character}&playerName=${playerName}&buttonId=${buttonId}`;
}
