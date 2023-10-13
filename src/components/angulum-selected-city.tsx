import { Table, TableBody, TableHead, TableCell, TableRow, TableContainer, TablePagination } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { Divider } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../redux/utils/hooks";
import { selectSelectedIndex, selectCity } from "../redux/angulum-city-data";

function AngulumSelectedCity(): JSX.Element {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const cities = useAppSelector((state) => state.angulumCityData.cities);
    const selectedIndex = useAppSelector(selectSelectedIndex);
    const dispatch = useAppDispatch();

    const selectedCity = cities[selectedIndex];

    function handlePageChange(_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        setPage(newPage);
    }

    function handleRowsPerPageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

    const filteredRow: JSX.Element[] = [];
    const resultRows: JSX.Element[] = [];

    cities.forEach((city, index) => {
        if (city.pos.x === selectedCity?.pos.x && city.pos.y === selectedCity?.pos.y) {
            const className = index === selectedIndex ? "map-city selected-city" : "map-city";
            const result = (
                <TableRow key={index}>
                    <TableCell className={className} align="center" onClick={() => dispatch(selectCity(index))}>
                        {index}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => dispatch(selectCity(index))}>
                        {city.submitter}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => dispatch(selectCity(index))}>
                        {city.level === 0 ? "X" : city.level.toString()}
                    </TableCell>
                    <TableCell className={className} align="center" onClick={() => dispatch(selectCity(index))}>
                        {moment(city.updatedAt).fromNow()}
                    </TableCell>
                </TableRow>
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
            <Divider />
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
            <Divider />
            <div>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">发现人</TableCell>
                                <TableCell align="center">等级</TableCell>
                                <TableCell align="center">更新日期</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{resultRows}</TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    count={resultRows.length}
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

export default AngulumSelectedCity;
