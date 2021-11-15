const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

describe('Tests', async function () {
    this.timeout(5000);

    let page, browser;

    before(async () => {
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('Testing: load messages', async () => {
        await page.goto('http://localhost:5500');
        await page.click('text=Refresh');

        await page.waitForSelector('#messages');

        const rows = await page.$eval('#messages', textarea => textarea.value);
        expect(rows.split('\n')[0]).to.equal('Spami: Hello, are you there?');
    });

    it('Testing: send message', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('input#author', 'Gosho');
        await page.fill('input#content', 'Message');

        const [request] = await Promise.all([
            page.waitForRequest((request) => request.method() == 'POST'),
            await page.click('input#submit >> text=Send')
        ])

        const data = JSON.parse(request.postData());
        expect(data.author).to.equal('Gosho');
        expect(data.content).to.equal('Message');
    });
});
