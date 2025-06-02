import "./css/debug.css";
import ReactJson from "react-json-view";
import { useAppState } from "../context";
import { Container } from "./ui/container";

function DevelopmnentDebug() {
  const state = useAppState();
  const serializedState = localStorage.getItem("state");
  let stateStore = { nothing: "nothing" };
  if (serializedState) stateStore = JSON.parse(serializedState);
  const version = localStorage.getItem("stateVersion");
  return (
    <Container maxWidth="xl">
      <div className="debug-content-container">
        <ReactJson src={state} />
        <ReactJson src={stateStore} />
        <div>Version: {version}</div>
      </div>
    </Container>
  );
}

export default DevelopmnentDebug;
