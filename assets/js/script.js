'use strict';

import * as h from './helper.js';
import { questions } from './questions.js';

const DOM = {
    landing: h.$('.landing'),
    startBtn: h.$('.landing-content__start-btn'),
    
    popupInfo: h.$('.popup-info'),
    exitBtn: h.$('.popup-info__exit-btn'),
    continueBtn: h.$('.popup-info__continue-btn'),
    
    quizSection: h.$('.quiz-section'),
    
    quiz: {
        quizBox: h.$('.quiz-box'),
        question: h.$('.quiz-box__question'),
        options: h.$('.quiz-box__options'),
        score: h.$('.quiz-box__score'),
        currQuestion: h.$('.quiz-box__current'), 
        nextBtn: h.$('.quiz-box__next-btn')
    },

    result: {
        resultBox: h.$('.result-box'),
        circularProgress: h.$('.result-box__progress-circle'),
        progressValue: h.$('.result-box__progress-value'),
        score: h.$('.result-box__score'),
        tryAgainBtn: h.$('.result-box__tryAgain-btn'),
        goHomeBtn: h.$('.result-box__goHome-btn')
    }
};

const ScoreManager = (function () {
    let score = 0;
    return {
        current: () => score,
        increase: () => score++,
        reset: () => score = 0
    }
})();

const QuestionNumManager = (function () {
    let question = 0;
    return {
        current: () => question,
        increase: () => question++,
        reset: () => question = 0
    }
})();

DOM.startBtn.addEventListener('click', () => {
    h.disableElement(DOM.landing);
    h.enableElement(DOM.popupInfo);
});

DOM.exitBtn.addEventListener('click', () => {
    h.disableElement(DOM.popupInfo);    
    h.enableElement(DOM.landing);
});

DOM.continueBtn.addEventListener('click', () => {
    DOM.landing.classList.add('landing--active');

    h.disableElement(DOM.popupInfo);
    h.enableElement(DOM.quizSection);
    h.enableElement(DOM.quiz.quizBox);
    
    showQuestion(QuestionNumManager.increase());
});

DOM.result.tryAgainBtn.addEventListener('click', () => {
    h.disableElement(DOM.result.resultBox);
    h.enableElement(DOM.quiz.quizBox);

    QuestionNumManager.reset();
    ScoreManager.reset();
    
    showQuestion(QuestionNumManager.increase());
});

DOM.result.goHomeBtn.addEventListener('click', () => {
    DOM.landing.classList.remove('landing--active');
    h.disableElement(DOM.result.resultBox);
    h.disableElement(DOM.quizSection);
    h.enableElement(DOM.landing);

    QuestionNumManager.reset();
    ScoreManager.reset();
});

DOM.quiz.nextBtn.addEventListener('click', () => {
    if (QuestionNumManager.current() < questions.length) {
        showQuestion(QuestionNumManager.increase());
        DOM.quiz.nextBtn.classList.remove('quiz-box__next-btn--active');
        
    } else {
        DOM.quiz.nextBtn.classList.remove('quiz-box__next-btn--active');
        showResultBox();
    }
});

function showQuestion(index) {
    const question = questions[index];
    const options = question.options;

    DOM.quiz.score.innerText = `Score: ${ScoreManager.current()} / ${questions.length}`;

    DOM.quiz.options.innerHTML = '';

    DOM.quiz.question.textContent = `${question.numb} ${question.question}`;

    options.forEach((opt) => {
        const liOption = document.createElement('li');
        liOption.classList.add('quiz-box__option');
        liOption.innerHTML = `
            <button 
            class='quiz-box__option-btn' 
            aria-pressed='false'
            role='radio'>
                <p class='quiz-box__option-text'>
                    ${opt}
                </p>
            </button>
        `
        DOM.quiz.options.appendChild(liOption);
    });

    const optionBtns = DOM.quiz.options.querySelectorAll('.quiz-box__option-btn');

    h.addEventOnElements(optionBtns, 'click', function () {
        judgeAnswer(question, this.parentElement);
    });

    DOM.quiz.currQuestion.textContent = `${QuestionNumManager.current()} of ${questions.length} Questions`; 
}

function judgeAnswer(question, answer) {
    // if user has selected, disabled all options
    [...DOM.quiz.options.children].forEach((option) => {
        option.classList.add('quiz-box__option--disabled');
    });

    const correctAnswer = question.answer;

    if (answer.innerText.trim() == correctAnswer.trim()) {
        answer.classList.add('quiz-box__option--correct');
        updateScore();           
    } else {
        answer.classList.add('quiz-box__option--incorrect');

        // Auto select correct answer 
        [...DOM.quiz.options.children].forEach((option) => {
            if (option.innerText.trim() == correctAnswer.trim())
                option.classList.add('quiz-box__option--correct');
        })  
    }

    DOM.quiz.nextBtn.classList.add('quiz-box__next-btn--active');
}

function updateScore() {
    ScoreManager.increase();
    DOM.quiz.score.textContent = `Score: ${ScoreManager.current()} / ${questions.length}`;    
}

function showResultBox() {
    h.disableElement(DOM.quiz.quizBox);
    h.enableElement(DOM.result.resultBox);
    
    let progressStartValue = 0;
    let progressEndValue = Math.round((ScoreManager.current() / questions.length) * 100);
    
    (function animateProgress() {
        DOM.result.progressValue.textContent = `${progressStartValue}%`;
        DOM.result.circularProgress.style.background = `
            conic-gradient(var(--primary) ${progressStartValue * 3.6}deg,
            rgba(255, 255, 255, .1) 0deg)
        `;

        if (progressStartValue++ < progressEndValue)
            requestAnimationFrame(animateProgress);
    })();

    DOM.result.score.textContent = `Your Score ${ScoreManager.current()} out of ${questions.length}`;
}