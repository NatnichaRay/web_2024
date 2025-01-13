$(document).ready(function () {
    let questions = [];

    fetch('quiz.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            $("#start-quiz").click(startQuiz);
        })
        .catch(error => console.error('Error loading quiz.json:', error));

    function startQuiz() {
        $("#quiz-section").show();
        $("#start-section").hide();
        generateQuestions();
    }

    function generateQuestions() {
        const quizContainer = $("#quiz-questions");
        quizContainer.empty();
    
        questions.forEach((question, index) => {
            const questionHtml = `
                <div class="question-container">
                    <h4>${question.title}</h4>
                    ${question.options.map((option, i) => `
                        <div class="form-check">
                            <input type="radio" class="form-check-input" name="question${index}" value="${i}">
                            <label class="form-check-label">${option}</label>
                        </div>
                    `).join('')}
                </div>
            `;
            quizContainer.append(questionHtml);
        });
    
        $("#submit-quiz").show().click(checkAnswers);
    }
    
    function checkAnswers() {
        let score = 0;

        questions.forEach((question, index) => {
            const selectedOption = $(`input[name="question${index}"]:checked`).val();
            if (selectedOption == question.answer) {
                score++;
            }
        });

        $("#score-section").text(`คุณได้คะแนน: ${score} จาก ${questions.length}`);
    }
});