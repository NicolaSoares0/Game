const elementoPergunta = document.getElementById('quiz-pergunta');
const elementoOpcoes = document.getElementById('quiz-opcoes');
const elementoResposta = document.getElementById('quiz-resposta');
const botaoTentarNovamente = document.getElementById('btn-tentar-novamente');
const botaoIniciar = document.getElementById('btn-iniciar');
const Materia = document.getElementById('select-materia');

function getNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function buscarUmaQuestaoAleatoria() {
    //Sorteia os valores
    const anoAleatorio = getNumeroAleatorio(2009, 2023);
    const questaoAleatoria = getNumeroAleatorio(1, 180);


    const urlSorteada = `https://api.enem.dev/v1/exams/${anoAleatorio}/questions/${questaoAleatoria}`;

    console.log(`Tentando buscar na URL: ${urlSorteada}`);

    try {
        const response = await fetch(urlSorteada);

        // Verifica a resposta
        if (!response.ok) {

            console.warn(`Falha: ${response.status}. A combinação ${anoAleatorio}/${questaoAleatoria} não existe. Tentando outra...`);
            return null;
        }

        const questaoEncontrada = await response.json();
        console.log("SUCESSO! Questão encontrada:", questaoEncontrada);
        return questaoEncontrada;

    } catch (error) {
        console.error("Erro de rede ao tentar buscar a questão:", error.message);
        return null;
    }
}


async function carregarEExibirQuiz() {
    console.log("Iniciando busca por questão aleatória...");
    if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'none';
    if (elementoPergunta) elementoPergunta.textContent = 'Procurando uma questão (pode demorar)...';
    if (elementoOpcoes) elementoOpcoes.innerHTML = '';
    if (elementoResposta) elementoResposta.textContent = '';
    if (elementoResposta) elementoResposta.style.cssText = '';

    let questaoParaExibir = null;
    let tentativas = 0;
    const maxTentativas = 15;

    while (questaoParaExibir === null && tentativas < maxTentativas) {
        tentativas++;
        console.log(`Tentativa ${tentativas} de ${maxTentativas}...`);
        questaoParaExibir = await buscarUmaQuestaoAleatoria();

    }

    if (questaoParaExibir) {
        exibirQuestaoNaTela(questaoParaExibir);
    } else {
        console.error(`Não foi possível encontrar uma questão após ${maxTentativas} tentativas.`);
        if (elementoPergunta) elementoPergunta.textContent = `Não foi possível encontrar uma questão aleatória. A API pode estar fora do ar ou sobrecarregada. Tente novamente.`;
    }
}

function exibirQuestaoNaTela(questaoParaExibir) {
    const menu = document.querySelector('.menuJogo');
    if (menu) menu.classList.add('escondido');

    const containerQuiz = document.getElementById('quiz-container');
    if (containerQuiz) containerQuiz.style.display = 'block';


    if (elementoPergunta) {
    const ano = questaoParaExibir.year || (questaoParaExibir.exam ? questaoParaExibir.exam.year : "Ano Desconhecido");

    elementoPergunta.innerHTML = `<strong>[ENEM ${ano}]</strong> ${questaoParaExibir.question}`;
}

    if (elementoOpcoes) {
        elementoOpcoes.innerHTML = '';

    }
    if (elementoPergunta) {
        const ano = questaoParaExibir.year || (questaoParaExibir.exam ? questaoParaExibir.exam.year : "Ano Desconhecido");
        const contexto = questaoParaExibir.context || "";
        const introducao = questaoParaExibir.alternativesIntroduction || "";
        const Disciplina = questaoParaExibir.discipline || "";


        elementoPergunta.innerHTML = `<strong>[ENEM ${ano}]</strong> ${Disciplina} <br> ${contexto} <br> ${introducao}`;
    }

    if (elementoOpcoes) {
        elementoOpcoes.innerHTML = '';
        if (!questaoParaExibir.alternatives || questaoParaExibir.alternatives.length === 0) {
            if (elementoPergunta) elementoPergunta.textContent = "Erro: A questão encontrada não possui alternativas.";
            return;
        }
        questaoParaExibir.alternatives.forEach(alternativa => {
            const itemLista = document.createElement('li');
            const botaoOpcao = document.createElement('button');
            const letra = alternativa.letter || alternativa.key || alternativa.value || '?';
            const urlImagemAlternativa = alternativa.file;
            const texto = alternativa.description || alternativa.text || '[Texto da alternativa em falta]';
            
            botaoOpcao.setAttribute('data-value', letra);

            if (urlImagemAlternativa) {
                botaoOpcao.innerHTML = `${letra} ) <img src="${urlImagemAlternativa}" alt="Alternativa ${letra}" style="max-width: 90%; height: auto; vertical-align: middle;">`;
            } else {
                botaoOpcao.textContent = `${letra} ) ${texto}`;
            }

            botaoOpcao.onclick = () => {
                const valorSelecionado = botaoOpcao.getAttribute('data-value');
                const respostaCorretaLetra = questaoParaExibir.correctAlternative;
                const alternativaCorretaObj = questaoParaExibir.alternatives.find(alt => (alt.letter || alt.key || alt.value) === respostaCorretaLetra); 
                
                let htmlRespostaCorreta = `(Letra: ${respostaCorretaLetra})`;
                
                if (alternativaCorretaObj) {
                    const letraCorreta = alternativaCorretaObj.letter || alternativaCorretaObj.key || alternativaCorretaObj.value;
                    
                    if (alternativaCorretaObj.file) {
                        htmlRespostaCorreta = `${letraCorreta} ) <img src="${alternativaCorretaObj.file}" alt="Resposta Correta" style="max-height: 60px; height: auto; vertical-align: middle;">`;
                    } else {
                        const textoCorreto = alternativaCorretaObj.description || alternativaCorretaObj.text || '[Texto em falta]';
                        htmlRespostaCorreta = `${letraCorreta} ) ${textoCorreto}`;
                    }
                }


                //Comparando com 'respostaCorretaLetra'
                if (valorSelecionado === respostaCorretaLetra) {
                    if (elementoResposta) elementoResposta.textContent = "✅ Resposta Correta!";
                    if (elementoResposta) elementoResposta.style.color = 'green';
                } else {
                    if (elementoResposta) elementoResposta.innerHTML = `❌ Incorreto. A resposta certa é: ${htmlRespostaCorreta}`;
                    if (elementoResposta) elementoResposta.style.color = 'red';
                }
                elementoOpcoes.querySelectorAll('button').forEach(btn => btn.disabled = true);
                if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'block';
            };

            itemLista.appendChild(botaoOpcao);
            elementoOpcoes.appendChild(itemLista);
        });
    }
}
if (botaoIniciar) {
    botaoIniciar.addEventListener('click', (event) => {
        event.preventDefault();
        carregarEExibirQuiz();
    });
}

if (botaoTentarNovamente) {
    botaoTentarNovamente.addEventListener('click', () => {
        carregarEExibirQuiz();
    });
}
console.log('Script carregado (Modo Sorteio). Aguardando clique em "Iniciar Jogo".');