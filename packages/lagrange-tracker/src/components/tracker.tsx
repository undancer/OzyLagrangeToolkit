import { Container } from "@mui/material";
import { useAppSelector } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/game-account";
import "./css/tracker.css";
import { AccountTimerGroup } from "./account-timer-group";
import NoAccountWarning from "./no-account-warning";

function Tracker() {
    const gameAccounts = useAppSelector((state) => selectAllAccounts(state));

    const accountComponents = gameAccounts.map((account) => {
        return <AccountTimerGroup key={account.id} accountId={account.id} />;
    });

    let content = <div className="account-content-container">{accountComponents}</div>;
    if (gameAccounts.length <= 0) content = <NoAccountWarning />;

    return <Container maxWidth="xl">{content}</Container>;
}

export default Tracker;
