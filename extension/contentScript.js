const apiLink = 'http://localhost:5172/urls';
console.log("script is being run");
// console.log(window.location.href);
const fillerTitle = "Mobile War History Gundam Burai Chapter 11.5 - Manganelo"    ; 

let asuraScans =  {
    "domain": "asuracomic.net",
    "decipher_method": ["url", "url", "url"],
    "title_start_end": [  
        ["/", 3, 0, "-chapter", 0, 0],
        ["-", 0 , 1, " ", -1, 0]
    ],
    "chapter_start_end": [  
        ["chapter-", 0, 8, "/", -1, -1],
        ["", 0, 0, "-", 1, 0]
    ],
    "entertainment_category": [
        ["Graphic Novel", -2, -2, "Graphic Novel", -2, -2]
    ]
};


let lightNovelCave =  {
    "domain": "www.lightnovelcave.com",
    "decipher_method": ["title", "title", "title"],
    "title_start_end": [  
        ["", 0, 0, " - Chapter", 0, 0],
        ["", 0 , 0, " (", 0, 0]
    ],
    "chapter_start_end": [  
        ["Chapter ", 0, 8, " |", 0, 0],
        ["", 0, 0, ":", 0 , 0]
    ],
    "entertainment_category": [
        ["Novel", -2, -2, "Novel", -2, -2]
    ]
};

let manganato =  {
    "domain": "chapmanganato.to",
    "decipher_method": ["title", "title", "title"],
    "title_start_end": [  
        ["", 0, 0, " Chapter", 0, 0],
        ["", 0 , 0, " Vol", 0, 0]
    ],
    "chapter_start_end": [  
        ["Chapter ", 0, 8, " -", 0, 0],
        ["", 0, 0, ":", 0 , 0]
    ],
    "entertainment_category": [
        ["Graphic Novel", -2, -2, "Graphic Novel", -2, -2]
    ]
};

(async () => {
    result = await pageInfo("https://asuracomic.net/8612194254-the-regressed-son-of-a-duke-is-an-assassin-chapter-14-reunion/");
    console.log(result);
    //result = await (pageInfo(window.location.href));
    //console.log(result);
})();

async function pageInfo(tabURL) {
    const urlOrigin = getOrigin(tabURL);
    //const raw_response = await fetch(`${apiLink}/${urlOrigin}`);
    //let website_parse_info = await raw_response.json();
    // let website_title = document.title;
    website_parse_info = manganato;
    console.log(website_parse_info);
    const website_title = fillerTitle;

    for (let i = 0; i < website_parse_info.decipher_method.length; i++) {
        if (website_parse_info.decipher_method[i] == "url") {
            website_parse_info.decipher_method[i] = tabURL;
        } else {
            website_parse_info.decipher_method[i] = fillerTitle;
        }
    }

    let title = extractInstruction(website_parse_info.decipher_method[0], website_parse_info.title_start_end);
    const chapter = extractInstruction(website_parse_info.decipher_method[1], website_parse_info.chapter_start_end);
    const entertainment_category = extractInstruction(website_parse_info.decipher_method[2], website_parse_info.entertainment_category);

    if (website_parse_info.decipher_method[0] == tabURL) {
        title = cleanUpUrlTitle(title);
    }

    console.log(title);
    console.log(chapter);
    console.log(entertainment_category);

   return "url extracted"
}

function extractInstruction(url, instructions) {
    if (instructions[0][1] == -2 && instructions[0][2] == -2) {
        return instructions[0][0]
    }

    for (let i = 0; i < instructions.length; i++) {
        let start = url.indexOf(instructions[i][0], instructions[i][1]) + instructions[i][2];
        let end;
        if (instructions[i][4] == -1) {
            end = url.length + instructions[i][5];
        } else {
            end = url.indexOf(instructions[i][3], instructions[i][4]) + instructions[i][5];
        }

        // if end doesn't exist we don't want to change the current url
        if (end > -1) {
            url = url.substring(start, end);
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