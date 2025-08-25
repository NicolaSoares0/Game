// Seus dados do Quiz (mantidos como estão)
const quizData = [
    {
        question: "Um pintor pretende fazer uma reprodução do quadro Guernica em uma tela de dimensões 20 cm por 30 cm. Essa obra, de autoria do espanhol Pablo Picasso, é uma pintura com 3,6 m de altura e 7,8 m de comprimento. A reprodução a ser feita deverá preencher a maior área possível da tela, mantendo a proporção entre as dimensões da obra original. A escala que deve ser empregada para essa reprodução é",
        a: "1 : 12",
        b: "1 : 18",
        c: "1 : 21",
        d: "1 : 26",
        correct: "d",
    },
    {
        question: "Na planta baixa de uma casa, um quarto retangular, cuja área é de 24 m2, está representado por um retângulo com lados medindo 0,10 m e 0,15 m. A escala dessa planta é",
        a: "1 : 24",
        b: "1 : 40",
        c: "1 : 60",
        d: "1 : 80",
        correct: "b",
    },
    {
        question: "Um instituto de pesquisa constatou que, nos últimos dez anos, o crescimento populacional de uma cidade foi de 135,25%. Qual é a representação decimal da taxa percentual desse crescimento populacional?",
        a: "13525,0",
        b: "135,25",
        c: "13,525",
        d: "1,3525",
        correct: "d",
    },
    {
        question: "Um estudante de arquitetura projetou um prédio de 32 m de altura a ser construído em uma maquete, em papel-cartão, na escala 1 : 50. Nesse caso, na maquete, a altura do prédio mede ",
        a: "0,32 m.",
        b: "0,50 m.",
        c: "0,64 m.",
        d: "1,00 m.",
        correct: "c",
    },
];

const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');

let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
    const allLi = document.querySelectorAll('ul li');
    allLi.forEach(li => {
        li.classList.remove('correct', 'incorrect');
    });

    answerEls.forEach(answerEl => {
        answerEl.disabled = false;
    });

    submitBtn.disabled = false;

    deselectAnswers(); 

    const currentQuizData = quizData[currentQuiz];

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();

    if (answer) {
        answerEls.forEach(answerEl => {
            answerEl.disabled = true;
        });
        submitBtn.disabled = true;

        const correctAnswerId = quizData[currentQuiz].correct;
        const selectedLi = document.getElementById('li_' + answer);
        const correctLi = document.getElementById('li_' + correctAnswerId);

        if (answer === correctAnswerId) {
            score++;
            selectedLi.classList.add('correct');
        } else {
            selectedLi.classList.add('incorrect');
            correctLi.classList.add('correct');
        }

        currentQuiz++;

        setTimeout(() => {
            if (currentQuiz < quizData.length) {
                loadQuiz();
            } else {
                // <<<---- AQUI FOI FEITA A ALTERAÇÃO ---->>>
                quiz.innerHTML = `
                    <div class="quiz-header">
                        <h2>Quiz Finalizado!</h2>
                    </div>
                    <div class="results-body">
                        <p>Você acertou ${score} de ${quizData.length} perguntas.</p>
                        <div class="button-container">
                            <button onclick="location.reload()">Jogar Novamente</button>
                            <a href="inicio.html" class="btn">Voltar ao Início</a> 
                        </div>
                    </div>
                `;
            }
        }, 1500);
    }
});