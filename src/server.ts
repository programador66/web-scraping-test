import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    // Usage
    const url = 'https://br.openfoodfacts.org/';
    scrapeDynamic(url)
        .then((data) => {
            if (data) {
                console.log('Scraped dynamic content:', data);
            } else {
                console.log('Dynamic element not found on the page.');
            }
        })
        .catch((error) => {
            console.error('Error scraping the page:', error);
        });
        return res.send('Hello jhones')
    }
);

async function scrapeDynamic(url: string): Promise<string | null> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto(url);
        await page.waitForSelector('#products_match_all li');
        const products = await page.evaluate(() => {
            const items:any = [];

            document.querySelectorAll('#products_match_all li').forEach((li:any) => {
              const title = li.querySelector('a.list_product_a').title;
              const link = li.querySelector('a.list_product_a').href;
              const imgSrc = li.querySelector('.list_product_img').title;
              const nutriScoreImg = li.querySelector('.list_product_icons[title^="Nutri-Score"]').title;
              const novaGroupImg = li.querySelector('.list_product_icons[title^="NOVA"]').title;
              const ecoScoreImg = li.querySelector('.list_product_icons[title^="Eco-Score"]').title;
        
              items.push({ title, link, imgSrc, nutriScoreImg, novaGroupImg, ecoScoreImg });
            });
            return items;
          });
        return products;
    } catch (error) {
        console.error('Error scraping dynamic content:', error);
        return null;
    } finally {
        await browser.close();
    }
}

app.listen(3333,() => {
    console.log('Servidor iniciado na porta 3333')
});