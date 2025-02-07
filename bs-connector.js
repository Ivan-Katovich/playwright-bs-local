const browserstack = require('browserstack');

const USERNAME = 'YOUR_USER';
const ACCESS_KEY = 'YOUR_KEY';

const capabilities = {
    'browserName': 'Chrome',
    'browser_version': 'latest',
    'os': 'Windows',
    'os_version': '10',
    'resolution': '1024x768',
    'name': 'Session Example on BrowserStack'
};

const client = browserstack.createClient({
    username: USERNAME,
    password: ACCESS_KEY
});

client.createSession(capabilities, (error, session) => {
    if (error) {
        console.error('Error creating session:', error);
        return;
    }

    console.log('Session successfully created. Session ID:', session.sessionId);

    // Получаем и выводим дополнительные сведения о сессии
    client.getSession(session.sessionId, (error, sessionInfo) => {
        if (error) {
            console.error('Error getting session info:', error);
        } else {
            console.log('Session Info:', sessionInfo);
            // Примечание: sessionInfo.automation_session.browser_url предоставляет URL для доступа к сессии через веб-интерфейс
            console.log('Web browser URL:', sessionInfo.automation_session.browser_url);
        }

        // Завершаем сессию
        client.deleteSession(session.sessionId, (error) => {
            if (error) {
                console.error('Error closing session:', error);
            } else {
                console.log('Session closed successfully');
            }
        });
    });
});
