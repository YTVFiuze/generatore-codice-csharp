const express = require('express');
const app = express();
const port = 3000;

// Servi i file statici dalla directory corrente
app.use(express.static('./'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
