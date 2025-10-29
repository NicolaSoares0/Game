/* =======================================================
    SCRIPT.JS - VERSÃO COM SORTEIO ALEATÓRIO (API enem.dev)
   ======================================================= */

// --- Elementos da interface ---
// (Estes continuam os mesmos)
const elementoPergunta = document.getElementById('quiz-pergunta');
const elementoOpcoes = document.getElementById('quiz-opcoes');
const elementoResposta = document.getElementById('quiz-resposta');
const botaoTentarNovamente = document.getElementById('btn-tentar-novamente');
const botaoIniciar = document.getElementById('btn-iniciar');

// As 'const' de matéria e número não são mais necessárias, 
// pois a busca agora é totalmente aleatória.


/* =======================================================
    NOVAS FUNÇÕES PARA BUSCA ALEATÓRIA
   ======================================================= */

/**
 * Gera um número inteiro aleatório entre min (inclusivo) e max (inclusivo).
 */
function getNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Tenta buscar UMA questão aleatória da API 'api.enem.dev'.
 * Pode retornar 'null' se a combinação sorteada não existir (Erro 404).
 */
async function buscarUmaQuestaoAleatoria() {
    // 1. Sorteia os valores
    const anoAleatorio = getNumeroAleatorio(2009, 2023);
    const questaoAleatoria = getNumeroAleatorio(1, 190); // Nota: 1-180 seria mais seguro

    // 2. Monta a URL com os valores sorteados
    const urlSorteada = `https://api.enem.dev/v1/exams/${anoAleatorio}/questions/${questaoAleatoria}`;
    
    console.log(`Tentando buscar na URL: ${urlSorteada}`);

    try {
        const response = await fetch(urlSorteada);

        // 3. Verifica a resposta
        if (!response.ok) {
            // ISSO VAI ACONTECER MUITO! (Erro 404 - Not Found)
            console.warn(`Falha: ${response.status}. A combinação ${anoAleatorio}/${questaoAleatoria} não existe. Tentando outra...`);
            return null; // Retorna nulo para sabermos que falhou
        }

        // Se chegamos aqui, a resposta foi OK (200)!
        const questaoEncontrada = await response.json();
        console.log("SUCESSO! Questão encontrada:", questaoEncontrada);
        return questaoEncontrada;

    } catch (error) {
        // Isso é um erro de rede (API fora do ar, sem internet)
        console.error("Erro de rede ao tentar buscar a questão:", error.message);
        return null; // Retorna nulo para sabermos que falhou
    }
}


/* =======================================================
    FUNÇÃO PRINCIPAL DO QUIZ (MODIFICADA)
   ======================================================= */

// Esta função SUBSTITUI a sua 'carregarEExibirQuiz' antiga.
// Note que ela não precisa mais de parâmetros de matéria ou número.
async function carregarEExibirQuiz() {
    console.log("Iniciando busca por questão aleatória...");
    if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'none';
    if (elementoPergunta) elementoPergunta.textContent = 'Procurando uma questão (pode demorar)...';
    if (elementoOpcoes) elementoOpcoes.innerHTML = '';
    if (elementoResposta) elementoResposta.textContent = '';
    if (elementoResposta) elementoResposta.style.cssText = '';

    let questaoParaExibir = null;
    let tentativas = 0;
    const maxTentativas = 15; // Aumentei para 15 chances

    // Loop de tentativas: Tenta até 'maxTentativas' vezes
    while (questaoParaExibir === null && tentativas < maxTentativas) {
        tentativas++;
        console.log(`Tentativa ${tentativas} de ${maxTentativas}...`);
        questaoParaExibir = await buscarUmaQuestaoAleatoria();
        
        // Se a função retornou nulo, o loop vai rodar novamente.
    }

    // --- FIM DO LOOP ---

    // 4. Verifica o resultado final
    if (questaoParaExibir) {
        // SUCESSO!
        // Agora, usamos a lógica que você já tinha para exibir a questão.
        // **IMPORTANTE**: Estou assumindo que a estrutura de dados da nova API
        // é IGUAL à da API antiga (ex: .question, .alternatives, .answer).
        // Se for diferente, estas linhas abaixo precisarão de ajuste.
        
        exibirQuestaoNaTela(questaoParaExibir);

    } else {
        // FALHA!
        console.error(`Não foi possível encontrar uma questão após ${maxTentativas} tentativas.`);
        if (elementoPergunta) elementoPergunta.textContent = `Não foi possível encontrar uma questão aleatória. A API pode estar fora do ar ou sobrecarregada. Tente novamente.`;
    }
}

/**
 * Função separada para exibir a questão na tela.
 * (Esta é a lógica que estava dentro do 'try' no seu script antigo)
 */
function exibirQuestaoNaTela(questaoParaExibir) {
    if (elementoPergunta) {
        // A nova API tem o ano em 'exam.year'
        const ano = questaoParaExibir.exam ? questaoParaExibir.exam.year : "Ano Desconhecido";
        elementoPergunta.innerHTML = `<strong>[ENEM ${ano}]</strong> ${questaoParaExibir.question}`;
    }

    if (elementoOpcoes) {
        elementoOpcoes.innerHTML = ''; // Limpa opções
        
        // Verifica se as alternativas existem
        if (!questaoParaExibir.alternatives || questaoParaExibir.alternatives.length === 0) {
            if (elementoPergunta) elementoPergunta.textContent = "Erro: A questão encontrada não possui alternativas.";
            return;
        }

        questaoParaExibir.alternatives.forEach(alternativa => {
            const itemLista = document.createElement('li');
            const botaoOpcao = document.createElement('button');
            botaoOpcao.textContent = `${alternativa.value || '?'} ) ${alternativa.text || '[Texto em falta]'}`;
            botaoOpcao.setAttribute('data-value', alternativa.value || '');

            botaoOpcao.onclick = () => {
                const valorSelecionado = botaoOpcao.getAttribute('data-value');
                const alternativaCorretaObj = questaoParaExibir.alternatives.find(alt => alt && alt.value === questaoParaExibir.answer);
                const textoRespostaCorreta = alternativaCorretaObj
                    ? `${alternativaCorretaObj.value}) ${alternativaCorretaObj.text || '[Texto em falta]'}`
                    : `(Letra: ${questaoParaExibir.answer})`;

                if (valorSelecionado === questaoParaExibir.answer) {
                    if (elementoResposta) elementoResposta.textContent = "✅ Resposta Correta!";
                    if (elementoResposta) elementoResposta.style.color = 'green';
                } else {
                    if (elementoResposta) elementoResposta.textContent = `❌ Incorreto. A resposta certa é: ${textoRespostaCorreta}`;
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


/* =======================================================
    EVENT LISTENERS (MODIFICADOS)
   ======================================================= */

if (botaoIniciar) {
    botaoIniciar.addEventListener('click', (event) => {
        event.preventDefault(); 
        // Chama a nova função sem parâmetros, pois a lógica de 
        // matéria/número não existe mais.
        carregarEExibirQuiz();
    });
}

if (botaoTentarNovamente) {
    botaoTentarNovamente.addEventListener('click', () => {
        // Também chama a nova função sem parâmetros.
        carregarEExibirQuiz();
    });
}

// --- INICIALIZAÇÃO ---
console.log('Script carregado (Modo Sorteio). Aguardando clique em "Iniciar Jogo".');