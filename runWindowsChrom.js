const { chromium, webkit, devices } = require('playwright');


(async () => {

    const browser = await chromium.launch({
        headless: false
    });

    const context = await browser.newContext({
        ...devices['Desktop Chrome'],
        viewport: {width: 1366, height: 768},
        platformType: 'desktop'
    })

    context.setDefaultNavigationTimeout(10000)
    context.setDefaultTimeout(1)

    const page = await context.newPage();

    const title = page.locator('header>h1');
    const accessibility = page.locator('[href$="Accessibility1"]');
    // const accessibility = page.locator('.scroller a').getByText('Accessibi', {exact: true});

    await page.goto('https://chromedevtools.github.io/devtools-protocol/');
    await wait(async () => await title.count() > 0);
    console.log(await title.isVisible());
    const responsePromise = page.waitForResponse('https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/');
    await accessibility.click();
    const response = await responsePromise;
    const body = await response.body();
    console.log(body);
    const newBody = body.toString('utf8')
    await pause(3000);
    console.log(page.url());
    await browser.close();
})();



const pause = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(timeout);
        }, timeout);
    })
};

const wait = (callback, options = {}) => {
    const start = Date.now();
    const timeout = options.timeout || 10000;
    const interval = options.interval || 300;
    const waitCallback = async () => {
        let state;
        let error = null;
        try {
            state = await callback();
        } catch (err) {
            error = err;
            state = !!options.errorTrue;
        }
        const delta = Date.now() - start;
        if (state) {
            return true;
        } else if (delta > timeout) {
            if (error) console.log('WARN', error.message);
            if (options.throwError) throw new Error(`Wait fails because of timeout = ${timeout}`);
            console.log('WARN', `Wait fails because of timeout = ${timeout}`);
            return false;
        } else {
            await pause(interval);
            return waitCallback();
        }
    };
    return waitCallback();
};
