import { questions } from "./questions.js";

const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');

startBtn.onclick = () => {
    popupInfo.classList.add("active");
    main.classList.add("active");
}

exitBtn.onclick = () => {
    popupInfo.classList.remove("active");
    main.classList.remove("active");
}

continueBtn.onclick = () => {
    quizSection.classList.add("active");
    popupInfo.classList.remove("active");
    main.classList.remove("active");
    quizBox.classList.add("active"); 
    
    showQuestions(0);
    questionCounter(1);
}

let questionCount = 0;
let questionNumb = 1;

const nextBtn = document.querySelector(".next-btn");

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);
    } else {
        console.log("Question Completed");
    }
}

const optionList = document.querySelector(".option-list");

// getting questions and options from array
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb} ${questions[index].question}`;

    let optionTag = `
        <div class="option">
            <span>${questions[index].options[0]}</span>
        </div>
        <div class="option">
            <span>${questions[index].options[1]}</span>
        </div>
        <div class="option">
            <span>${questions[index].options[2]}</span>
        </div>
        <div class="option">
            <span>${questions[index].options[3]}</span>
        </div>
    `;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

window.optionSelected = function(answer) {
    let userAnswer = answer.innerText;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer == correctAnswer) {
        answer.classList.add("correct");               
    } else {
        answer.classList.add("incorrect");
        
        //if answer incorrect, auto selected correct answer
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].innerText == correctAnswer) {
                optionList.children[i].classList.add('correct');
            }
        }
    }

    // if user has selected, disabled all options
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }
}

function questionCounter(index) {
    const questionTotal = document.querySelector(".question-total");
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}