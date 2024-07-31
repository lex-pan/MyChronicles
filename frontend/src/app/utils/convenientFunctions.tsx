// converts ISO8601 to something like Feb 10, 2004
export default function convertDatetoReadble(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// what is debounce?
// sends a request only after a certain time has passed
// if other requests are sent at the same time, restart the countdown
// this way we only need to ever send one response

// how this function works
// returns a function
// ...args is what is passed to the function we want to call after user finishes typing check processSearch for what inputs we give
// timer is an id and clearTimeout will get rid of timer if a new one is invoked
// the function knows about the previous timer because closures allow the returned function to still have access to the timer in debounce
export function debounce(func : (...args: any[]) => any, timeout = 700){
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func(...args); }, timeout);
    };
}

// by setting processSearch to debounce(), everytime processSearch is shown it'd call debounce()
// in the onkeyup, because we use processSearch() the return function will be called because 
// it'd be equivalent to debounce()(). where debounce() is the result and we call the function of the result debounce()()
// const processSearch = debounce((e) => saveInput(e));