import fs from 'fs'
import getQuoteCategories from './src/getQuoteCategories'
import minify from 'node-json-minify'

(async() => {
    const allQuotes = await getQuoteCategories()
    fs.writeFileSync(`./data/Quotes.json`, minify(JSON.stringify(allQuotes, null, 2)), 'utf8')
    console.log('\n>> Quotes Categories Retrieved!\n');
})()
