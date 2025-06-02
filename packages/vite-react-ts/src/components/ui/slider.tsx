import React, { useEffect, useRef, useState } from "react";

interface Mark {
  value: number;
  label: string;
}

interface SliderProps {
  defaultValue?: number;
  min: number;
  max: number;
  value: number;
  onChange: (event: React.ChangeEvent<{}>, value: number) => void;
  marks?: Mark[];
  "aria-valuetext"?: string;
  className?: string;
}

export function Slider({
  defaultValue = 0,
  min,
  max,
  value,
  onChange,
  marks = [],
  "aria-valuetext": ariaValueText,
  className = "",
}: SliderProps) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 同步外部value和内部localValue
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    // 创建一个合成事件对象
    const syntheticEvent = {
      target: { value: newValue },
    } as React.ChangeEvent<{}>;
    onChange(syntheticEvent, newValue);
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newValue = Math.round(min + percentage * (max - min));

    // 确保值在范围内
    const clampedValue = Math.max(min, Math.min(max, newValue));
    handleChange(clampedValue);
  };

  const handleMarkClick = (markValue: number) => {
    handleChange(markValue);
  };

  // 计算滑块位置的百分比
  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer my-4"
        onClick={handleSliderClick}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={localValue}
        aria-valuetext={ariaValueText}
      >
        {/* 已填充的轨道 */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />

        {/* 滑块 */}
        <div
          className="absolute w-4 h-4 bg-blue-500 rounded-full shadow -translate-x-1/2 -translate-y-1/4 top-0"
          style={{ left: `${percentage}%` }}
        />

        {/* 刻度标记 */}
        {marks.map((mark) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={mark.value}
              className="absolute top-6"
              style={{ left: `${markPercentage}%` }}
            >
              <div
                className={`w-1 h-3 -ml-0.5 ${localValue >= mark.value ? "bg-blue-500" : "bg-gray-300"}`}
                onClick={() => handleMarkClick(mark.value)}
              />
              <div className="text-xs text-center -ml-3 mt-1 w-6">
                {mark.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}