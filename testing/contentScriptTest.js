function pageInfo(decipherInstructions, tabURL, tabTitle, expectedTitle, expectedChapter, expectedCategory) {
    website_parse_info = decipherInstructions;
    const website_title = tabTitle;
    let decipherChoice = [];
    for (let i = 0; i < website_parse_info.decipher_method.length; i++) {
        if (website_parse_info.decipher_method[i] == "url") {
            decipherChoice.push(tabURL);
        } else {
            decipherChoice.push(tabTitle);
        }
    }

    let title = extractInstruction(decipherChoice[0], website_parse_info.title_start_end);
    const chapter = extractInstruction(decipherChoice[1], website_parse_info.chapter_start_end);
    const entertainment_category = extractInstruction(decipherChoice[2], website_parse_info.entertainment_category);

    if (decipherChoice[0] == tabURL) {
        title = cleanUpUrlTitle(title);
    }

    console.log([title, chapter, entertainment_category]);

    if (title == expectedTitle &&
        chapter == expectedChapter &&
        entertainment_category == expectedCategory
    ) {
        return true
    } else {
        return false
    }
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

let wuxiaworld = {
    "domain": "wuxiaworld.site",
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
};

let asianc = {
    "domain": "asianc.to",
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
};

let asuraScans =  {
    "domain": "asuracomic.net",
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
};

let lightNovelCave =  {
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
};

let manganato =  {
    "domain": "chapmanganato.to",
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
};

console.log(pageInfo(wuxiaworld, "https://wuxiaworld.site/novel/archean-eon-art-complete-novel/chapter-761/", "Archean Eon Art - Chapter 761 - WuxiaWorld", "Archean Eon Art", 761, "Novel"));
console.log(pageInfo(wuxiaworld, "https://wuxiaworld.site/novel/the-great-genetic-era-wuxia-dao-novel/chapter-1663/", "The Great Genetic Era - Chapter 1663 - Chapter 1663: The True Value of the Blue Star Force (1) - WuxiaWorld" , "The Great Genetic Era", 1663, "Novel"));
console.log(pageInfo(wuxiaworld, "https://wuxiaworld.site/novel/global-lord-100-drop-rate/chapter-1201/", "Global Lord: 100% Drop Rate - Chapter 1201 - 1201 Mythical-Tier—The Only Lord Talent—King Of Undying! - WuxiaWorld", "Global Lord: 100% Drop Rate", 1201, "Novel"));
console.log(pageInfo(wuxiaworld, "https://wuxiaworld.site/novel/warning-providence-the-beauty-is-driven-to-villainy-wuxia-dao-novel/chapter-756/", "Warning : Providence the Beauty is Driven to Villainy - Chapter 756 - Chapter 756: Sir can read people’s minds (15)_1 - WuxiaWorld", "Warning : Providence the Beauty is Driven to Villainy", 756, "Novel"));
console.log(pageInfo(wuxiaworld, "https://wuxiaworld.site/novel/reincarnation-of-the-strongest-sword-god-spp/chapter-3789/", "Reincarnation Of The Strongest Sword God - Chapter 3789 - Chapter 863 - Flame Dragon God's Treasury - WuxiaWorld" , "Reincarnation Of The Strongest Sword God", 3789, "Novel"));


console.log(pageInfo(manganato, "https://chapmanganato.to/manga-td996460/chapter-5.3", "Grimace Vol.1 Chapter 5.3: Cat Scratch - Manganelo" , "Grimace", 5.3, "Graphic Novel"));
console.log(pageInfo(manganato, "https://chapmanganato.to/manga-aa951883/chapter-400", "Tower Of God Chapter 400: [Season 2] Ep.320 - Manganelo" , "Tower Of God", 400, "Graphic Novel"));

console.log(pageInfo(manganato, "https://chapmanganato.to/manga-mq990225/chapter-141", "I Am The Fated Villain Chapter 141 - Manganelo" , "I Am The Fated Villain", 141, "Graphic Novel"));


console.log(pageInfo(lightNovelCave, "https://www.lightnovelcave.com/novel/archean-eon-art-772/chapter-26", "Archean Eon Art - Chapter 26: The Women from Idle Stone Garden | Light Novel Cave" , "Archean Eon Art", 26, "Novel"));
console.log(pageInfo(lightNovelCave, "https://www.lightnovelcave.com/novel/reincarnation-of-the-strongest-sword-god-16/chapter-3796", "Reincarnation Of The Strongest Sword God (Web Novel) - Chapter 3796: Alternate Ending 870 - Primordial Era's Wealth | Light Novel Cave"  , "Reincarnation Of The Strongest Sword God", 3796, "Novel"));
console.log(pageInfo(lightNovelCave, "https://www.lightnovelcave.com/novel/shadow-slave-1365/chapter-1354", "Shadow Slave - Chapter 1354: By Grace of Dusk | Light Novel Cave" , "Shadow Slave", 1354, "Novel"));


console.log(pageInfo(asuraScans, "https://asuracomic.net/8612194254-the-heavenly-demon-cant-live-a-normal-life-chapter-114/", "The Heavenly Demon Cant Live a Normal Life Chapter 114 – Ecorche’s Sword – Asura Scans"  , "The Heavenly Demon Cant Live a Normal Life", 114, "Graphic Novel"));
console.log(pageInfo(asuraScans, "https://asuracomic.net/8612194254-solo-leveling-chapter-198-side-story-19/", "Solo Leveling Chapter 198 – Side Story 19 – Asura Scans"  , "Solo Leveling", 198, "Graphic Novel"));
console.log(pageInfo(asuraScans, "https://asuracomic.net/8612194254-the-regressed-son-of-a-duke-is-an-assassin-chapter-14-reunion/", "The Regressed Son of a Duke is an Assassin chapter 14 – Reunion – Asura Scans" , "The Regressed Son of a Duke is an Assassin", 14, "Graphic Novel"));
console.log(pageInfo(asuraScans, "https://asuracomic.net/1908287720-standard-of-reincarnation-chapter-98/", "98 – [S2 END] – Asura Scans"  , "Standard of Reincarnation", 98, "Graphic Novel"));


console.log(pageInfo(asianc, "https://asianc.to/goblin-special-episode-2.html", "Watch Goblin Special Episode 2 Online With English sub | Dramacool" , "Goblin Special", 2, "Show"));
console.log(pageInfo(asianc, "https://asianc.to/zombie-brother-2024-episode-5.html", "Watch Zombie Brother (2024) Episode 5 Online With English sub | Dramacool"  , "Zombie Brother", 5, "Show"));
console.log(pageInfo(asianc, "https://asianc.to/the-last-cook-2024-episode-10.html", "Watch The Last Cook (2024) Episode 10 Online With English sub | Dramacool" , "The Last Cook", 10, "Show"));

// function pageInfo(decipherInstructions, tabURL, tabTitle, expectedTitle, expectedChapter, expectedCategory) {
