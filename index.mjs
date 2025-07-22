import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3 = new S3Client({ region: 'us-west-2' });

export async function handler(event) {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--single-process',
                '--disable-dev-shm-usage',
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: true,
        });
     const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await page.goto('https://m2.paybyphone.com/login');

        page.on('requestfailed', request => {
            console.error(`❌ Request failed: ${request.url()} - ${request.failure()?.errorText}`);
        });

        await page.waitForSelector('button[id="onetrust-accept-btn-handler"]');
        await page.click('button[id="onetrust-accept-btn-handler"]');
        console.log("A");

        await new Promise(res => setTimeout(res, 3000));
        await page.waitForSelector('input[value="US"]');
        await page.click('input[value="US"]');

        await page.waitForSelector('button[data-testid="submit-button"]');
        await page.click('button[data-testid="submit-button"]');
        console.log("B");

        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('input[id="username"]');
        await page.type('input[id="username"]', process.env.PHONE);
        await page.waitForSelector('input[id="password"]');
        await page.type('input[id="password"]', process.env.PASSWORD);
        console.log("C");

        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');
        console.log("E fart");

        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('button[data-testid="park-button"]');
        await page.click('button[data-testid="park-button"]');

        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('input[id="locationNumber"]');
        await page.type('input[id="locationNumber"]', process.env.LOCATION_CODE);
        await page.waitForSelector('button[data-testid="locationSubmit-button"]');
        await page.click('button[data-testid="locationSubmit-button"]');
        console.log("F");

        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');

        console.log("G");
        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('input[id="duration"]');
        await page.type('input[id="duration"]', "12")
        await page.click('div[data-testid="timeUnit-button"]');
        await page.click('li[data-value="hours"]');
        console.log("H");

        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');

        console.log("I");

        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('button[data-testid="notNow-button"]');
        await page.click('button[data-testid="notNow-button"]');

        console.log("J");

        // read some text from the page
        const confirmationText = await page.$eval('h4[data-testid="totalCharges"]', el => el.textContent);
        console.log("Confirmation Text:", confirmationText);

        console.log("K");

        await new Promise(res => setTimeout(res, 3000));

        await page.waitForSelector('button[data-testid="pay-button"]');
        await page.click('button[data-testid="pay-button"]');
        console.log("L");

        await new Promise(res => setTimeout(res, 3000));
        const screenshotBuffer = await page.screenshot();

        const s3Key = `screenshots/${uuidv4()}.png`;
        const putCommand = new PutObjectCommand({
            Bucket: 'parking-bot-3',
            Key: s3Key,
            Body: screenshotBuffer,
            ContentType: 'image/png',
        });


        await new Promise(res => setTimeout(res, 3000));


        await s3.send(putCommand);

        return;

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

