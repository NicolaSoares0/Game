const { default: axios } = require("axios");
const JSON = require("json5");
const path = require("path")


const express = require("express");
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(_req, res) =>{
    res.render('Inicio');
});

app.get("/MenuQuiz",(_req, res) =>{
    res.render('MenuQuiz');
});
