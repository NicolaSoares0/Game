const express = require("express");
const path = require("path");
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 3000;

app.use(express.json()); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', htmlRoutes);
app.use('/api', apiRoutes);



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});