console.log("script is being run");
console.log(window.location.href);

const tabDecipherMethod = {
    "wuxiaworld.site" : {
        "decipher_method": ["title", "title", "title"],
        "title_start_end": [
            ["", 1, 0, " -", 1, 0]
        ],
        "chapter_start_end": [  
            ["Chapter", 1, 8, " -", 1, 0]
        ],
        "entertainment_category": [
            ["Novel", -2, -2, "Novel", -2, -2]
        ]
    },

    "asianc.sh" : {
        "decipher_method": ["title", "title", "title"],
        "title_start_end": [
            ["", 1, 6, " (", 1, 0],
            ["", 1, 6, " Episode", 1, 0]
        ],
        "chapter_start_end": [  
            ["Episode", 1, 8, " Online", 1, 0]
        ],
        "entertainment_category": [
            ["Show", -2, -2, "Show", -2, -2]
        ]
    },

    "asuracomic.net" :  {
        "decipher_method": ["url", "url", "url"],
        "title_start_end": [  
            ["-", 1, 1, "-chapter", 1, 0]
        ],
        "chapter_start_end": [  
            ["chapter-", 1, 8, "", -1, -1],
            ["", 1, 0, "-", 1, 0]
        ],
        "entertainment_category": [
            ["Graphic Novel", -2, -2, "Graphic Novel", -2, -2]
        ]
    },

    "www.lightnovelcave.com" :  {
        "domain": "www.lightnovelcave.com",
        "decipher_method": ["title", "title", "title"],
        "title_start_end": [  
            ["", 1, 0, " - Chapter", 1, 0],
            ["", 1, 0, " (", 1, 0]
        ],
        "chapter_start_end": [  
            ["Chapter ", 1, 8, " |", 1, 0],
            ["", 1, 0, ":",1 , 0]
        ],
        "entertainment_category": [
            ["Novel", -2, -2, "Novel", -2, -2]
        ]
    },

    "chapmanganato.to" :  {
        "decipher_method": ["title", "title", "title"],
        "title_start_end": [  
            ["", 1, 0, " Chapter", 1, 0],
            ["", 1, 0, " Vol", 1, 0]
        ],
        "chapter_start_end": [  
            ["Chapter ", 1, 8, " -", 1, 0],
            ["", 1, 0, ":",1 , 0]
        ],
        "entertainment_category": [
            ["Graphic Novel", -2, -2, "Graphic Novel", -2, -2]
        ]
    }
};

// runs the script everytime the user goes to a valid site
// valid sites are listed in manifest.json
(async () => {
    // this gets the url of the site we're on
    let tabURL = window.location.href;
    // turns url into domain of site ex: https://www.google.com/search/some-parameter into www.google.com 
    let domain = getOrigin(tabURL);
    // retrieves the method using dictionary for O(1) fast access
    let decipher_method = tabDecipherMethod[domain];

    if (decipher_method == undefined) {
        return "decipher method not found"
    }

    // returns the tabUrl, title, chapter, entertainment category
    const result = pageInfo(decipher_method, tabURL);
    console.log(result);

    let UCretrieved = false;
    // save to session storage, check if userChronicles currently exists in sessionStorage, if it is we can access the popup.js immediately with no downtime
    // if it's not we retrieve the UC when we update what the user is reading
    chrome.runtime.sendMessage({ type: "saveDecipheredTabInfo", decipheredTabInfo: result}, (response) => {
        UCretrieved = response;        
    });  

    // send results to db, so users can keep track of what they've read, when and where
    // if a UC is returned save to session storage       
    chrome.runtime.sendMessage(
        {
            type: "sendToDb", 
            tabURL: result[0], 
            title: result[1], 
            chapter: result[2], 
            entertainment_category: result[3], 
            UCretrieved: UCretrieved
        });
})();

function getOrigin(tabURL) {
    const start = tabURL.indexOf("//")+2;
    const end = tabURL.indexOf("/", start);
    const origin = tabURL.substring(start, end);
    return origin
}

function pageInfo(website_parse_info, tabURL) {
    let website_title = document.title;
    let decipherChoice = [];
    console.log(website_parse_info);

    for (let i = 0; i < website_parse_info.decipher_method.length; i++) {
        if (website_parse_info.decipher_method[i] == "url") {
            decipherChoice.push(tabURL);
        } else {
            decipherChoice.push(website_title);
        }
    }

    let title = extractInstruction(decipherChoice[0], website_parse_info.title_start_end);
    const chapter = extractInstruction(decipherChoice[1], website_parse_info.chapter_start_end);
    const entertainment_category = extractInstruction(decipherChoice[2], website_parse_info.entertainment_category);

    if (decipherChoice[0] == tabURL) {
        title = cleanUpUrlTitle(title);
    }

    console.log([title, chapter, entertainment_category]);

   return [tabURL, title, chapter, entertainment_category]
}

function extractInstruction(url, instructions) {
    if (instructions[0][1] == -2 && instructions[0][2] == -2) {
        return instructions[0][0]
    }

    for (let i = 0; i < instructions.length; i++) {
        let word_start = instructions[i][0];
        let repeat_start = instructions[i][1];
        let adjust_start = instructions[i][2];
        let word_end = instructions[i][3];
        let repeat_end = instructions[i][4];
        let adjust_end = instructions[i][5];
        let start_index = 0;
        let end_index = 0;

        if (word_start == "") {
            start_index = 0;
        } else {
            while (repeat_start > 0) {
                start_index = url.indexOf(word_start, start_index+1);
                repeat_start--;
            }
        }

        start_index = start_index + adjust_start;
        
        // get the rest of the string
        if (repeat_end == -1) {
            end_index = url.length;
        } else {
            end_index = start_index;
            while (repeat_end > 0) {
                end_index = url.indexOf(word_end, end_index);
                repeat_end--;
            }            
        }
        
        // if end doesn't exist we don't want to change the current url
        if (end_index > -1) {
            end_index = end_index + adjust_end;
            url = url.substring(start_index, end_index);
        }
    }

    return url
}

function cleanUpUrlTitle(title) {
    console.log(title);
    const nonCapitalizedWords = new Set([
        "a", "an", "and", "as", "at", "but", "by", 
        "for", "if", "in", "nor", "of", "on", "or", 
        "so", "the", "to", "up", "yet", "is"
    ]);

    title = title.split("-");
    title[0] = title[0].charAt(0).toUpperCase() + title[0].slice(1);
    title[title.length-1] = title[title.length-1].charAt(0).toUpperCase() + title[title.length-1].slice(1);

    for (let i = 1; i < title.length-1; i++) {
        if (!nonCapitalizedWords.has(title[i])) {
            title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
        }
    } 

    title = title.join(' ');

    return title
}