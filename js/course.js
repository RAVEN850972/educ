document.addEventListener('DOMContentLoaded', function() {
    // Правильные ответы для каждого блока
    const correctAnswers = {
        1: ['B'],
        2: ['B'],
        3: ['B']
    };

    // Отслеживание прогресса
    const completedBlocks = {};
    const totalBlocks = Object.keys(correctAnswers).length;

    // Добавляем обработчики событий для заголовков блоков
    document.querySelectorAll('.block-header').forEach(header => {
        header.addEventListener('click', function() {
            const blockContent = this.nextElementSibling;
            const indicator = this.querySelector('.block-indicator');
            
            if (blockContent.classList.contains('hidden')) {
                blockContent.classList.remove('hidden');
                indicator.textContent = '▲';
            } else {
                blockContent.classList.add('hidden');
                indicator.textContent = '▼';
            }
        });
    });

    // Обработчик выбора варианта ответа
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.question');
            const options = question.querySelectorAll('.option');
            
            // Убираем предыдущие выделения
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Выделяем выбранный вариант
            this.classList.add('selected');
        });
    });

    // Проверка ответов
    document.querySelectorAll('.check-answers').forEach(button => {
        button.addEventListener('click', function() {
            const blockNum = this.getAttribute('data-block');
            const block = document.getElementById(`block-${blockNum}`);
            const questions = block.querySelectorAll('.question');
            const resultElement = document.getElementById(`result-${blockNum}`);
            
            let correctCount = 0;
            
            questions.forEach((question, index) => {
                const selectedOption = question.querySelector('.option.selected');
                const options = question.querySelectorAll('.option');
                
                // Сбрасываем предыдущие состояния
                options.forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });
                
                if (selectedOption) {
                    const selectedValue = selectedOption.getAttribute('data-value');
                    
                    // Помечаем правильные и неправильные ответы
                    options.forEach(opt => {
                        const value = opt.getAttribute('data-value');
                        
                        if (value === correctAnswers[blockNum][index]) {
                            opt.classList.add('correct');
                        }
                        
                        if (selectedValue === correctAnswers[blockNum][index]) {
                            correctCount++;
                        } else if (selectedOption === opt) {
                            opt.classList.add('incorrect');
                        }
                    });
                }
            });
            
            // Показываем результат
            resultElement.textContent = `Результат: ${correctCount} из ${questions.length} правильных ответов`;
            resultElement.classList.remove('success', 'error');
            
            if (correctCount === questions.length) {
                resultElement.classList.add('success');
                
                // Отмечаем блок как пройденный
                completedBlocks[blockNum] = true;
                
                // Показываем бейдж
                const badge = document.getElementById(`badge-${blockNum}`);
                badge.classList.remove('hidden');
                
                // Включаем кнопку следующего блока
                const nextButton = document.getElementById(`next-${blockNum}`);
                if (nextButton) nextButton.disabled = false;
                
                // Обновляем прогресс
                updateProgress();
            } else {
                resultElement.classList.add('error');
            }
        });
    });

    // Переход к следующему блоку
    document.querySelectorAll('.next-block').forEach(button => {
        button.addEventListener('click', function() {
            const nextBlockNum = this.getAttribute('data-next');
            const nextBlock = document.getElementById(`block-${nextBlockNum}`);
            const nextContent = document.getElementById(`content-${nextBlockNum}`);
            
            // Открываем следующий блок
            nextContent.classList.remove('hidden');
            nextBlock.querySelector('.block-indicator').textContent = '▲';
            
            // Прокручиваем к началу блока
            nextBlock.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Обновление прогресса
    function updateProgress() {
        const completedCount = Object.values(completedBlocks).filter(Boolean).length;
        const percentage = Math.round((completedCount / totalBlocks) * 100);
        
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        
        progressFill.style.width = `${percentage}%`;
        progressPercent.textContent = `${percentage}%`;
        
        // Если все блоки пройдены, показываем сертификат
        if (completedCount === totalBlocks) {
            showCertificate();
        }
    }

    // Показ сертификата
    function showCertificate() {
        const courseContent = document.querySelector('.course-content');
        const certificate = document.getElementById('certificate');
        
        courseContent.style.display = 'none';
        certificate.classList.remove('hidden');
        
        // Устанавливаем текущую дату
        const certificateDate = document.getElementById('certificate-date');
        certificateDate.textContent = new Date().toLocaleDateString('ru-RU');
    }
});
