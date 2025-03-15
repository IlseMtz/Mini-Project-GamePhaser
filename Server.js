const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// Servir archivos estáticos desde la misma carpeta donde está el servidor
app.use(express.static(__dirname));

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'level1.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});