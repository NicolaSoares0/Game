const { default: axios } = require("axios");
const JSON = require("json5");
const path = require("path");
const Placar = require("./models/placar");

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (_req, res) => {
    res.render('Inicio');
});

app.get("/MenuQuiz", (_req, res) => {
    res.render('MenuQuiz');
});

app.get("/Placar", (_req, res) => {
    res.render('Placar');
});

app.get("/Inicio", (_req, res) => {
    res.render('Inicio');
});

app.post('/models/placar', async (req, res) => {
    try {
        const { nome, acertos, totalQuestoes, porcentagem } = req.body;

        if (nome === undefined || acertos === undefined || totalQuestoes === undefined || porcentagem === undefined) {
           console.error('Erro: Dados incompletos recebidos do frontend:', req.body);
           return res.status(400).json({ error: 'Dados incompletos. Verifique o payload.' });
        }

        const novoPlacar = await Placar.create({
            nome: nome,
            acertos: acertos,
            totalQuestoes: totalQuestoes,
            porcentagem: porcentagem
        });

        console.log('Novo placar salvo:', novoPlacar.toJSON());
        res.status(201).json(novoPlacar); 

    } catch (error) {
        console.error('Erro ao salvar placar:', error);
        res.status(500).json({ error: 'Erro ao salvar placar' });
    }
});

app.get('/api/placar', async (req, res) => {
    try {
        const placares = await Placar.findAll({
            order: [
                ['acertos', 'DESC'], 
                ['porcentagem', 'DESC'] 
            ],
            limit: 10 
        });

        res.status(200).json(placares);

    } catch (error) {
        console.error('Erro ao buscar placares:', error);
        res.status(500).json({ error: 'Erro ao buscar placares' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
