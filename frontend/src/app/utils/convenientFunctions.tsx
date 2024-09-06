import React from "react";

// converts ISO8601 to something like Feb 10, 2004
export default function convertDatetoReadble(dateString: string) {
    if (dateString == null || dateString== "") {
        return null
    }

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    let formatted_date = date.toLocaleDateString('en-US', options)
    formatted_date = shortenMonthInDate(formatted_date);
    if (date.getFullYear() == 1) {
        return ""
    }

    return formatted_date;
}

// Function to shorten month names in a date string
function shortenMonthInDate(dateString: string): string {
    const [month, day, year] = dateString.split(' ');
    // Shorten month name if it's longer than 3 characters
    const shortenedMonth = shortenMonth(month);
    // Reassemble the date string
    return `${shortenedMonth} ${day} ${year}`;
}

function shortenMonth(month: string) {
    // A mapping of long month names to short names
    const monthMap: { [key: string]: string } = {
        January: 'Jan',
        February: 'Feb',
        March: 'Mar',
        April: 'Apr',
        May: 'May',
        June: 'Jun',
        July: 'Jul',
        August: 'Aug',
        September: 'Sep',
        October: 'Oct',
        November: 'Nov',
        December: 'Dec'
    };
    
    return monthMap[month] || month;
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

export function autoScalingTextArea(e: React.ChangeEvent<any>) {
    e.target.style.height = 'auto'; // Reset height to auto to calculate new scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
}