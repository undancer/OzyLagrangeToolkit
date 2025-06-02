import "./css/blue-print.css";
import { Container } from "@mui/material";
import { useGameAccount } from "../context";
import IndividualBluePrint from "./individual-blue-print";
import NoAccountWarning from "./no-account-warning";
import React from "react";

function BluePrint(): React.JSX.Element {
  const { getAllAccounts } = useGameAccount();
  const gameAccounts = getAllAccounts();

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
