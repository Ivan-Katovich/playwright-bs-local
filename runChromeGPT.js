const { chromium } = require('playwright');

(async () => {
    // Конфигурация для подключения к BrowserStack
    const browser = await chromium.connect({
        timeout: 30000,
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
            'device': 'Samsung Galaxy Tab S9', // Указание конкретного устройства
            'real_mobile': 'true', // Указание, что это реальное мобильное устройство
            'os_version': '11.0', // Укажите версию операционной системы, если изменилась
            'browser': 'chrome', // Chrome - браузер на устройстве
            'name': 'Playwright Test on Real Device',
            'build': 'playwright-build-1',
            'browserstack.username': 'ivankotovich_pXAs52',
            'browserstack.accessKey': 'awuYpJYgDcpfc2PuQ7Rq'
        },))}`,
        logger: {
            isEnabled: (name, severity) => true,
            log: (name, severity, message, args) => console.log(`${name} ${severity} ${message}`, ...args)
        }
    });

    // Создаем новую страницу в браузере
    const page = await browser.newPage();

    // Переходим на желаемый URL
    await page.goto('https://example.com');

    // Выводим содержимое страницы
    console.log(await page.content());

    // Закрываем браузер
    await browser.close();
})();
