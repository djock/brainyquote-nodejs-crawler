import axios from './utils/aaxios.js';
import cheerio from 'cheerio';

const categories = {
    "world" : [12, 13, 14, 15, 16, 17, 18, 47, 19, 20],
    "history": [25, 28],
    "society": [37, 29, 36, 35, 45, 33, 32, 31, 30, 34, 43, 38],
    "nature": [39, 44, 42, 41, 46]
};

const baseURL = 'http://www.factslides.com';

async function getFacts() {
    const resTarget = await axios.get(baseURL).catch(resTarget => {
        throw resTarget;
    });
    const resTargetData = resTarget.data;
    let targetData = cheerio.load(resTargetData);
    let categoriesLinks = {};

    let resultJSON = {};
    let dataIndex = 0;

    targetData('#slideshows_menu #slideshows_menu_left > div').each(function(i, elem) {
        let link = targetData(this).find('a').attr('href');
        let thisIndex = targetData(this).attr('class').replace('slideshows_menu_', '').replace(' ', '');

        if(thisIndex.length == 2) {
            categoriesLinks[link] = parseInt(thisIndex);
        }
    });
    for (let link in categoriesLinks) {
        // get caategory
        let currentCategory = '';
        let dataSourceArray ='';
        let dataTextArray = '';

        for(let i in categories) {
            if(categoriesLinks[link]) {
                if(categories[i].includes(categoriesLinks[link])) {
                    currentCategory = i;
                }                    
            }
        }

        let categoryURL = baseURL.concat(link);
        const resCategory = await axios.get(categoryURL).catch(function resCategory(error) {
            if (error.response) {
                console.log('error: ', error.response);
                return;
            } else
                throw resCategory;
        });
        if(resCategory.data){
            let resCategoryData = resCategory.data;

            const itemsSourceReg = /(\bitemsSource\b.*)/g;
            const itemsHtmlReg = /(\bitemsHTML\b.*)/g;
            const sourceLinkReg = /(\bhttp\b.+?\,)/g;

            let itemsSourceText = itemsSourceReg.exec(resCategoryData);
            let itemsHTMLText = itemsHtmlReg.exec(resCategoryData);
            
            

            if(itemsHTMLText[0]) {
                let itemsHTMLString = itemsHTMLText[0].toString();

                let itemsHTMLCleanText = itemsHTMLString.replace(/itemsHTML/g, "")
                                            .replace(/= new Array\(/g, "")
                                            .replace(/= new Array\(/g, "")
                                            .replace(/\);/g, "")
                                            .replace(/<span>/g, "")
                                            .replace(/<\/span>/g, "")
                                            .replace(/\\\'/g);
                dataTextArray = itemsHTMLCleanText.split("','");
                dataTextArray.shift();
            }

            if(itemsSourceText[0]) {
                let itemsSourceString = itemsSourceText[0].toString();

                let itemsSourceCleanText = itemsSourceString.replace(/itemsHTML/g, "")
                                            .replace(/= new Array\(/g, "")
                                            .replace(/= new Array\(/g, "")
                                            .replace(/\);/g, "")
                                            .replace(/<span>/g, "")
                                            .replace(/<\/span>/g, "")
                                            .replace(/\\\'/g);
                dataSourceArray = itemsSourceCleanText.split("','");
                dataSourceArray.shift();

            }
            for(let i = 0; i< dataTextArray.length; i++) {
                let text = dataTextArray[i];
                let source = dataSourceArray[i];

                dataIndex++;
                let data = {
                    id: dataIndex,
                    text: text,
                    source: source,
                    category: currentCategory
                };
                console.log(data);
                console.log('----------');
                resultJSON[dataIndex] = data;
        }
            
            let categoryData = cheerio.load(resCategoryData);

            // categoryData('#items ol > div.i').each(function(i, elem) {
            //     let text = targetData(this).find('li').text();
            //     let currentSource;

            //     if(sourceLinksArray) {
            //         currentSource = sourceLinksArray[i] ?  sourceLinksArray[i].replace(/'.*$/g, "") : null;
            //     }

            //     dataIndex++;
            //     let data = {
            //         id: dataIndex,
            //         text: text,
            //         source: currentSource ? currentSource.replace(/',/g, "") : '',
            //         category: currentCategory
            //     };

            //     resultJSON[dataIndex] = data;
            // });
        }
    }
    return resultJSON;
}

export default getFacts;
