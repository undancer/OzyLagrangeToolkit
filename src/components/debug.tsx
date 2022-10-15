import "./css/blue-print.css";
import { Container } from "@mui/material";
import ReactJson from "react-json-view";
import { useAppSelector } from "../redux/utils/hooks";

function DevelopmnentDebug() {
    const store = useAppSelector((state) => state);
    const serializedState = localStorage.getItem("state");
    let stateStore = { nothing: "nothing" };
    if (serializedState) stateStore = JSON.parse(serializedState);
    const version = localStorage.getItem("stateVersion");
    return (
        <Container maxWidth="xl">
            <div className="account-content-container">
                <ReactJson src={store} />
                <ReactJson src={stateStore} />
                <div>Version: {version}</div>
            </div>
        </Container>
    );
}

export default DevelopmnentDebug;
