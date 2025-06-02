import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useAppContext } from "../context";

export function AngulumFullRecordTable(): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(22);
  const { state, dispatch } = useAppContext();
  const cities = state.angulumCityData?.cities || [];
  const selectedCityIndex = state.angulumCityData?.selectedIndex || 0;

  function handlePageChange(
    _e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    setPage(newPage);
  }

  function handleRowsPerPageChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }

  function handleSelectCity(index: number) {
    dispatch({
      type: "ANGULUM_CITY_DATA/SELECT_CITY",
      payload: index,
    });
  }

  const minRange = page * rowsPerPage;
  const maxRange = (page + 1) * rowsPerPage;
  const resultRows: React.JSX.Element[] = [];

  cities.forEach((city, index) => {
    if (index >= minRange && index < maxRange) {
      const className =
        index === selectedCityIndex ? "map-city selected-city" : "map-city";
      const time = new Date(city.createdAt);
      const hourMinuteString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const monthDayString = `${time.getMonth() + 1}/${time.getDate()}`;
      const result = (
        <TableRow key={index}>
          <TableCell
            className={className}
            align="center"
            onClick={() => handleSelectCity(index)}
          >
            {index}
          </TableCell>
          <TableCell
            className={className}
            align="center"
            onClick={() => handleSelectCity(index)}
          >
            {city.level}
          </TableCell>
          <TableCell
            className={className}
            onClick={() => handleSelectCity(index)}
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
