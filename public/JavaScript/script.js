const elementoPergunta = document.getElementById('quiz-pergunta');
const elementoOpcoes = document.getElementById('quiz-opcoes');
const elementoResposta = document.getElementById('quiz-resposta');
const botaoTentarNovamente = document.getElementById('btn-tentar-novamente');
const botaoIniciar = document.getElementById('btn-iniciar');

function getNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function buscarUmaQuestaoAleatoria() {
    //1. Sorteia os valores
    const anoAleatorio = getNumeroAleatorio(2009, 2023);
    const questaoAleatoria = getNumeroAleatorio(1, 180); 

   
    const urlSorteada = `https://api.enem.dev/v1/exams/${anoAleatorio}/questions/${questaoAleatoria}`;
    
    console.log(`Tentando buscar na URL: ${urlSorteada}`);

    try {
        const response = await fetch(urlSorteada);

        // 3. Verifica a resposta
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

    // --- FIM DO LOOP ---

    // 4. Verifica o resultado final
    if (questaoParaExibir) {
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
/**
 * Função separada para exibir a questão na tela.
 *
 * *** VERSÃO CORRIGIDA PARA A API 'api.enem.dev' ***
 *
 */
function exibirQuestaoNaTela(questaoParaExibir) {
    // --- MÁGICA DA TROCA DE TELA ---
    // 1. Esconde o menu de configuração
    const menu = document.querySelector('.menuJogo');
    if (menu) menu.classList.add('escondido'); // Adiciona a classe .escondido

    // 2. Mostra o container do quiz
    const containerQuiz = document.getElementById('quiz-container');
    if (containerQuiz) containerQuiz.style.display = 'block';
    // --- FIM DA MÁGICA ---

    
    if (elementoPergunta) {
        // (O resto da sua função continua exatamente igual)
        const ano = questaoParaExibir.year || (questaoParaExibir.exam ? questaoParaExibir.exam.year : "Ano Desconhecido");
        elementoPergunta.innerHTML = `<strong>[ENEM ${ano}]</strong> ${questaoParaExibir.question}`;
    }

    if (elementoOpcoes) {
        // ... (toda a sua lógica de criar botões continua aqui) ...
        elementoOpcoes.innerHTML = '';
        
        // ... (etc) ...
    }
    if (elementoPergunta) {
        // CORREÇÃO 1: Tornando a busca pelo ano mais robusta.
        // A API nova tem 'year' na raiz E dentro de 'exam'. Vamos checar os dois.
        const ano = questaoParaExibir.year || (questaoParaExibir.exam ? questaoParaExibir.exam.year : "Ano Desconhecido");
        
        // A propriedade 'question' parece estar correta, de acordo com o log.
        elementoPergunta.innerHTML = `<strong>[ENEM ${ano}]</strong> ${questaoParaExibir.question}`;
    }

    if (elementoOpcoes) {
        elementoOpcoes.innerHTML = ''; // Limpa opções
        
        if (!questaoParaExibir.alternatives || questaoParaExibir.alternatives.length === 0) {
            if (elementoPergunta) elementoPergunta.textContent = "Erro: A questão encontrada não possui alternativas.";
            return;
        }

        // CORREÇÃO 2: Mudando a leitura das alternativas.
        // Vamos supor que a API usa 'key' e 'description' (ou 'text')
        // (Baseado no fato de que 'value' e 'text' falharam)
        // A API da Vercel usava 'value' e 'text'.
        // A API do enem.dev parece usar 'key' e 'description', mas vou checar 'text' também.
        questaoParaExibir.alternatives.forEach(alternativa => {
            const itemLista = document.createElement('li');
            const botaoOpcao = document.createElement('button');

            // Tentativa de adivinhar a estrutura da alternativa
            const letra = alternativa.key || alternativa.value || '?';
            const texto = alternativa.description || alternativa.text || '[Texto da alternativa em falta]';

            botaoOpcao.textContent = `${letra} ) ${texto}`;
            botaoOpcao.setAttribute('data-value', letra); // Guarda o valor (A, B, C...)

            botaoOpcao.onclick = () => {
                const valorSelecionado = botaoOpcao.getAttribute('data-value');
                
                // CORREÇÃO 3: A API nova usa 'correctAlternative', não 'answer'.
                const respostaCorretaLetra = questaoParaExibir.correctAlternative; 

                // Encontra o objeto da alternativa correta para pegar o texto completo
                const alternativaCorretaObj = questaoParaExibir.alternatives.find(alt => (alt.key || alt.value) === respostaCorretaLetra);
                
                const textoRespostaCorreta = alternativaCorretaObj
                    ? `${(alternativaCorretaObj.key || alternativaCorretaObj.value)} ) ${alternativaCorretaObj.description || alternativaCorretaObj.text || '[Texto em falta]'}`
                    : `(Letra: ${respostaCorretaLetra})`;

                // CORREÇÃO 4: Comparando com 'respostaCorretaLetra'
                if (valorSelecionado === respostaCorretaLetra) {
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