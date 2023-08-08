import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Paper,
    TableContainer,
    TablePagination,
} from "@mui/material";
import { useAppSelector } from "../redux/utils/hooks";

function AngulumFullRecordTable(props: { selectedCity: number; selectCity: (index: number) => void }): JSX.Element {
    const { selectCity } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(22);
    const cities = useAppSelector((state) => state.angulumCityData.cities);

    function handlePageChange(_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        setPage(newPage);
    }

    function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }

    const minRange = page * rowsPerPage;
    const maxRange = (page + 1) * rowsPerPage;
    const resultRows: JSX.Element[] = [];

    cities.forEach((city, index) => {
        if (index >= minRange && index < maxRange) {
            const className = index === props.selectedCity ? "map-city selected-city" : "map-city";
            const time = new Date(city.createdAt);
            const hourMinuteString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
            const monthDayString = `${time.getMonth() + 1}/${time.getDate()}`;
            const result = (
                <TableRow key={index}>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {index}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => selectCity(index)}>
                        {city.level}
                    </TableCell>
                    <TableCell
                        className={className}
                        onClick={() => selectCity(index)}
                    >{`(${city.pos.x},${city.pos.y})`}</TableCell>
                    <TableCell>{city.submitter}</TableCell>
                    <TableCell>{`${monthDayString} - ${hourMinuteString}`}</TableCell>
                </TableRow>
            );
            resultRows.push(result);
        }
    });

    return (
        <div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>等级</TableCell>
                            <TableCell align="center">城市坐标</TableCell>
                            <TableCell align="center">发现人</TableCell>
                            <TableCell>发现日期</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{resultRows}</TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                count={cities.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[11, 22]}
            />
        </div>
    );
}

export default AngulumFullRecordTable;
