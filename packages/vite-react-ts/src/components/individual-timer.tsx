import React, { useEffect, useState } from "react";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { IconButton, LinearProgress, styled } from "@mui/material";
import { TimerType, useTaskTimeStamp } from "../context";
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

export function IndividualTimer(
  props: IndividualTimerProps,
): React.JSX.Element {
  const { id, accountId, type } = props;
  const { getTaskById, removeTask } = useTaskTimeStamp();
  const task = getTaskById(id);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  if (!task) {
    return <div />; // Task not found
  }

  const startTime =
    new Date(task.endTime).getTime() - (task.duration || 0) * 60 * 1000;
  const duration = (task.duration || 0) * 60 * 1000;

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

  let progressBarCol: React.JSX.Element = <div />;

  if (completed) {
    progressBarCol = (
      <BorderLinearProgress
        className="progress-bar-extra"
        variant="determinate"
        color="success"
        value={100}
      />
    );
  } else {
    const val = Math.floor((timePassed / duration) * 100);
    progressBarCol = (
      <BorderLinearProgress
        className="progress-bar-extra"
        variant="determinate"
        value={val}
      />
    );
  }

  // On click timer removal function
  function handleRemoveTimer() {
    removeTask(id);
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
