import { Container } from "@mui/material";
import { useAppSelector } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/gameAccount";
import "./css/tracker.css";
import { GameAccount } from "./game-account";

function Tracker() {
    const gameAccounts = useAppSelector((state) => selectAllAccounts(state));

    let accountComponents = gameAccounts.map((account) => {
        return <GameAccount key={account.id} accountId={account.id} />;
    });

    if (gameAccounts.length <= 0) accountComponents = [<div>"还没有账号啊，点击右上添加一个吧。"</div>];

    return (
        <Container maxWidth="xl">
            <div className="account-content-container">{accountComponents}</div>
        </Container>
    );
}

export default Tracker;
