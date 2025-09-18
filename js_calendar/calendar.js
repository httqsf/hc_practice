const WEEK_NAME = ["日", "月", "火", "水", "木", "金", "土"];

function main() {
    const args = parseArguments(process.argv);
    const {year, month} = getYearMonth(args);
    printCalendar(year, month);
}

function parseArguments(args) {
    const options = args[2];
    if (options === "-m") {
        const inputMonth = parseInt(args[3]);
        if (inputMonth < 1 || inputMonth > 12) {
            console.error("月の指定は１〜１２の間にしてください。");
            process.exit(1);
        }
        month = inputMonth - 1;
    }else {
        month = new Date().getMonth();
    }
    return month;
}

function getYearMonth(args) {
    const year = new Date().getFullYear();
    const month = args;
    return {year, month};
}


function printCalendar(year, month) {    
    const monthDisplay = month + 1;
    const monthYear = `${monthDisplay}月 ${year}`.padStart(13, " ");
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
        
    let calendar = "";
    
    calendar += "   ".repeat(firstDayOfWeek);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDayOfWeek = (firstDayOfWeek + day - 1) % 7;
        
        if (currentDayOfWeek === 6) {
            calendar += day.toString().padStart(2, " ") + "\n";
        } else {
            calendar += day.toString().padStart(2, " ") + " ";
        }
    }
    
    console.log(monthYear);
    console.log(WEEK_NAME.join(" "));
    console.log(calendar);
}

main();
