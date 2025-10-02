const { default: axios } = require("axios");
const JSON = require("json5");

const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
    axios.get('https://api.enem.dev/v1/exams')
    .then(response => {
        console.log(response.data);
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).send('Error fetching data from GitHub API');
    });
});