import { Card, Typography } from "@mui/material";
import "./css/game-account.css";
import { selectAccount } from "../redux/gameAccount";
import { useAppSelector } from "../redux/utils/hooks";
import { TimerAdder } from "./timer-adder";
import { CategoryTypes, SubTimerCategory, TimerCategory } from "./account-section";
import { TimerType } from "../redux/actions/gameTimer";

interface GameAccountProps {
    accountId: string;
}

export function GameAccount(props: GameAccountProps): JSX.Element {
    const { accountId } = props;
    const account = useAppSelector((state) => selectAccount(state, accountId));

    const constructionSubrCategory: SubTimerCategory[] = [
        { type: TimerType.baseUpgrade, timerIds: account.baseUpgrade },
        { type: TimerType.construction, timerIds: account.construction },
    ];

    const shipyardSubCategory: SubTimerCategory[] = [
        { type: TimerType.ship, timerIds: account.ship },
        { type: TimerType.miner, timerIds: account.miner },
        { type: TimerType.capitalship, timerIds: account.capitalShip },
    ];

    const researchSubCategory: SubTimerCategory[] = [
        { type: TimerType.agreement, timerIds: account.agreement },
        { type: TimerType.research, timerIds: account.research },
    ];

    return (
        <Card elevation={2} key={account.id}>
            <div className="game-account">
                <div className="account-title">
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
