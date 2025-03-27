/**
 * Основной JavaScript файл для сайта SmAIth Learn
 * Координирует инициализацию всех компонентов
 */

// Инициализация эффекта матрицы для главной страницы
function initMatrix() {
    const matrixBg = document.getElementById('matrix-bg');
    if (!matrixBg) return; // Выходим, если элемент не найден
    
    // Создаем Canvas для матричного эффекта
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    matrixBg.appendChild(canvas);
    
    // Устанавливаем размеры Canvas
    function setCanvasSize() {
        canvas.width = matrixBg.offsetWidth;
        canvas.height = matrixBg.offsetHeight;
    }
    
    // Вызываем при загрузке и изменении размера окна
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Символы для матрицы (цифры, специальные символы и буквы разных алфавитов)
    const chars = '01010101SmAIthSTART{}[]<>/*-+?!&#%$@0101';
    
    // Размер символов и количество колонок
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Инициализируем положение первого символа в каждой колонке
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
    }
    
    // Цвет символов (в зависимости от темы)
    function getColor() {
        return document.body.classList.contains('dark-theme') 
            ? 'rgba(255, 255, 255, 0.07)' 
            : 'rgba(0, 0, 0, 0.03)';
    }
    
    // Функция отрисовки
    function draw() {
        // Очищаем Canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = getColor();
        ctx.font = fontSize + 'px monospace';
        
        // Рисуем символы
        for (let i = 0; i < drops.length; i++) {
            // Выбираем случайный символ
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            // Рисуем символ
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Двигаем символ вниз или сбрасываем в начало, если он достиг конца экрана
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }
    
    // Запускаем анимацию
    setInterval(draw, 60);
    
    // При изменении темы обновляем цвет
    window.addEventListener('themechange', () => {
        ctx.fillStyle = getColor();
    });
}

// Обработка смены темы для матрицы
function handleThemeChange() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        // Создаем кастомное событие смены темы
        const event = new Event('themechange');
        window.dispatchEvent(event);
    });
}

// Обработка активной ссылки в навигации
function highlightCurrentNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath) || 
            (currentPath.endsWith('/') && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Инициализация всех функций при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, загружены ли все необходимые скрипты
    if (window.themeManager) {
        window.themeManager.initTheme();
    }
    
    if (window.animationManager) {
        window.animationManager.initAnimations();
    }
    
    // Инициализируем дополнительные функции
    initMatrix();
    handleThemeChange();
    highlightCurrentNavLink();
    
    console.log('SmAIth Learn site initialized successfully');
});

// Функция для создания и скачивания PDF (заглушка)
document.addEventListener('click', (e) => {
    if (e.target.id === 'download-pdf') {
        e.preventDefault();
        alert('Функция скачивания PDF будет доступна в ближайшее время!');
    }
});