import { Card, Typography } from "@mui/material";
import "./css/account-timer-group.css";
import { selectTimerGroup } from "../redux/timer-group";
import { useAppSelector } from "../redux/utils/hooks";
import { TimerAdder } from "./timer-adder";
import { CategoryTypes, SubTimerCategory, TimerCategory } from "./timer-category";
import { TimerType } from "../redux/actions/game-timer";
import { selectAccount } from "../redux/game-account";

export function AccountTimerGroup(props: { accountId: string }): JSX.Element {
    const { accountId } = props;
    const timerGroup = useAppSelector((state) => selectTimerGroup(state, accountId));
    const account = useAppSelector((state) => selectAccount(state, accountId));

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
                        {account.name}
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
