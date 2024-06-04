const apiLink = 'http://localhost:5172/urls';
console.log("script is being run");
console.log(window.location.href);

(async () => {
    // this gets the url/title and then deciphers it into a list containing title, chapter, and entertainment category
    let tabURL = window.location.href;
    const result = await pageInfo(tabURL);
    console.log(result);

    // send results to storage, so that popup.js can recieve it whenever a user is on a valid tab
    chrome.storage.session.set({
        tabURL: result
    })
})();

async function pageInfo(tabURL) {
    const urlOrigin = getOrigin(tabURL);
    const raw_response = await fetch(`${apiLink}/${urlOrigin}`);
    let website_parse_info = await raw_response.json();
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

   return "url extracted"
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

function getOrigin(tabURL) {
    const start = tabURL.indexOf("//")+2;
    const end = tabURL.indexOf("/", start);
    const origin = tabURL.substring(start, end);
    return origin
}