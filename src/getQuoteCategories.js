import axios from './utils/aaxios.js';
import cheerio from 'cheerio';

function getNextPage(url, index) {

}

async function getQuoteCategories() {
    const resBrainyQuote = await axios.get('http://www.brainyquote.com/').catch(resBrainyQuote => {
        throw resBrainyQuote;
    });

    let brainyQuoteData = cheerio.load(resBrainyQuote.data);
    let categoriesLinks = [];

    let quotesJSON = {};
    let quoteIndex = 0;

    const baseUrl = 'http://www.brainyquote.com';

    brainyQuoteData('#allTopics .bqLn').each(function(i, elem) {
        let link = brainyQuoteData(this).find('div.bqLn a').attr('href');
        categoriesLinks.push(link);
    });

    categoriesLinks.splice(-1, 1) // hack for More Topics button

    for (let link of categoriesLinks) {
        const currentCategory = link.replace('/quotes/topics/topic_', '').replace('.html', '');
        // This is something I am not proud of :|
        let url = '';
        const dotHtml = '.html';
        link = link.replace('.html', '');
        // End of misery

        // Go through first 9 pages of each category; wrong links redirect to first page
        for (let pageNo = 1; pageNo <= 9; pageNo++) {
            url = baseUrl.concat(link, pageNo, dotHtml);
            console.log(url);
            const resCategory = await axios.get(url).catch(function resCategory(error) {
                if (error.response) {
                    console.log('error: ', error.response);
                    return;
                } else
                    throw resCategory;
            });

            let categoryData = cheerio.load(resCategory.data);

            categoryData('#quotesList .boxyPaddingBig').each(function(i, elem) {
                quoteIndex++;
                let quote = {
                    quote: categoryData(this).find('span.bqQuoteLink a').text(),
                    author: categoryData(this).find('div.bq-aut a').text(),
                    category: currentCategory
                };
                quotesJSON[quoteIndex] = quote;
                console.log('[' + quoteIndex + ']' + ' Quote:\n', quote);
            });
        }
    }
    console.log(quotesJSON);
    return quotesJSON;
}

export default getQuoteCategories;
