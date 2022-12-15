import fs from "fs";
const xlsx = require("xlsx");

const generateString = (
	length: number,
	useAlphabeticCharacters: boolean = true,
	useNumericCharacters: boolean = true
) => {
	var result = '';
	var characters = '';
	if (useAlphabeticCharacters) {
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	if (useNumericCharacters) {
		characters = characters + '0123456789';
	}
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result + "-" + Date.now();
};

const isEqual = (one, two) =>{
	if(one == two){
		return true
	}
	return false
}

const xslxToJson = (file) =>{
    let itemsSheet = xlsx.readFile(file);
    let data = [];
    const items = itemsSheet.SheetNames;
    for (let i = 0; i < items.length; i++) {
      const arr = xlsx.utils.sheet_to_json(itemsSheet.Sheets[items[i]]);
      arr.forEach((res) => {
        data.push(res);
      });
    }

    // delete file
    fs.unlinkSync(`${file}`);
	return data
}



export {generateString, isEqual, xslxToJson}