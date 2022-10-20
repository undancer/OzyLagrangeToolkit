import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useAppSelector } from "../redux/utils/hooks";
import "./css/blue-print-report.css";
import { frigateByUser } from "../redux/selector/blue-print-report.selector";
import { selectAllAccounts } from "../redux/game-account";

function BluePrintReport(): JSX.Element {
    const frigates = useAppSelector(frigateByUser);
    const accounts = useAppSelector(selectAllAccounts);
    console.group(frigates);
    const headers = accounts.map((account) => <TableCell>{account.name}</TableCell>);
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
