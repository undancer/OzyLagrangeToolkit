import "./css/account-timer-group.css";
import { TimerAdder } from "./timer-adder";
import {
  CategoryTypes,
  SubTimerCategory,
  TimerCategory,
} from "./timer-category";
import { TimerType, useGameAccount, useTimerGroup } from "../context";
import React from "react";
import { Card } from "./ui/card";
import { Typography } from "./ui/typography";

export function AccountTimerGroup(props: {
  accountId: string;
}): React.JSX.Element {
  const { accountId } = props;
  const { getTimerGroupByAccountId } = useTimerGroup();
  const { getAccountById } = useGameAccount();
  const timerGroup = getTimerGroupByAccountId(accountId) || {
    accountId,
    construction: [],
    baseUpgrade: [],
    ship: [],
    miner: [],
    capitalShip: [],
    research: [],
    agreement: [],
  };
  const account = getAccountById(accountId);

  const constructionSubrCategory: SubTimerCategory[] = [
    { type: TimerType.baseUpgrade, timerIds: timerGroup.baseUpgrade },
    { type: TimerType.construction, timerIds: timerGroup.construction },
  ];

  const shipyardSubCategory: SubTimerCategory[] = [
    { type: TimerType.ship, timerIds: timerGroup.ship },
    { type: TimerType.miner, timerIds: timerGroup.miner },
    { type: TimerType.capitalship, timerIds: timerGroup.capitalShip },
  ];

  const researchSubCategory: SubTimerCategory[] = [
    { type: TimerType.agreement, timerIds: timerGroup.agreement },
    { type: TimerType.research, timerIds: timerGroup.research },
  ];

  return (
    <Card elevation={2} key={timerGroup.accountId}>
      <div className="game-account">
        <div className="timer-account-title">
          <Typography variant="h5" gutterBottom align="center">
            {account ? account.name : ""}
          </Typography>
        </div>
        <div className="timer-section">
          <TimerCategory
            type={CategoryTypes.construction}
            accountId={accountId}
            subCategories={constructionSubrCategory}
          />
          <TimerCategory
            type={CategoryTypes.shipyard}
            accountId={accountId}
            subCategories={shipyardSubCategory}
          />
          <TimerCategory
            type={CategoryTypes.research}
            accountId={accountId}
            subCategories={researchSubCategory}
          />
        </div>
        <TimerAdder accountId={props.accountId} />
      </div>
    </Card>
  );
}
