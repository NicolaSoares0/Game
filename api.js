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



app.post('/api/placar', async (req, res) => {
    try {
        const { nome, acertos, totalQuestoes, porcentagem } = req.body;

        // Cria uma nova entrada no banco de dados
        const novoPlacar = await Placar.create({
            nome: nome,
            acertos: acertos,
            totalQuestoes: totalQuestoes,
            porcentagem: porcentagem
        });

        console.log('Novo placar salvo:', novoPlacar.toJSON());
        res.status(201).json(novoPlacar); // Retorna o placar salvo

    } catch (error) {
        console.error('Erro ao salvar placar:', error);
        res.status(500).json({ error: 'Erro ao salvar placar' });
    }
});

// Rota GET para LER todos os placares (para o placar de líderes)
app.get('/api/placar', async (req, res) => {
    try {
        // Busca todos os placares, ordenados dos maiores acertos para os menores
        const placares = await placar.findAll({
            order: [
                ['acertos', 'DESC'], // Ordena por acertos (maior primeiro)
                ['porcentagem', 'DESC'] // Desempate pela porcentagem
            ],
            limit: 10 // Pega só os 10 melhores
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