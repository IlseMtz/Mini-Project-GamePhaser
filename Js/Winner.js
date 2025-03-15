window.onload = function() {
    const canvas = document.getElementById("diplomaCanvas");
    const ctx = canvas.getContext("2d");

    // Obtener los datos del Local Storage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let lastScore = scores.length > 0 ? scores[scores.length - 1] : { name: "Desconocido", score: 0 };

    // Obtener los datos del Local Storage
    const usuario = localStorage.getItem("usuario");
    const carrera = localStorage.getItem("carrera");

    // Obtener la fecha actual y formatearla
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-ES');

    // Fondo del canvas
    const imagenFondo = new Image();
    imagenFondo.src = "/assets/WinnerScreen1.png";

    imagenFondo.onload = function() {
        ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);

        const logoImagen = new Image();
        logoImagen.src = "/img/imgDosAux.png";

        ctx.font = "40px 'Arial'"; 
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("No todas las leyendas tienen una historia", canvas.width / 2, canvas.height / 6 + 40);

        logoImagen.onload = function() {
            ctx.drawImage(logoImagen, canvas.width / 2 - 750, canvas.height / 6 - 100, 240, 240);
        };

        ctx.font = "60px 'Arial'"; 
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("Winner", canvas.width / 2, canvas.height / 6 + 150);

        ctx.font = "30px 'Arial'"; 
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(`Player Name: ${lastScore.name}`, canvas.width / 2 - 200, canvas.height / 6 + 250);

        ctx.font = "30px 'Arial'"; 
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(`Player Score: ${lastScore.score}`, canvas.width / 2 - 200, canvas.height / 6 + 400);

        // Definir el margen y el color
        const margen = 20;
        const colorMargen = "#000000"; // Color de fondo del margen

        ctx.font = "30px 'Arial'"; 
        ctx.fillStyle = "#FFFFFF"; // Color del texto
        ctx.textAlign = "center";

        // Dibujar el fondo con el color del margen
        const texto = "Suelte aqui si desea volver a jugar";
        const textoWidth = ctx.measureText(texto).width;  // Medir el ancho del texto
        const textoX = canvas.width / 2;  // X centralizado
        const textoY = canvas.height / 6 + 600; // Posición Y donde va el texto

        // Dibujar el rectángulo de fondo (margen)
        ctx.fillStyle = colorMargen; // Color del fondo del margen
        ctx.fillRect(textoX - textoWidth / 2 - margen, textoY - 20 - margen, textoWidth + 2 * margen, 40 + 2 * margen);

        // Dibujar el texto encima del rectángulo
        ctx.fillStyle = "#FFFFFF"; // Color del texto
        ctx.fillText(texto, textoX, textoY);
    };












    const dragImageObj = new Image();
    dragImageObj.src = "/assets/volverAIntentar.png";  // Ruta a tu imagen "sky.png"

    // Definir las propiedades de la imagen arrastrable
    const dragImage = {
        x: canvas.width / 2 - 800,
        y: canvas.height / 6 + 200,
        width: 300,
        height: 80,
        image: dragImageObj, // Asignar la imagen cargada
        isDragging: false
    };

    // Dibujar la imagen arrastrable en el canvas
    function drawDraggableImage() {
        ctx.drawImage(dragImage.image, dragImage.x, dragImage.y, dragImage.width, dragImage.height);
    }

    dragImageObj.onload = function() {
        drawDraggableImage();
    };

    // Detectar cuando el usuario empieza a arrastrar la imagen
    canvas.addEventListener('mousedown', function(e) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Comprobar si el click está dentro del área de la imagen arrastrable
        if (mouseX >= dragImage.x && mouseX <= dragImage.x + dragImage.width &&
            mouseY >= dragImage.y && mouseY <= dragImage.y + dragImage.height) {
            dragImage.isDragging = true;
        }
    });

    // Mover la imagen cuando el usuario la arrastra
    canvas.addEventListener('mousemove', function(e) {
        if (dragImage.isDragging) {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            // Actualizar la posición de la imagen mientras se arrastra
            dragImage.x = mouseX - dragImage.width / 2;
            dragImage.y = mouseY - dragImage.height / 2;

            // Redibujar el fondo y todo lo demás, luego dibujar la imagen arrastrable
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
            ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);  // Redibujar fondo
            // Redibujar el contenido estático (texto, logo, etc.)
            ctx.font = "40px 'Arial'";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("No todas las leyendas tienen una historia", canvas.width / 2, canvas.height / 6 + 40);
            ctx.font = "60px 'Arial'";
            ctx.fillText("Winner", canvas.width / 2, canvas.height / 6 + 150);
            ctx.font = "30px 'Arial'";
            ctx.fillText(`Player Name: ${lastScore.name}`, canvas.width / 2 - 200, canvas.height / 6 + 250);
            ctx.fillText(`Player Score: ${lastScore.score}`, canvas.width / 2 - 200, canvas.height / 6 + 400);

            // Redibujar el texto con su rectángulo de fondo
            const margen = 20;
            const colorMargen = "#000000";
            const texto = "Suelte aqui si desea volver a jugar";
            const textoWidth = ctx.measureText(texto).width;
            const textoX = canvas.width / 2;
            const textoY = canvas.height / 6 + 600;

            ctx.fillStyle = colorMargen;
            ctx.fillRect(textoX - textoWidth / 2 - margen, textoY - 20 - margen, textoWidth + 2 * margen, 40 + 2 * margen);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(texto, textoX, textoY);

            // Redibujar la imagen arrastrable
            drawDraggableImage();
        }
    });

    // Detectar cuando el usuario suelta la imagen
    canvas.addEventListener('mouseup', function(e) {
        if (dragImage.isDragging) {
            dragImage.isDragging = false;

            // Obtener las coordenadas del mouse al soltar la imagen
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            // Verificar si el mouse está sobre el área de texto (con el margen)
            const textoWidth = ctx.measureText("Suelte aqui si desea volver a jugar").width;
            const textoX = canvas.width / 2;
            const textoY = canvas.height / 6 + 600;
            const textoLeft = textoX - 200;
            const textoRight = textoX + 200;
            const textoTop = textoY - 200;
            const textoBottom = textoY + 200;

            // Verificar si el mouse está dentro del área de texto
            if (mouseX >= textoLeft && mouseX <= textoRight && mouseY >= textoTop && mouseY <= textoBottom) {
                window.location.href = 'index.html';  // Redirigir a la página de inicio
            }
        }
    });
};
