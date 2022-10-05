import { useAppSelector } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/gameAccount";
import "./css/tracker.css"
import { GameAccount } from "./game-account";
import { Container } from "@mui/material";

function Tracker() {
    const gameAccounts = useAppSelector(state => selectAllAccounts(state))

    const accountComponents = gameAccounts.map((account) => {
        return <GameAccount key={account.id} accountId={account.id}/>
    });

    return (
        <Container maxWidth="xl">
            <div className="account-content-container">
                {accountComponents}
            </div>
        </Container>
    );
}

export default Tracker;
