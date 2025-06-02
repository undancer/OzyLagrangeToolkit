import "./css/blue-print.css";
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
    <div className="container w-full max-w-none p-4 container-main-blue-print">
      {content}
    </div>
  );
}

export default BluePrint;
