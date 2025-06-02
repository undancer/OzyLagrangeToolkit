import React, { useEffect, useState } from "react";
import { HourglassDisabledIcon } from "./svg/hourglass-disabled-icon";
import { TimerType, useTaskTimeStamp } from "../context";
import { finishingHourString, timeString } from "./utils/timeToString";
import "./css/individual-timer.css";
import { TimerIcon } from "./timer-icon";

interface IndividualTimerProps {
  id: string;
  accountId: string;
  type: TimerType;
}

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
      <div className="h-[15px] rounded-md bg-green-500 w-full" />
    );
  } else {
    const val = Math.floor((timePassed / duration) * 100);
    progressBarCol = (
      <div className="h-[15px] rounded-md bg-gray-200 w-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${val}%` }}
        />
      </div>
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
          <button
            className="p-1 rounded-full text-blue-500 hover:bg-blue-100"
            onClick={handleRemoveTimer}
          >
            <HourglassDisabledIcon className="text-sm" />
          </button>
        </div>
      </div>
      {countdown}
    </div>
  );
}
