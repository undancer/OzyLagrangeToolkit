import "./css/blue-print.css";
import { Container } from "@mui/material";
import { useAppSelector } from "../redux/utils/hooks";
import { selectAllAccounts } from "../redux/game-account";
import IndividualBluePrint from "./individual-blue-print";
import NoAccountWarning from "./no-account-warning";

function BluePrint(): JSX.Element {
    const gameAccounts = useAppSelector(selectAllAccounts);

    let content = <IndividualBluePrint />;
    if (gameAccounts.length <= 0) {
        content = <NoAccountWarning />;
    }

    return (
        <Container maxWidth={false} className="container-main-blue-print">
            {content}
        </Container>
    );
}

export default BluePrint;
