/**
 * Функционал тестов для сайта SmAIth Learn
 */

// Инициализация тестов
document.addEventListener('DOMContentLoaded', () => {
    setupQuizNavigation();
    setupTopicSelection();
    loadQuizStats();
    
    // Автоматически открываем тест из URL хеша, если он есть
    if (window.location.hash) {
        const topicId = window.location.hash.substring(1);
        openTopic(topicId);
    }
});

// Настройка навигации по вопросам
function setupQuizNavigation() {
    // Находим все тесты на странице
    document.querySelectorAll('.quiz-container').forEach(container => {
        const prevButton = container.querySelector('.quiz-prev');
        const nextButton = container.querySelector('.quiz-next');
        const submitButton = container.querySelector('.quiz-submit');
        const restartButton = container.querySelector('.restart-quiz');
        const questions = container.querySelectorAll('.quiz-question');
        const progressFill = container.querySelector('.progress-fill');
        const currentQuestionSpan = container.querySelector('.current-question');
        
        if (!prevButton || !nextButton || !submitButton || !questions.length) return;
        
        // Текущий вопрос
        let currentQuestion = 1;
        const totalQuestions = questions.length;
        
        // Настраиваем кнопку "Далее"
        nextButton.addEventListener('click', () => {
            if (currentQuestion < totalQuestions) {
                showQuestion(currentQuestion + 1);
            }
        });
        
        // Настраиваем кнопку "Назад"
        prevButton.addEventListener('click', () => {
            if (currentQuestion > 1) {
                showQuestion(currentQuestion - 1);
            }
        });
        
        // Настраиваем кнопку "Проверить результаты"
        submitButton.addEventListener('click', () => {
            checkResults(container);
        });
        
        // Настраиваем кнопку "Пройти еще раз"
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                resetQuiz(container);
            });
        }
        
        // Функция для отображения конкретного вопроса
        function showQuestion(questionNumber) {
            // Скрываем все вопросы
            questions.forEach(question => {
                question.classList.remove('active');
            });
            
            // Отображаем нужный вопрос
            questions.forEach(question => {
                if (parseInt(question.getAttribute('data-question')) === questionNumber) {
                    question.classList.add('active');
                }
            });
            
            // Обновляем текущий вопрос
            currentQuestion = questionNumber;
            
            // Обновляем номер вопроса в интерфейсе
            if (currentQuestionSpan) {
                currentQuestionSpan.textContent = currentQuestion;
            }
            
            // Обновляем прогресс-бар
            if (progressFill) {
                const progress = (currentQuestion - 1) / totalQuestions * 100;
                progressFill.style.width = `${progress}%`;
            }
            
            // Управляем кнопками навигации
            prevButton.disabled = currentQuestion === 1;
            
            if (currentQuestion === totalQuestions) {
                nextButton.style.display = 'none';
                submitButton.style.display = 'block';
            } else {
                nextButton.style.display = 'block';
                submitButton.style.display = 'none';
            }
        }
        
        // Настраиваем обработчики для вариантов ответов
        container.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                // Находим группу опций для этого вопроса
                const questionElem = option.closest('.quiz-question');
                const options = questionElem.querySelectorAll('.quiz-option');
                
                // Снимаем выделение со всех опций
                options.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Выделяем выбранную опцию
                option.classList.add('selected');
                
                // Отмечаем радиокнопку
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                }
            });
        });
    });
}

// Проверка результатов теста
function checkResults(container) {
    // Находим все вопросы
    const questions = container.querySelectorAll('.quiz-question');
    let correctAnswers = 0;
    
    // Проверяем каждый вопрос
    questions.forEach(question => {
        // Находим выбранный ответ
        const selectedOption = question.querySelector('.quiz-option.selected');
        
        // Если ответ выбран
        if (selectedOption) {
            // Если ответ правильный
            if (selectedOption.hasAttribute('data-correct')) {
                correctAnswers++;
                
                // Показываем сообщение о правильном ответе
                const feedback = question.querySelector('.quiz-feedback.correct');
                if (feedback) {
                    feedback.style.display = 'block';
                }
            } else {
                // Показываем сообщение о неправильном ответе
                const feedback = question.querySelector('.quiz-feedback.incorrect');
                if (feedback) {
                    feedback.style.display = 'block';
                }
            }
        }
    });
    
    // Скрываем вопросы и показываем результаты
    questions.forEach(question => {
        question.classList.remove('active');
    });
    
    // Отображаем результаты
    const resultsElement = container.querySelector('.quiz-results');
    const scoreElement = resultsElement.querySelector('.score');
    const totalElement = resultsElement.querySelector('.total');
    const messageElement = resultsElement.querySelector('.results-message');
    
    if (resultsElement && scoreElement && totalElement) {
        resultsElement.style.display = 'block';
        scoreElement.textContent = correctAnswers;
        totalElement.textContent = questions.length;
        
        // Формируем сообщение в зависимости от результата
        const percentage = (correctAnswers / questions.length) * 100;
        let messageClass, messageText;
        
        if (percentage >= 90) {
            messageClass = 'excellent';
            messageText = 'Отлично! Вы прекрасно усвоили материал!';
        } else if (percentage >= 70) {
            messageClass = 'good';
            messageText = 'Хороший результат! Вы хорошо понимаете тему.';
        } else if (percentage >= 50) {
            messageClass = 'average';
            messageText = 'Неплохо, но есть над чем поработать. Рекомендуем повторить материал.';
        } else {
            messageClass = 'poor';
            messageText = 'Вам стоит более внимательно изучить материал и попробовать снова.';
        }
        
        messageElement.textContent = messageText;
        messageElement.className = 'results-message ' + messageClass;
        
        // Скрываем навигацию
        container.querySelector('.quiz-navigation').style.display = 'none';
        
        // Сохраняем результаты
        saveQuizResult(container.id, correctAnswers, questions.length);
    }
}

