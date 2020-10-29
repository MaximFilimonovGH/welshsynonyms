const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');

//read files from source folder
const sourcePath = path.join(__dirname, process.argv[2]);
console.log(`Reading from path: ${sourcePath}`);
let sourceFiles = fs.readdirSync(sourcePath);
console.log(`Read the following filed from path: ${sourceFiles}`);

//define levels of Welsh expertise
let levels = [
    {
        "level_welsh": "Mynediad",
        "level_english": "Entry"
    },
    {
        "level_welsh": "Sylfaen",
        "level_english": "Foundation"
    },
    {
        "level_welsh": "Canolradd",
        "level_english": "Intermediate"
    },
    {
        "level_welsh": "Uwch",
        "level_english": "Advanced"
    }
]

//cycle through all the levels and process files
for (let lvl = 0; lvl < levels.length; lvl++) {
    parseWordsFile(sourceFiles, sourcePath, levels[lvl].level_welsh, levels[lvl.level_english]);
}

function parseWordsFile(files, sPath, level_welsh, level_english) {
    // find needed files
    let foundFiles = [];
    for (let i = 0; i < files.length; i++) {
        //found the source file, push it to foundFiles list
        if (files[i].includes(level_welsh)) {
            foundFiles.push(files[i]);
        }
    }
    
    //predefine full list of words
    let fullWordList = [];
    //cycle through found files
    for (let i = 0; i < foundFiles.length; i++) {
        //parse xlsx file with parser
        let parsedFile = xlsx.parse(path.join(sPath, foundFiles[i]));
        let data = parsedFile[0].data;
        //generate list of words
        let wordList = generateWordListJson(data, level_welsh, level_english);
        console.log(`Formed a list of ${level_welsh} words with length: ${wordList.length} from file: ${foundFiles[i]}`);
        //push non-duplicated words into full list of words
        for (let j = 0; j < wordList.length; j++) {
            let isListed = false;
            for (let k = 0; k < fullWordList.length; k++) {
                if (fullWordList[k].word == wordList[j].word) {
                    //this word is already in the full list
                    isListed = true;
                    break;
                }
            }
            if (!isListed) {
                //if not in full list push it there
                fullWordList.push(wordList[j]);
            }
        }
    }
    //console log some info about the resulting file
    console.log(`Formed full list of words for ${level_welsh} level with ${fullWordList.length} entries`)

    //write result to file
    let resultPath = path.join(__dirname, process.argv[3], foundFiles[0].substring(0, foundFiles[0].length - 5) + '.json');
    fs.writeFileSync(resultPath, JSON.stringify(fullWordList, null, 2));
}

function generateWordListJson(xlsxData, level_welsh, level_english) {
    let resWordList = [];
    for (let i = 1; i < xlsxData.length; i++) {
        if (xlsxData[i][0]) {
            //form list of units that word is coming from
            let units = [];
            //cycle through all entries of xlsx file rows starting with 2nd (index = 1)
            for (let j = 1; j < xlsxData[i].length; j++) {
                //if that exists
                if (xlsxData[i][j]) {
                    //if that is Uned
                    if (xlsxData[0][j].trim().toLowerCase().includes("uned")) {
                        units.push(xlsxData[0][j].trim().substring(5, xlsxData[0][j].trim().length));
                    }
                    else {
                        units.push(xlsxData[0][j]);
                    }
                }
            }

            //form single word entry for json
            let singleEntry = {
                "word": xlsxData[i][0].trim().toLowerCase(),
                "level_welsh": level_welsh,
                "level_english": level_english,
                "units": units
            }
            //push entry to the list
            resWordList.push(singleEntry);
        }   
    }
    //return list
    return resWordList;
}

