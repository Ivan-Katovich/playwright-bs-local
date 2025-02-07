const { chromium, webkit, devices } = require('playwright');

(async () => {
    // Конфигурация для подключения к BrowserStack
    const browser = await chromium.launch();

    // Создаем новую страницу в браузере
    const page = await browser.newPage();

    // Переходим на желаемый URL
    await page.goto('https://example.com');

    // Выводим содержимое страницы
    console.log(await page.content());

    // Закрываем браузер
    await browser.close();
})();
