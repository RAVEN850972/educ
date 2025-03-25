document.addEventListener('DOMContentLoaded', function() {
    // Correct answers for each block
    const correctAnswers = {
        1: ['C', 'B', 'A'],
        2: ['B', 'A', 'B'],
        3: ['C', 'B', 'B'],
        4: ['B', 'B', 'B'],
        5: ['B', 'B', 'A']
    };

    // Track completed blocks
    const completedBlocks = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
    };

    // Make first block content visible on page load
    document.getElementById('content-1').classList.remove('hidden');

    // Add event listeners to all block headers
    document.querySelectorAll('.block-header').forEach(header => {
        header.addEventListener('click', function() {
            const blockId = this.getAttribute('data-block');
            toggleBlock(blockId);
        });
    });

    // Add event listeners to all options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            selectOption(this);
        });
    });

    // Add event listeners to check answers buttons
    document.querySelectorAll('.check-answers').forEach(button => {
        button.addEventListener('click', function() {
            const blockNum = parseInt(this.getAttribute('data-block'));
            checkAnswers(blockNum);
        });
    });

    // Add event listeners to next block buttons
    document.querySelectorAll('.next-block').forEach(button => {
        button.addEventListener('click', function() {
            const nextBlockNum = parseInt(this.getAttribute('data-next'));
            openBlock(nextBlockNum);
        });
    });

    // Add event listener to finish course button
    document.getElementById('finish-course').addEventListener('click', function() {
        showCertificate();
    });

    // Function to toggle block visibility
    function toggleBlock(blockId) {
        const blockNum = parseInt(blockId.split('-')[1]);
        const content = document.getElementById(`content-${blockNum}`);
        const indicator = document.querySelector(`#${blockId} .block-indicator`);
        
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            indicator.textContent = '▲';
        } else {
            content.classList.add('hidden');
            indicator.textContent = '▼';
        }
    }

    // Function to open a specific block
    function openBlock(blockNum) {
        // Show the block content
        const content = document.getElementById(`content-${blockNum}`);
        content.classList.remove('hidden');
        
        // Change indicator
        const indicator = document.querySelector(`#block-${blockNum} .block-indicator`);
        indicator.textContent = '▲';
        
        // Scroll to the block
        document.getElementById(`block-${blockNum}`).scrollIntoView({ behavior: 'smooth' });
    }

    // Function to handle option selection
    function selectOption(option) {
        // Deselect other options in the same question
        const question = option.closest('.question');
        const options = question.querySelectorAll('.option');
        
        options.forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select this option
        option.classList.add('selected');
    }

    // Function to check answers for a block
    function checkAnswers(blockNum) {
        const block = document.getElementById(`block-${blockNum}`);
        const questions = block.querySelectorAll('.question');
        let correctCount = 0;
        let totalQuestions = questions.length;
        
        // Check each question
        questions.forEach((question, index) => {
            const selectedOption = question.querySelector('.option.selected');
            
            if (selectedOption) {
                // Get selected answer (A, B, or C)
                const selectedValue = selectedOption.getAttribute('data-value');
                
                // Mark all options accordingly
                const options = question.querySelectorAll('.option');
                options.forEach(option => {
                    const value = option.getAttribute('data-value');
                    option.classList.remove('correct', 'incorrect');
                    
                    if (value === correctAnswers[blockNum][index]) {
                        option.classList.add('correct');
                    } else if (option.classList.contains('selected')) {
                        option.classList.add('incorrect');
                    }
                });
                
                // Count correct answers
                if (selectedValue === correctAnswers[blockNum][index]) {
                    correctCount++;
                }
            }
        });
        
        // Show result
        const resultElement = document.getElementById(`result-${blockNum}`);
        resultElement.textContent = `Результат: ${correctCount} из ${totalQuestions} правильных ответов.`;
        
        if (correctCount === totalQuestions) {
            resultElement.classList.add('success');
            resultElement.classList.remove('error');
            
            // Enable next button
            const nextBtn = document.getElementById(`next-${blockNum}`);
            if (nextBtn) nextBtn.disabled = false;
            
            // Enable finish button if it's the last block
            const finishBtn = document.getElementById('finish-course');
            if (finishBtn && blockNum === 5) finishBtn.disabled = false;
            
            // Mark block as completed
            completedBlocks[blockNum] = true;
            document.getElementById(`badge-${blockNum}`).classList.remove('hidden');
            
            // Update progress
            updateProgress();
        } else {
            resultElement.classList.add('error');
            resultElement.classList.remove('success');
            resultElement.textContent += ' Пожалуйста, проверьте ваши ответы и попробуйте снова.';
        }
    }

    // Update progress bar
    function updateProgress() {
        const totalBlocks = Object.keys(completedBlocks).length;
        const completedCount = Object.values(completedBlocks).filter(Boolean).length;
        const percentage = Math.round((completedCount / totalBlocks) * 100);
        
        document.getElementById('progress-fill').style.width = `${percentage}%`;
        document.getElementById('progress-percent').textContent = `${percentage}%`;
    }

    // Show certificate
    function showCertificate() {
        document.getElementById('course-container').style.display = 'none';
        document.getElementById('certificate').classList.remove('hidden');
        document.getElementById('certificate-date').textContent = new Date().toLocaleDateString('ru-RU');
        
        // You can customize the user name if URL has parameter
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('name');
        if (userName) {
            document.getElementById('user-name').textContent = userName;
        }
    }
});