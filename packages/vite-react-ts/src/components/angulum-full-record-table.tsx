import React, { useState } from "react";
import { useAppContext } from "../context";
import { Paper } from "./ui/paper";
import { TableContainer } from "./ui/table-container";
import { TablePagination } from "./ui/table-pagination";

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
        <tr key={index}>
          <td
            className={`${className} px-4 py-2 text-center`}
            onClick={() => handleSelectCity(index)}
          >
            {index}
          </td>
          <td
            className={`${className} px-4 py-2 text-center`}
            onClick={() => handleSelectCity(index)}
          >
            {city.level}
          </td>
          <td
            className={`${className} px-4 py-2`}
            onClick={() => handleSelectCity(index)}
          >{`(${city.pos.x},${city.pos.y})`}</td>
          <td className="px-4 py-2">{city.submitter}</td>
          <td className="px-4 py-2">{`${monthDayString} - ${hourMinuteString}`}</td>
        </tr>
      );
      resultRows.push(result);
    }
  });

  return (
    <div>
      <TableContainer>
        <Paper>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  等级
                </th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  城市坐标
                </th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  发现人
                </th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  发现日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultRows}
            </tbody>
          </table>
        </Paper>
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
