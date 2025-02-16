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
                <div class="question-container" id="question-container${index}">
                    <h4>${question.title}</h4>
                    ${question.options.map((option, i) => `
                        <div class="form-check">
                            <input type="radio" class="form-check-input" name="question${index}" value="${i}">
                            <label class="form-check-label">${option}</label>
                        </div>
                    `).join('')}
                    <div class="answer" id="answer${index}" style="display: none;"></div>
                </div>
            `;
            quizContainer.append(questionHtml);
        });
    
        $("#submit-quiz").show().prop("disabled", true);
        $("input[type='radio']").change(checkAllAnswered);
    }
    
    function checkAllAnswered() {
        let allAnswered = true;
    
        questions.forEach((_, index) => {
            if ($(`input[name="question${index}"]:checked`).length === 0) {
                allAnswered = false;
            }
        });
    
        $("#submit-quiz").prop("disabled", !allAnswered);
    }
    
    function checkAnswers() {
        let score = 0;
    
        questions.forEach((question, index) => {
            const selectedOption = $(`input[name="question${index}"]:checked`).val();
            const answerContainer = $(`#answer${index}`);
            const questionContainer = $(`#question-container${index}`);
    
            if (selectedOption == question.answer) {
                score++;
                answerContainer.text(`ถูกต้อง! คำตอบที่ถูกคือ: ${question.options[question.answer]}`).css("color", "green");
                questionContainer.css("border", "2px solid green");
            } else {
                answerContainer.text(`ผิด! คำตอบที่ถูกคือ: ${question.options[question.answer]}`).css("color", "red");
                questionContainer.css("border", "2px solid red");
            }
            answerContainer.show();
        });
    
        $("#score-section").text(`คุณได้คะแนน: ${score} จาก ${questions.length}`);
    }
    
    $("#submit-quiz").show().off("click").click(checkAnswers);
});
