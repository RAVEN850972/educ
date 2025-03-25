// Этот файл содержит функции для интеграции с Telegram Mini App API
// Используйте этот скрипт, если вы добавляете приложение в Telegram бота

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, запущено ли приложение в Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        initTelegramApp();
    }
});

function initTelegramApp() {
    const tg = window.Telegram.WebApp;
    
    // Инициализация приложения
    tg.expand(); // Развернуть на весь экран
    tg.enableClosingConfirmation(); // Запрашивать подтверждение закрытия
    
    // Настраиваем тему
    setTelegramTheme(tg);
    
    // Добавляем кнопку в MainButton для завершения обучения
    document.getElementById('finish-course').addEventListener('click', function() {
        // После показа сертификата также отправляем данные в Telegram Bot
        sendCompletionData(tg);
    });
    
    // Получаем имя пользователя из Telegram, если доступно
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        if (user.first_name) {
            const fullName = user.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user.first_name;
            
            document.getElementById('user-name').textContent = fullName;
        }
    }
}

// Настройка темы в соответствии с темой Telegram
function setTelegramTheme(tg) {
    // Получение цветовой схемы из Telegram
    const colorScheme = tg.colorScheme;
    
    // Настраиваем CSS переменные в зависимости от темы
    if (colorScheme === 'dark') {
        document.documentElement.style.setProperty('--background-color', '#1F2937');
        document.documentElement.style.setProperty('--card-bg', '#374151');
        document.documentElement.style.setProperty('--text-color', '#F9FAFB');
        document.documentElement.style.setProperty('--light-text', '#D1D5DB');
    }
    
    // Используем цвет акцента из Telegram, если доступен
    if (tg.themeParams && tg.themeParams.button_color) {
        document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color);
    }
}

// Отправка данных о завершении курса обратно в бота
function sendCompletionData(tg) {
    // Собираем данные о прохождении
    const completionData = {
        event: 'course_completed',
        course_name: 'TON и SmAIth',
        completion_date: new Date().toISOString(),
        user_telegram_id: tg.initDataUnsafe.user?.id || null
    };
    
    // Отправляем данные обратно в бот
    tg.sendData(JSON.stringify(completionData));
    
    // Показываем кнопку Telegram
    tg.MainButton.setText('Вернуться в бота');
    tg.MainButton.show();
    tg.MainButton.onClick(function() {
        tg.close();
    });
}

// Функция для получения параметров из URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Возможность отслеживать прогресс
function trackProgress(blockNumber, isCompleted) {
    // Если приложение запущено в Telegram, отправляем события аналитики
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Отправляем событие о прохождении блока
        const progressData = {
            event: 'block_completed',
            block_number: blockNumber,
            is_completed: isCompleted
        };
        
        // В реальном приложении здесь может быть вызов аналитики
        console.log('Progress tracked:', progressData);
    }
}