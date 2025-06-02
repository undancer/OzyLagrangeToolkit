import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./css/blue-print-report.css";
import {
  useAppContext,
  useGameAccount,
  useAcquiredBlueprint,
} from "../context";
import React from "react";

function BluePrintReport(): React.JSX.Element {
  const { state } = useAppContext();
  const { getAllAccounts } = useGameAccount();
  const { getBlueprintReportByShipType } = useAcquiredBlueprint();

  const accounts = getAllAccounts();
  const frigates = getBlueprintReportByShipType("frigate");
  console.group(frigates);
  const headers = accounts.map((account) => (
    <TableCell>{account.name}</TableCell>
  ));
  return (
    <Container maxWidth={false} className="container-main-blue-print-report">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {headers}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Something</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default BluePrintReport;
