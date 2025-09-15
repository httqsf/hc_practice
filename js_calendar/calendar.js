const WEEK_NAME = ["日", "月", "火", "水", "木", "金", "土"];

function main() {
    const options = get_options();
    const {year, month} = get_year_month(options);
    print_calendar(year, month);
}

function get_year_month(options) {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth();
    
    if (options === "-m") {
        const inputMonth = parseInt(process.argv[3]);
        if (inputMonth < 1 || inputMonth > 12) {
            console.error("月の指定は１〜１２の間にしてください。");
            process.exit(1);
        }
        month = inputMonth - 1;
    }
    
    return {year, month};
}

function get_options() {
    return process.argv[2];
}

function print_calendar(year, month) {    
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
