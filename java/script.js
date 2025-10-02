/*
  ================================================================================
  VERSÃO FINAL E OTIMIZADA - GARANTA QUE ESTÁ USANDO ESTE CÓDIGO
  - Filtra apenas por questões de matemática que GARANTIDAMENTE têm opções
  ================================================================================
*/

const apiUrl = 'https://api.enem.dev/v1/exams';

const elementoPergunta = document.getElementById('quiz-pergunta');
const elementoOpcoes = document.getElementById('quiz-opcoes');
const elementoResposta = document.getElementById('quiz-resposta');
const botaoTentarNovamente = document.getElementById('btn-tentar-novamente');

if (botaoTentarNovamente) {
  botaoTentarNovamente.addEventListener('click', iniciarQuizDeMatematica);
}

async function iniciarQuizDeMatematica() {
  console.log('Iniciando busca por questões do ENEM...');
  if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'none';
  if (elementoPergunta) elementoPergunta.textContent = 'Carregando uma boa pergunta...';
  if (elementoOpcoes) elementoOpcoes.innerHTML = '';
  if (elementoResposta) elementoResposta.textContent = '';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Falha na rede ao buscar dados da API.');
    }
    const todasAsQuestoes = await response.json();
    
    // Filtro otimizado que pega apenas questões de matemática E com opções
    const questoesBoas = todasAsQuestoes.filter(questao => {
      const eDeMatematica = questao.disciplines.some(disciplina => disciplina.value === 'matematica');
      const temOpcoes = questao.options && Array.isArray(questao.options) && questao.options.length > 0;
      return eDeMatematica && temOpcoes; // Só retorna a questão se as duas condições forem verdadeiras
    });

    console.log(`Filtro concluído! ${questoesBoas.length} questões de matemática utilizáveis encontradas.`);

    if (questoesBoas.length === 0) {
      if (elementoPergunta) elementoPergunta.textContent = 'Não encontramos nenhuma questão de matemática com múltipla escolha neste conjunto. Tente novamente!';
      if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'block';
      return;
    }

    const questaoAleatoria = questoesBoas[Math.floor(Math.random() * questoesBoas.length)];
    
    if (elementoPergunta) {
      elementoPergunta.textContent = questaoAleatoria.question;
    }

    if (elementoOpcoes) {
      questaoAleatoria.options.forEach(opcao => {
        const itemLista = document.createElement('li');
        const botaoOpcao = document.createElement('button');
        botaoOpcao.textContent = opcao;
        
        botaoOpcao.onclick = () => {
          if (opcao === questaoAleatoria.answer) {
            if(elementoResposta) elementoResposta.textContent = "Resposta Correta!";
            if(elementoResposta) elementoResposta.style.color = 'green';
          } else {
            if(elementoResposta) elementoResposta.textContent = `Incorreto. A resposta certa é: ${questaoAleatoria.answer}`;
            if(elementoResposta) elementoResposta.style.color = 'red';
          }
          elementoOpcoes.querySelectorAll('button').forEach(btn => btn.disabled = true);
        };
        
        itemLista.appendChild(botaoOpcao);
        elementoOpcoes.appendChild(itemLista);
      });
    }

  } catch (error) {
    console.error('Ocorreu um erro geral:', error);
    if (elementoPergunta) elementoPergunta.textContent = 'Ocorreu um erro ao carregar o quiz.';
    if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'block';
  }
}

// Chama a função para iniciar tudo
iniciarQuizDeMatematica();