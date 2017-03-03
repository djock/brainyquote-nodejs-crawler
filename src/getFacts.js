import axios from './utils/aaxios.js';
import cheerio from 'cheerio';

const categories = {
    "world" : [12, 13, 14, 15, 16, 17, 18, 47, 19, 20],
    "history": [25, 28],
    "society": [37, 29, 36, 35, 45, 33, 32, 31, 30, 34, 43],
    "nature": [39, 44, 42, 41, 46]
};

const baseURL = 'http://www.factslides.com';

async function getFacts() {
    const resTarget = await axios.get(baseURL).catch(resTarget => {
        throw resTarget;
    });

    let targetData = cheerio.load(resTarget.data);
    let categoriesLinks = [];

    let resultJSON = {};
    let dataIndex = 0;

    targetData('#slideshows_menu #slideshows_menu_left > div').each(function(i, elem) {
        let link = targetData(this).find('a').attr('href');
        categoriesLinks.push(link);
    });

    for (let link of categoriesLinks) {
        let categoryURL = baseURL.concat(link);
        const resCategory = await axios.get(categoryURL).catch(function resCategory(error) {
            if (error.response) {
                console.log('error: ', error.response);
                return;
            } else
                throw resCategory;
        });

        let categoryData = cheerio.load(resCategory.data);

        categoryData('#items ol > div.i').each(function(i, elem) {
            let text = targetData(this).find('li').text();
            let source = targetData(this).find('.factTools #source').attr('title');
            console.log(source);
        //     // dataIndex++;
        //     // let quote = {
        //     //     id: dataIndex,
        //     //     quote: categoryData(this).find('span.bqQuoteLink a').text(),
        //     //     author: categoryData(this).find('div.bq-aut a').text(),
        //     //     category: currentCategory
        //     // };
        //     // resultJSON[dataIndex] = quote;
        //     // console.log('[' + dataIndex + ']' + ' Quote:\n', quote);
        });
    }
    // console.log(resultJSON);
    // return resultJSON;
}

export default getFacts;
