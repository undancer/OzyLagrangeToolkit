import React, { useState } from "react";
import moment from "moment";
// import { Divider } from "@aws-amplify/ui-react";
import { useAppContext } from "../context";
import { TableContainer } from "./ui/table-container";
import { TablePagination } from "./ui/table-pagination";

export function AngulumSelectedCity(): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const { state, dispatch } = useAppContext();
  const cities = state.angulumCityData?.cities || [];
  const selectedIndex = state.angulumCityData?.selectedIndex || 0;

  const selectedCity = cities[selectedIndex];

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

  const minRange = page * rowsPerPage;
  const maxRange = (page + 1) * rowsPerPage;
  let cityLevel = "无";
  let pos = "( 0 . - )";
  let recentChangeTime = "无";
  if (selectedCity !== undefined) {
    cityLevel = selectedCity.level === 0 ? "X" : selectedCity.level.toString();
    pos = `(${selectedCity.pos.x}, ${selectedCity.pos.y})`;
    recentChangeTime = moment(selectedCity.updatedAt).fromNow();
  }

  moment.updateLocale("zh", {
    relativeTime: {
      future: "%s内",
      past: "%s前",
      s: "几秒",
      ss: "%d秒",
      m: "1分钟",
      mm: "%d分钟",
      h: "1小时",
      hh: "%d小时",
      d: "1天",
      dd: "%d天",
      M: "1个月",
      MM: "%d个月",
      y: "1年",
      yy: "%d年",
    },
  });
  moment.locale("zh");

  const filteredRow: React.JSX.Element[] = [];
  const resultRows: React.JSX.Element[] = [];

  cities.forEach((city, index) => {
    if (
      city.pos.x === selectedCity?.pos.x &&
      city.pos.y === selectedCity?.pos.y
    ) {
      const className =
        index === selectedIndex ? "map-city selected-city" : "map-city";
      const result = (
        <tr key={index}>
          <td
            className={`${className} px-4 py-2 text-center`}
            onClick={() =>
              dispatch({
                type: "ANGULUM_CITY_DATA/SELECT_CITY",
                payload: index,
              })
            }
          >
            {index}
          </td>
          <td
            className={`${className} px-4 py-2 text-center`}
            onClick={() =>
              dispatch({
                type: "ANGULUM_CITY_DATA/SELECT_CITY",
                payload: index,
              })
            }
          >
            {city.submitter}
          </td>
          <td
            className={`${className} px-4 py-2 text-center`}
            onClick={() =>
              dispatch({
                type: "ANGULUM_CITY_DATA/SELECT_CITY",
                payload: index,
              })
            }
          >
            {city.level === 0 ? "X" : city.level.toString()}
          </td>
          <td
            className={`${className} px-4 py-2 text-center`}
            onClick={() =>
              dispatch({
                type: "ANGULUM_CITY_DATA/SELECT_CITY",
                payload: index,
              })
            }
          >
            {moment(city.updatedAt).fromNow()}
          </td>
        </tr>
      );
      filteredRow.push(result);
    }
  });

  filteredRow.forEach((city, index) => {
    if (index >= minRange && index < maxRange) resultRows.push(city);
  });

  return (
    <div className="city-detail-container">
      <div className="city-detail-title">城市讯息</div>
      {/*
            <Divider />
            */}
      <div className="city-detail-content">
        <div className="city-detail-info-box">
          <div className="city-detail-data-level">{cityLevel}</div>
          <div className="city-detail-data-label">当前等级</div>
        </div>
        <div className="city-detail-info-box">
          <div className="city-detail-data">{pos}</div>
          <div className="city-detail-data-label">坐标</div>
        </div>
        <div className="city-detail-info-box">
          <div className="city-detail-data">{recentChangeTime}</div>
          <div className="city-detail-data-label">最近更新</div>
        </div>
      </div>
      {/*
            <Divider />
            */}
      <div>
        <TableContainer>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  发现人
                </th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  等级
                </th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  更新日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultRows}
            </tbody>
          </table>
        </TableContainer>
        <TablePagination
          count={filteredRow.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[4, 8]}
        />
      </div>
    </div>
  );
}

// 移除默认导出，只保留命名导出
