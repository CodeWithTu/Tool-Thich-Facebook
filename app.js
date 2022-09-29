const { Builder, Browser, By } = require('selenium-webdriver');
const prompt = require('prompt');
const { username, password } = require('./account');

(async function main() {
    const startWebUrl = 'https://facebook.com'; // Url test
    const fanpageUrl = 'https://facebook.com/yeah2idoltv'; // Truy cập Fanpage để thả like
    const userNameXPath = '/html/body/div[1]/div[1]/div[1]/div/div/div/div[2]/div/div[1]/form/div[1]/div[1]/input';
    const passwordXPath = '/html/body/div[1]/div[1]/div[1]/div/div/div/div[2]/div/div[1]/form/div[1]/div[2]/div/input';
    const loginButtonXPath = '/html/body/div[1]/div[1]/div[1]/div/div/div/div[2]/div/div[1]/form/div[2]/button';
    const divBoxNumbers = [4, 5];
    const minScroll = 3;
    const maxScroll = 5;
    const likeButtonXPath = (postId = 1, divBoxNumber = divBoxNumbers[0]) => `/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div/div[4]/div[2]/div/div[2]/div[2]/div[${postId}]/div/div/div/div/div/div/div/div/div/div/div[8]/div/div[${divBoxNumber}]/div/div/div[1]/div/div[2]/div/div[1]/div[1]`;
    const printOutId = (postId, divBoxNumbers) => {
        console.log(`Bạn đang dùng postId: ${postId} | divBoxNumber: ${divBoxNumbers}`);
    }
    const soLuongLike = 10; // Số lượng bài viết muốn like
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get(startWebUrl);
    await driver.findElement(By.xpath(userNameXPath)).sendKeys(username);
    await driver.findElement(By.xpath(passwordXPath)).sendKeys(password);
    await driver.findElement(By.xpath(loginButtonXPath)).click();
    prompt.start();
    console.log('Nhập start để bắt đầu');
    prompt.get(['start'], async function ( err, result ) {
        if (err) {
            return onErr(err);
        };
        let postIncrement = 1;
        await driver.get(fanpageUrl); // Truy cập Fanpage
        for (let index = 1; index <= soLuongLike; index += 1) {
            const getRandomArbitrary = (min, max) => {
                return Math.random() * (max - min) + min;
            }
            const getRandomMulWith1000 = parseInt(getRandomArbitrary(minScroll, maxScroll)) * 1000;
            setTimeout( async function (){
                driver.executeScript('window.scrollBy(0, 620)');
                try {
                    await driver.findElement(By.xpath(likeButtonXPath(postIncrement, divBoxNumbers[0]))).click(); // div 4
                    printOutId(postIncrement, divBoxNumbers[0]);
                } catch (err) {
                    await driver.findElement(By.xpath(likeButtonXPath(postIncrement, divBoxNumbers[1]))).click(); // div 5
                    printOutId(postIncrement, divBoxNumbers[1]);
                }
                postIncrement++;
            }, index * getRandomMulWith1000); // 3s hoặc 5s
        }
    });
})();