process.env.BROWSERSTACK_USERNAME = 'ivankotovich_pXAs52';
process.env.BROWSERSTACK_ACCESS_KEY = 'awuYpJYgDcpfc2PuQ7Rq';

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

const userName = 'ivankotovich_pXAs52';
const accessKey = 'awuYpJYgDcpfc2PuQ7Rq';

const { chromium, webkit, devices } = require('playwright');
const browserstack = require('browserstack-local');

const caps = {
    browser: 'chrome',
    browser_version: 'latest',
    os: 'WINDOWS',
    os_version: '10',
    realMobile: 'true',
    resolution: '1920x1080',
    'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'ivankotovich_pXAs52',
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'awuYpJYgDcpfc2PuQ7Rq',
    'browserstack.geoLocation': 'FR',
    project: 'My First Project',
    build: 'playwright-build-1',
    name: 'My first playwright test',
    buildTag: 'reg',
    'browserstack.local': 'true',
    'browserstack.localIdentifier': 'local_connection_name',
    'browserstack.playwrightVersion': '1.latest',
    'client.playwrightVersion': '1.latest',
    'browserstack.debug': 'true',  // enabling visual logs
    'browserstack.console': 'info',  // Enabling Console logs for the test
    'browserstack.networkLogs': 'true',  // Enabling network logs for the test
    'browserstack.interactiveDebugging': 'true',
};

(async () => {

    // const browser = await chromium.launch({
    //     headless: false
    // });

    // const iPhone = devices['Galaxy S8'];
    //
    // const browser = await webkit.launch({headless: false});
    // const context = await browser.newContext({
    //     ...iPhone
    // });

    // it works
    // console.log(`wss://${userName}:${accessKey}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`);
    // const browser = await chromium.connect({
    //     wsEndpoint: `wss://${userName}:${accessKey}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`
    // });

    // it works too with 'browserstack.username' and 'browserstack.accessKey'
    console.log(`wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`);
    const browser = await chromium.connect({
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`
    });

    // Try to connect existing session
    // const browser = await chromium.connect({
    //     wsEndpoint: `wss://ivankotovich_pXAs52:awuYpJYgDcpfc2PuQ7Rq@cdp.browserstack.com/session/033228fcfde6b2a5ba55ac5ad7f269ce613ca4e4/se/cdp`
    // });

    const bs_local = new browserstack.Local();
    var bs_local_args = { 'key': 'awuYpJYgDcpfc2PuQ7Rq', forceLocal: true };
    bs_local.start(bs_local_args, () => console.log('started'));
    await wait(async () => bs_local.isRunning(), {timeout: 30000});

    const context = await browser.newContext({
        ...devices['Desktop Chrome'],
        viewport: {width: 1600, height: 900}
    });
    context.setDefaultTimeout(5000)
    const page = await context.newPage();

    const title = page.locator('header>h1');
    const accessibility = page.locator('[href$="Accessibility"]');

    await page.goto('https://chromedevtools.github.io/devtools-protocol/');
    await wait(async () => await title.count() > 0);
    console.log(await title.isVisible());
    await pause(20000);
    const responsePromise = page.waitForResponse('https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/');
    await accessibility.click();
    const response = await responsePromise;
    const body = await response.body();
    const newBody = body.toString('utf8')
    console.log(page.url());
    await browser.close();
    bs_local.stop(() => console.log('stopped'));
})();


