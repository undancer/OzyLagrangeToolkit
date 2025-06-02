import { BluePrintTaskBar } from "./blue-print-task-bar";
import { TechIcon } from "./svg/tech";
import { TaskIcon } from "./svg/task-icon";
import { ListItemShip } from "./list-item-ship";
import { ListItemSuperCap } from "./list-item-super-cap";
import {
  combineAircraft,
  ShipTypes,
  UnitDataGroup,
} from "./data/ship-data-types";
import { UNIT_DATA_BASE } from "./data/ship-data";
import { useAcquiredBlueprint, useAppContext } from "../context";
import "./css/individual-blue-print.css";
import React, { useMemo } from "react";

function CardSubHeader(props: { data: UnitDataGroup }): React.JSX.Element {
  const { data } = props;
  const { getBlueprintSettingForSelectedAccount, techPointByShipType } =
    useAcquiredBlueprint();
  const { state } = useAppContext();
  const selectedAccountId = state.selectedAccountId;

  // 使用useMemo缓存计算结果，添加selectedAccountId作为依赖项
  const { displayMode } = useMemo(
    () => getBlueprintSettingForSelectedAccount(),
    [getBlueprintSettingForSelectedAccount, selectedAccountId],
  );
  const { totalTechPoint, totalBluePrint, acquiredBluePrint } = useMemo(
    () => techPointByShipType(data.type),
    [techPointByShipType, data.type, selectedAccountId],
  );

  // 使用useMemo缓存计算结果
  const percent = useMemo(() => {
    // 添加检查，确保totalBluePrint不为0，避免NaN结果
    return totalBluePrint > 0
      ? Math.floor((acquiredBluePrint / totalBluePrint) * 100)
      : 0;
  }, [totalBluePrint, acquiredBluePrint]);

  const displayText = useMemo(() => {
    return displayMode === "percent"
      ? `${percent}%`
      : `${acquiredBluePrint}/${totalBluePrint}`;
  }, [displayMode, percent, acquiredBluePrint, totalBluePrint]);

  const percentReport = useMemo(() => {
    return acquiredBluePrint > 0 ? (
      <div>
        <TaskIcon className="subheader-blueprint-icon svg-fill-tech-icon" />{" "}
        {displayText}
      </div>
    ) : null;
  }, [acquiredBluePrint, displayText]);

  const techReport = useMemo(() => {
    return totalTechPoint > 0 ? (
      <div>
        <TechIcon className="subheader-icon  svg-fill-tech-icon" />{" "}
        {totalTechPoint}
      </div>
    ) : null;
  }, [totalTechPoint]);

  return (
    <div className="subheader-card flex justify-between items-center p-2 bg-gray-800 sticky top-0 z-10">
      <div className="text-lg font-medium">{data.label}</div>
      <div className="subheader-right-div flex items-center space-x-3">
        {percentReport} {techReport}
      </div>
    </div>
  );
}

