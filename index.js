import puppeteer from 'puppeteer';
import 'dotenv/config';

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://m2.paybyphone.com/login');

// Set screen size.
await page.setViewport({width: 1080, height: 524});

await page.waitForSelector('button[id="onetrust-accept-btn-handler"]');
await page.click('button[id="onetrust-accept-btn-handler"]');

await new Promise(res => setTimeout(res, 3000));

await page.waitForSelector('input[value="US"]');
await page.click('input[value="US"]');

await new Promise(res => setTimeout(res, 3000));
await page.waitForSelector('input[value="US"]');
await page.click('input[value="US"]');

await page.waitForSelector('button[data-testid="submit-button"]');
await page.click('button[data-testid="submit-button"]');

await page.waitForSelector('input[id="username"]');
await page.type('input[id="username"]', process.env.PHONE);

await page.waitForSelector('input[id="password"]');
await page.type('input[id="password"]', process.env.PASSWORD);

await page.waitForSelector('button[type="submit"]');
await page.click('button[type="submit"]');

await page.waitForSelector('button[data-testid="park-button"]');
await page.click('button[data-testid="park-button"]');

await page.waitForSelector('input[id="locationNumber"]');
await page.type('input[id="locationNumber"]', process.env.LOCATION_CODE);

await new Promise(res => setTimeout(res, 3000));

await page.waitForSelector('button[type="submit"]');
await page.click('button[type="submit"]');

await page.waitForSelector('button[type="submit"]');
await page.click('button[type="submit"]');

await page.waitForSelector('input[id="duration"]');
await page.type('input[id="duration"]', '12');

await page.waitForSelector('button[type="submit"]');
await page.click('button[type="submit"]');

await page.waitForSelector('button[data-testid="notNow-button"]');
await page.click('button[data-testid="notNow-button"]');

console.log("#########################################")
await page.waitForSelector('[data-testid="totalCharges"]');
const totalCharges = await page.$eval('[data-testid="totalCharges"]', el => el.textContent.trim());
console.log('Total Charges:', totalCharges);

if (totalCharges !== "$15.35") {
    throw new Error("Total Charges is $0.00");
}
// this will send the payment
// await page.waitForSelector('button[data-testid="pay-button"]');
// await page.click('button[data-testid="pay-button"]');

setTimeout(async () => {
    // Close the browser
    await browser.close();
}, 300000);


