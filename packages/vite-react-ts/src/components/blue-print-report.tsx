import React from "react";
import "./css/blue-print-report.css";
import {
  useAcquiredBlueprint,
  useAppContext,
  useGameAccount,
} from "../context";
import { Container } from "./ui/container";
import { Paper } from "./ui/paper";
import { TableContainer } from "./ui/table-container";

function BluePrintReport(): React.JSX.Element {
  const { state } = useAppContext();
  const { getAllAccounts } = useGameAccount();
  const { getBlueprintReportByShipType } = useAcquiredBlueprint();

  const accounts = getAllAccounts();
  const frigates = getBlueprintReportByShipType("frigate");
  console.group(frigates);
  const headers = accounts.map((account) => (
    <th key={account.id} className="px-4 py-2 border-b">
      {account.name}
    </th>
  ));
  return (
    <Container maxWidth={false} className="container-main-blue-print-report">
      <TableContainer>
        <Paper>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b"></th>
                {headers}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Something</td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </TableContainer>
    </Container>
  );
}

export default BluePrintReport;
