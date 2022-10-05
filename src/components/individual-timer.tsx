import { useEffect, useState } from "react";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { IconButton, LinearProgress, styled } from "@mui/material";
import { clearTimer, TimerType } from "../redux/actions/gameTimer";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { selectTimer } from "../redux/taskTimeStamp";
import { finishingHourString, timeString } from "./utils/timeToString";
import "./css/individual-timer.css";
import { TimerIcon } from "./timer-icon";

interface IndividualTimerProps {
    id: string;
    accountId: string;
    type: TimerType;
}

const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 15,
    borderRadius: 5,
}));

export function IndividualTimer(props: IndividualTimerProps): JSX.Element {
    const { id, accountId, type } = props;
    const { startTime, duration } = useAppSelector((state) => selectTimer(state, id));
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const dispatch = useAppDispatch();

    // Timer effect
    function tick() {
        setCurrentTime(new Date().getTime());
    }

    const timePassed = currentTime - startTime;
    const completed: boolean = timePassed >= duration;
    useEffect(() => {
        if (!completed) {
            const timerId = setInterval(() => tick(), 500);

            return function cleanup() {
                clearInterval(timerId);
            };
        }

        return function cleanup() {
            // Nothing to clean, Doing this for linting
        };
    });

    let progressBarCol: JSX.Element = <div />;

    if (completed) {
        progressBarCol = (
            <BorderLinearProgress className="progress-bar-extra" variant="determinate" color="success" value={100} />
        );
    } else {
        const val = Math.floor((timePassed / duration) * 100);
        progressBarCol = <BorderLinearProgress className="progress-bar-extra" variant="determinate" value={val} />;
    }

    // On click timer removal function
    function handleRemoveTimer() {
        dispatch(clearTimer(accountId, id));
    }

    const countdown = completed ? (
        <div />
    ) : (
        <div className="countdown-container">
            {timeString(duration, timePassed)}
            <div className="time-string-spacing"></div>
            {finishingHourString(duration, startTime)}
        </div>
    );

    return (
        <div className="timer-container">
            <div className="timer-main-container">
                <div className="timer-front">
                    <TimerIcon type={type} />
                    {progressBarCol}
                </div>
                <div className="timer-back">
                    <IconButton color="info" size="small" onClick={handleRemoveTimer}>
                        <HourglassDisabledIcon />
                    </IconButton>
                </div>
            </div>
            {countdown}
        </div>
    );
}
