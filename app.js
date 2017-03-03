import fs from 'fs';
import getData from './src/getData';
import minify from 'node-json-minify';

let finalJSON = `./data/data.json`;

(async() => {
    const allData = await getData();

	var tempObj = [];
	var resultJSON = {};
	var existingData = {};
	
	tempObj = Object.keys(allData).filter(function(currentObject) {
	    if (allData[currentObject].text in existingData) {
	        return false;
	    } else {
	        existingData[allData[currentObject].text] = true;
	        resultJSON[currentObject] = allData[currentObject];
	        return true;
	    }
	});

    fs.writeFileSync(finalJSON, minify(JSON.stringify(resultJSON, null, 2)), 'utf8');
    console.log('\n>> Data Retrieved!\n');
})()
