import { TimerType } from "../context";
import { IndividualTimer } from "./individual-timer";
import { TimerIcon } from "./timer-icon";
import { AnchorIcon } from "./svg/anchor-icon";
import "./css/account-section.css";
import React from "react";

export enum CategoryTypes {
  construction = "construction",
  shipyard = "shipyard",
  research = "research",
  battle = "battle",
}

interface SectionProps {
  accountId: string;
  type: CategoryTypes;
  subCategories: SubTimerCategory[];
}

export interface SubTimerCategory {
  type: TimerType;
  timerIds: string[];
}

function findSubCategory(
  list: SubTimerCategory[],
  type: TimerType,
): SubTimerCategory {
  const result = list.find((category) => category.type === type);
  if (result) return result;
  return { type, timerIds: [] };
}

export function TimerCategory(props: SectionProps): React.JSX.Element {
  let title = "";
  const subCategoryIndicater: React.JSX.Element[] = [];

  switch (props.type) {
    case CategoryTypes.construction:
      title = "建造";
      const constructionCategory = findSubCategory(
        props.subCategories,
        TimerType.construction,
      );
      subCategoryIndicater.push(
        <div className="limit-indicater" key={0}>
          <TimerIcon type={TimerType.construction} />{" "}
          {constructionCategory.timerIds.length}/2
        </div>,
      );
      break;
    case CategoryTypes.shipyard:
      title = "造船";
      const shipCategory = findSubCategory(props.subCategories, TimerType.ship);
      const minerCategory = findSubCategory(
        props.subCategories,
        TimerType.miner,
      );
      const capitalShipCategory = findSubCategory(
        props.subCategories,
        TimerType.capitalship,
      );

      subCategoryIndicater.push(
        <div className="limit-indicater" key={0}>
          <AnchorIcon />{" "}
          {shipCategory.timerIds.length + minerCategory.timerIds.length}/3
        </div>,
      );
      subCategoryIndicater.push(
        <div className="limit-indicater" key={1}>
          <TimerIcon type={TimerType.capitalship} />{" "}
          {capitalShipCategory.timerIds.length}/1
        </div>,
      );
      break;
    case CategoryTypes.research:
      title = "研究";
      const researchCategory = findSubCategory(
        props.subCategories,
        TimerType.research,
      );
      subCategoryIndicater.push(
        <div className="limit-indicater" key={0}>
          <TimerIcon type={TimerType.research} />{" "}
          {researchCategory.timerIds.length}/2
        </div>,
      );
      break;
    default:
      break;
  }

  let timerComponents: React.JSX.Element[] = [];

  props.subCategories.forEach((category) => {
    const categoryTimer = category.timerIds.map((timerId) => {
      return (
        <IndividualTimer
          key={timerId}
          id={timerId}
          accountId={props.accountId}
          type={category.type}
        />
      );
    });
    timerComponents = timerComponents.concat(categoryTimer);
  });

  return (
    <div>
      <div className="section-header">
        <div className="section-title">{title}</div>
        {subCategoryIndicater}
      </div>

      {timerComponents}
    </div>
  );
}
