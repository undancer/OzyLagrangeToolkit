import React, { useState } from "react";
import {
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import { useTaskTimeStamp, TimerType } from "../context";
import "./css/timer-adder.css";
import { TimerIcon } from "./timer-icon";

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
      <ToggleButton value={timerType} key={timerType}>
        <TimerIcon type={timerType} />
      </ToggleButton>
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
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleTypeChange}
          aria-label="timer type"
          size="small"
        >
          {timerChoiceButtons}
        </ToggleButtonGroup>
      </div>
      <div className="timer-input-container">
        <TextField
          label="Time"
          variant="outlined"
          value={time}
          onChange={setTimeAndValidate}
          onKeyPress={handleKeyPress}
          size="small"
        />
        <IconButton
          onClick={addTimerAndCleanUp}
          color="primary"
          aria-label="add timer"
        >
          <AlarmAddIcon />
        </IconButton>
      </div>
    </div>
  );
}