// Сброс теста
function resetQuiz(container) {
    // Находим все вопросы
    const questions = container.querySelectorAll('.quiz-question');
    
    // Сбрасываем выбранные ответы
    container.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = false;
        }
    });
    
    // Скрываем обратную связь по ответам
    container.querySelectorAll('.quiz-feedback').forEach(feedback => {
        feedback.style.display = 'none';
    });
    
    // Скрываем результаты
    const resultsElement = container.querySelector('.quiz-results');
    if (resultsElement) {
        resultsElement.style.display = 'none';
    }
    
    // Показываем навигацию
    container.querySelector('.quiz-navigation').style.display = 'flex';
    
    // Показываем первый вопрос
    questions.forEach(question => {
        question.classList.remove('active');
        if (question.getAttribute('data-question') === '1') {
            question.classList.add('active');
        }
    });
    
    // Сбрасываем прогресс-бар
    const progressFill = container.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    // Сбрасываем кнопки навигации
    const prevButton = container.querySelector('.quiz-prev');
    const nextButton = container.querySelector('.quiz-next');
    const submitButton = container.querySelector('.quiz-submit');
    
    if (prevButton && nextButton && submitButton) {
        prevButton.disabled = true;
        nextButton.style.display = 'block';
        submitButton.style.display = 'none';
    }
    
    // Обновляем номер вопроса в интерфейсе
    const currentQuestionSpan = container.querySelector('.current-question');
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = '1';
    }
}

// Настройка выбора темы теста
function setupTopicSelection() {
    // Находим все карточки с темами
    const topicCards = document.querySelectorAll('.topic-card, .topic-link');
    
    // Настраиваем обработчики для выбора темы
    topicCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const topicId = card.getAttribute('data-topic') || card.getAttribute('href').substring(1);
            openTopic(topicId);
        });
    });
}

// Открытие выбранной темы теста
function openTopic(topicId) {
    // Скрываем все тесты
    document.querySelectorAll('.quiz-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Отображаем выбранный тест
    const selectedContainer = document.getElementById(topicId);
    if (selectedContainer) {
        selectedContainer.classList.add('active');
        
        // Сбрасываем выбранную карточку темы
        document.querySelectorAll('.topic-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Выделяем выбранную карточку
        const selectedCard = document.querySelector(`.topic-card[data-topic="${topicId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
        
        // Сбрасываем выбранную боковую ссылку
        document.querySelectorAll('.topic-link').forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Выделяем выбранную боковую ссылку
        const selectedLink = document.querySelector(`.topic-link[href="#${topicId}"]`);
        if (selectedLink) {
            selectedLink.parentElement.classList.add('active');
        }
        
        // Прокручиваем к тесту
        selectedContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Сохранение результатов теста
function saveQuizResult(quizId, correct, total) {
    // Получаем текущую статистику из localStorage
    let stats = JSON.parse(localStorage.getItem('quizStats')) || {};
    
    // Обновляем статистику для данного теста
    stats[quizId] = {
        correct,
        total,
        timestamp: Date.now()
    };
    
    // Сохраняем обновленную статистику
    localStorage.setItem('quizStats', JSON.stringify(stats));
    
    // Обновляем отображение статистики
    updateQuizStats();
}

// Загрузка и отображение статистики
function loadQuizStats() {
    // Обновляем отображение статистики
    updateQuizStats();
    
    // Настраиваем кнопку сброса статистики
    const resetButton = document.querySelector('.reset-stats');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Очищаем статистику
            localStorage.removeItem('quizStats');
            
            // Обновляем отображение
            updateQuizStats();
            
            alert('Статистика успешно сброшена!');
        });
    }
}

// Обновление отображения статистики
function updateQuizStats() {
    const completedTestsElement = document.getElementById('completed-tests');
    const averageScoreElement = document.getElementById('average-score');
    
    if (!completedTestsElement || !averageScoreElement) return;
    
    // Получаем текущую статистику из localStorage
    const stats = JSON.parse(localStorage.getItem('quizStats')) || {};
    const quizIds = Object.keys(stats);
    
    // Подсчитываем количество завершенных тестов
    const completedTests = quizIds.length;
    
    // Подсчитываем средний результат
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    quizIds.forEach(id => {
        totalCorrect += stats[id].correct;
        totalQuestions += stats[id].total;
    });
    
    const averageScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    // Обновляем отображение
    completedTestsElement.textContent = `${completedTests}/6`;
    averageScoreElement.textContent = `${averageScore}%`;
}