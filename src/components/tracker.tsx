import { NavigationBar } from "./navigation-bar";
import { useAppSelector } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/gameAccount";
import "./css/tracker.css"
import { GameAccount } from "./game-account";
import { Container, Paper } from "@mui/material";


function AccountInfos() {
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

function BattleInfos() {
    return (
        <Container maxWidth="xl">
            <div className="operation-content-container">
                <Paper elevation={2}>
                    Top Content
                </Paper>
            </div>
        </Container>
    )
}

function InfiniteLagrangeTracker() {
    return (
        <div>
            <NavigationBar />
            <div className="game-body">
                <BattleInfos />
                <AccountInfos />
            </div>
        </div>
    );
}

export default InfiniteLagrangeTracker;