function ListByShipType(props: { data: UnitDataGroup }): React.JSX.Element {
  const { data } = props;

  // 使用useMemo缓存子组件列表
  const ships = useMemo(() => {
    const shipElements: React.JSX.Element[] = [];

    switch (data.type) {
      case ShipTypes.cruiser:
      case ShipTypes.destroyer:
      case ShipTypes.frigate:
        data.list.forEach((ship, index) => {
          if (index > 0)
            shipElements.push(
              <div
                key={`${ship.id}-div`}
                className="border-t border-gray-600 my-1"
              />,
            );
          shipElements.push(<ListItemShip data={ship} key={ship.id} />);
        });
        break;
      case ShipTypes.corvette:
      case ShipTypes.aircraft:
      case ShipTypes.bomber:
        data.list.forEach((ship, index) => {
          if (index > 0)
            shipElements.push(
              <div
                key={`${ship.id}-div`}
                className="border-t border-gray-600 my-1"
              />,
            );
          shipElements.push(<ListItemShip data={ship} key={ship.id} />);
        });
        break;
      case ShipTypes.battleCruiser:
      case ShipTypes.carrier:
        data.list.forEach((ship, index) => {
          if (index > 0)
            shipElements.push(
              <div
                key={`${ship.id}-div`}
                className="border-t border-gray-600 my-1"
              />,
            );
          shipElements.push(<ListItemSuperCap data={ship} key={ship.id} />);
        });
        break;
      default:
      // Do nothing
    }
    return shipElements;
  }, [data]);

  // 使用useMemo缓存计算结果
  const cardListClass = useMemo(() => {
    return data.type === ShipTypes.battleCruiser ||
      data.type === ShipTypes.carrier
      ? "card-super-cap-list"
      : "card-ship-list";
  }, [data.type]);

  return (
    <div
      className={`${cardListClass} bg-gray-700 rounded-md shadow-md overflow-hidden mb-4`}
    >
      <div className="nav-list">
        <CardSubHeader data={data} />
        <div className="ship-list-container">{ships}</div>
      </div>
    </div>
  );
}

function IndividualBluePrint(): React.JSX.Element {
  const { getReportForSelectedAccount, getBlueprintSettingForSelectedAccount } =
    useAcquiredBlueprint();
  const { state } = useAppContext();
  const selectedAccountId = state.selectedAccountId;

  // 使用useMemo缓存计算结果，添加selectedAccountId作为依赖项
  const { totalBluePrint, totalTechPoint, acquiredBluePrint } = useMemo(
    () => getReportForSelectedAccount(),
    [getReportForSelectedAccount, selectedAccountId],
  );

  const { displayMode } = useMemo(
    () => getBlueprintSettingForSelectedAccount(),
    [getBlueprintSettingForSelectedAccount, selectedAccountId],
  );

  // 使用useMemo缓存计算结果
  const percent = useMemo(() => {
    // 添加检查，确保totalBluePrint不为0，避免NaN结果
    return totalBluePrint > 0
      ? Math.floor((acquiredBluePrint / totalBluePrint) * 100)
      : 0;
  }, [totalBluePrint, acquiredBluePrint]);

  const displayText = useMemo(() => {
    return displayMode === "percent"
      ? `${percent}%`
      : `${acquiredBluePrint}/${totalBluePrint}`;
  }, [displayMode, percent, acquiredBluePrint, totalBluePrint]);

  // 使用useMemo缓存组合的飞行器数据
  const combinedAircraft = useMemo(() => {
    return combineAircraft([UNIT_DATA_BASE.aircrafts, UNIT_DATA_BASE.bombers]);
  }, []);

  return (
    <div className="account-content-container">
      <BluePrintTaskBar />
      <div className="account-title-card bg-gray-700 rounded-md shadow-md p-4 mb-4">
        <h2 className="blue-print-account-tittle text-2xl font-bold flex items-center flex-wrap">
          全蓝图收集:{" "}
          <TaskIcon
            fontSize="large"
            className="svg-fill-tech-icon header-icon mx-2"
          />
          {displayText}
          <span className="mx-4">总科技点:</span>
          <TechIcon
            fontSize="large"
            className="svg-fill-tech-icon header-icon mx-2"
          />
          {totalTechPoint}
        </h2>
      </div>
      <ListByShipType data={UNIT_DATA_BASE.carriers} />
      <ListByShipType data={UNIT_DATA_BASE.battleCruisers} />
      <ListByShipType data={UNIT_DATA_BASE.cruisers} />
      <ListByShipType data={UNIT_DATA_BASE.destroyers} />
      <ListByShipType data={UNIT_DATA_BASE.frigates} />
      <ListByShipType data={UNIT_DATA_BASE.corvettes} />
      <ListByShipType data={combinedAircraft} />
    </div>
  );
}

export default IndividualBluePrint;
