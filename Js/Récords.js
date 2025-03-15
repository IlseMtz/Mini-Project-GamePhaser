document.addEventListener("DOMContentLoaded", function () {
    // Recuperar los puntajes almacenados en localStorage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Crear un objeto temporal para almacenar los puntajes más altos por jugador
    let highestScores = {};

    scores.forEach(player => {
        if (!highestScores[player.name] || player.score > highestScores[player.name].score) {
            highestScores[player.name] = player;
        }
    });

    // Convertir el objeto de nuevo a un array
    scores = Object.values(highestScores);

    // Ordenar por puntuación de mayor a menor y limitar a los 10 mejores
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10);

    // Guardar nuevamente solo los 10 mejores en localStorage
    localStorage.setItem("scores", JSON.stringify(scores));

    // Seleccionar el cuerpo de la tabla
    const tableBody = document.getElementById("scoreTableBody");
    tableBody.innerHTML = "";

    // Insertar los jugadores en la tabla
    scores.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>${new Date(player.date || Date.now()).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
});

/*document.addEventListener("DOMContentLoaded", function () {
    // Recuperar los puntajes almacenados en localStorage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Ordenar por puntuación de mayor a menor y limitar a los 10 mejores
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10);

    // Guardar nuevamente solo los 10 mejores en localStorage
    localStorage.setItem("scores", JSON.stringify(scores));

    // Seleccionar el cuerpo de la tabla
    const tableBody = document.getElementById("scoreTableBody");
    tableBody.innerHTML = "";

    // Insertar los jugadores en la tabla
    scores.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>${new Date(player.date || Date.now()).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
});*/
