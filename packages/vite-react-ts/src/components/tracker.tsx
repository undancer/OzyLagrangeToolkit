import { Container } from "@mui/material";
import { useGameAccount } from "../context";
import "./css/tracker.css";
import { AccountTimerGroup } from "./account-timer-group";
import NoAccountWarning from "./no-account-warning";
import React from "react";

function Tracker(): React.JSX.Element {
  const { getAllAccounts } = useGameAccount();
  const gameAccounts = getAllAccounts();

  const accountComponents = gameAccounts.map((account) => {
    return <AccountTimerGroup key={account.id} accountId={account.id} />;
  });

  let content = (
    <div className="account-content-container">{accountComponents}</div>
  );
  if (gameAccounts.length <= 0) content = <NoAccountWarning />;

  return <Container maxWidth="xl">{content}</Container>;
}

export default Tracker;
