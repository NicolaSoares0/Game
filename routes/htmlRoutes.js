const router = require('express').Router();

router.get("/", (_req, res) => {
    res.render('Inicio');
});

router.get("/MenuQuiz", (_req, res) => {
    res.render('MenuQuiz');
});

router.get("/Placar", (_req, res) => {
    res.render('Placar');
});

router.get("/Inicio", (_req, res) => {
    res.render('Inicio');
});

module.exports = router;