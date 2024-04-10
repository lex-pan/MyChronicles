console.log("script is being run");
console.log(window.location.href);

function extractURL(tabURL) {
    const urlOrigin = getOrigin(tabURL);
    /*
    const name = getName(tabURL, urlOrigin);
    const chapter = getChapter(tabURL, urlOrigin);
    */
}

function getOrigin(tabURL) {
    const start = tabURL.indexOf("//")+2;
    const end = tabURL.indexOf("/", start);
    const origin = tabURL.substring(start, end);
    console.log(origin);
    return origin
}

