import fs from 'fs'
import getQuoteCategories from './src/getQuoteCategories'
import minify from 'node-json-minify'

(async() => {
    const allQuotes = await getQuoteCategories()

	var tempObj = [];
	var quotesJSON = {};
	var seenNames = {};
	
	tempObj = Object.keys(allQuotes).filter(function(currentObject) {
	    if (allQuotes[currentObject].quote in seenNames) {
	        return false;
	    } else {
	        seenNames[allQuotes[currentObject].quote] = true;
	        quotesJSON[currentObject] = allQuotes[currentObject];
	        return true;
	    }
	});

    fs.writeFileSync(`./data/Quotes.json`, minify(JSON.stringify(quotesJSON, null, 2)), 'utf8')
    console.log('\n>> Quotes Categories Retrieved!\n');
})()
