import React, { useState } from "react";
import { TimerType, useTaskTimeStamp } from "../context";
import "./css/timer-adder.css";
import { TimerIcon } from "./timer-icon";
import { AlarmAddIcon } from "./svg/alarm-add";

interface timerAdder {
  accountId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TimerAdder(props: timerAdder): React.JSX.Element {
  const [time, setTime] = useState("");
  const [type, setType] = useState(TimerType.construction);

  const timerTypes: TimerType[] = [
    TimerType.construction,
    TimerType.baseUpgrade,
    TimerType.ship,
    TimerType.miner,
    TimerType.capitalship,
    TimerType.research,
    TimerType.agreement,
  ];

  const timerChoiceButtons = timerTypes.map((timerType) => {
    return (
      <button
        key={timerType}
        className={`p-2 rounded border ${type === timerType ? "bg-gray-700 border-blue-500" : "bg-gray-800 border-gray-600 hover:bg-gray-700"}`}
        onClick={(e) => handleTypeChange(e, timerType)}
      >
        <TimerIcon type={timerType} />
      </button>
    );
  });

  const { addTaskTimeStamp } = useTaskTimeStamp();

  function addTimerAndCleanUp() {
    if (time.length < 1) return; // Ignore enter for empty string.
    let day = 0;
    let min = 0;
    let hr = 0;
    const timeArray = time.split(/[d:]/);

    if (timeArray.length >= 3)
      day = parseInt(timeArray[timeArray.length - 3], 10);
    if (timeArray.length >= 2)
      hr = parseInt(timeArray[timeArray.length - 2], 10);
    min = parseInt(timeArray[timeArray.length - 1], 10);

    const totalMinutes = day * 24 * 60 + hr * 60 + min;
    const durationMs = totalMinutes * 60 * 1000;
    const startTime = Date.now();

    addTaskTimeStamp(crypto.randomUUID(), durationMs, startTime);
    setTime("");
  }

  function handleTypeChange(
    event: React.MouseEvent<HTMLElement>,
    timerType: TimerType,
  ) {
    setType(timerType);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      addTimerAndCleanUp();
    }
  }

  function setTimeAndValidate(event: React.ChangeEvent<HTMLInputElement>) {
    const timeString = event.target.value
      .replaceAll(":", "")
      .replaceAll("d", "");

    // Process string that contains integer only
    if (
      (!/^\d+$/.test(timeString) || timeString.length > 6) &&
      timeString !== ""
    ) {
      setTime(time);
      return;
    }

    let resultString = timeString;
    if (resultString.length > 4) {
      const dayPos = timeString.length - 4;
      const hrPos = timeString.length - 2;
      resultString = [
        timeString.slice(0, dayPos),
        "d",
        timeString.slice(dayPos, hrPos),
        ":",
        timeString.slice(hrPos),
      ].join("");
    }
    if (resultString.length > 2 && resultString.length <= 4) {
      const pos = timeString.length - 2;
      resultString = [
        timeString.slice(0, pos),
        ":",
        timeString.slice(pos),
      ].join("");
    }
    setTime(resultString);
  }

  return (
    <div className="timer-adder">
      <div className="icon-choice-container">
        <div className="flex space-x-1" role="group" aria-label="timer type">
          {timerChoiceButtons}
        </div>
      </div>
      <div className="timer-input-container flex items-center space-x-2">
        <div className="relative">
          <input
            type="text"
            className="input px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={time}
            onChange={setTimeAndValidate}
            onKeyPress={handleKeyPress}
            placeholder="Time"
            aria-label="Time"
          />
          <label className="absolute -top-2 left-2 px-1 text-xs bg-gray-700 text-gray-300">
            Time
          </label>
        </div>
        <button
          onClick={addTimerAndCleanUp}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="add timer"
        >
          <AlarmAddIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
