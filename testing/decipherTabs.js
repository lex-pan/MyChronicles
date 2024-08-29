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
}

export default tabDecipherMethod;