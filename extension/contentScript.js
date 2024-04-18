const apiLink = 'http://localhost:3000/url';
console.log("script is being run");
console.log(window.location.href);
// filler url: https://chapmanganato.to/manga-om991395/chapter-133

(async () => {
    result = await (pageInfo(window.location.href));
    console.log(result);
})();


async function pageInfo(tabURL) {
    const urlOrigin = getOrigin(tabURL);
    const raw_response = await fetch(`${apiLink}/${urlOrigin}`);

    let website_parse_info = await raw_response.json();
    website_parse_info = website_parse_info[0];
    console.log(website_parse_info);

    if (website_parse_info.title_start_end == null && website_parse_info.chapter_start_end == null) {
        const dom_info = document.getElementsByTagName(website_parse_info.dom_name_selector)[0];
        console.log(dom_info);
        console.log("no url title or chapter");
    } else if (website_parse_info.title_start_end == null && website_parse_info.chapter_start_end != null) {

    } else {

    }
    /*
    const name = getName(tabURL, urlOrigin);
    const chapter = getChapter(tabURL, urlOrigin);
    */
   return "url extracted"
}

function getOrigin(tabURL) {
    const start = tabURL.indexOf("//")+2;
    const end = tabURL.indexOf("/", start);
    const origin = tabURL.substring(start, end);
    return origin
}

