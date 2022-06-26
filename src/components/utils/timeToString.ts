const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

function intToTime(input: number): string {
    return input.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
}

export function timeString(duration: number, timePassed: number, startTime: number): string {
    const totalSecondsLeft = Math.trunc((duration - timePassed) / 1000);
    const totalMinLeft = Math.trunc(totalSecondsLeft / 60);
    const totalHourLeft = Math.trunc(totalMinLeft / 60);
    let totalDayLeft = Math.trunc(totalHourLeft / 24);

    const secondsLeft = totalSecondsLeft % 60;
    const minLeft = totalMinLeft % 60;
    let hrLeft = totalHourLeft % 24;

    if (totalDayLeft === 1) {
        hrLeft += 24;
        totalDayLeft = 0;
    }

    let resultString = `${intToTime(hrLeft)}:${intToTime(minLeft)}:${intToTime(secondsLeft)}`;
    if (totalDayLeft > 0) {
        resultString = `${totalDayLeft}d ${hrLeft}h`;
    }

    return resultString;
}

export function finishingHourString(duration: number, startTime: number): string {

    const finishTime = new Date(startTime + duration);
    const now = new Date();

    let finishTimeString = "";
    if (finishTime.getHours() < 13) {
        finishTimeString = `${finishTime.getHours()}:${intToTime(finishTime.getMinutes())} AM`;
    } else {
        finishTimeString = `${finishTime.getHours()%12}:${intToTime(finishTime.getMinutes())} PM`;
    }

    if (finishTime.getDate() - now.getDate() > 1) {
        finishTimeString = `${dayOfWeek[finishTime.getDay()]} ${finishTimeString}`;
    }

    return finishTimeString;
}