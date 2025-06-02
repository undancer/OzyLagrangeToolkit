import React from "react";
import { AddIcon } from "./svg/add-icon";
import { RemoveIcon } from "./svg/remove-icon";
import { DeleteOutlineIcon } from "./svg/delete-outline-icon";
import { MilitaryTechIcon } from "./svg/military-tech-icon";
import { ScienceIcon } from "./svg/science-icon";
import { lookUpShipById } from "./data/ship-data";
import { isShipData, isSuperCap } from "./data/ship-data-types";
import { Fleet, FleetType, ShipInFleet, useAppContext } from "../context";

export interface techPointDisplayData {
  text: string;
  type: "tech-normal" | "tech-gold" | "tech-max";
}

export function FleetPlanShipTable(props: {
  fleet: Fleet;
  fleetIndex: number;
  type: "main" | "reinforce";
}): React.JSX.Element {
  const { fleet, fleetIndex, type } = props;
  const { state } = useAppContext();
  const { selectedAccountId } = state;
  const showControl =
    state.fleetPlanner[selectedAccountId ? selectedAccountId : ""]
      .displayControl;

  const selectedFleet = type === "main" ? fleet.mainFleet : fleet.reinforcement;
  const fleetType = type === "main" ? FleetType.main : FleetType.reinforcement;

  const rows = selectedFleet.map((ship, index) => {
    if (showControl) {
      return (
        <EditShipRow
          ship={ship}
          fleetIndex={fleetIndex}
          shipIndex={index}
          type={fleetType}
          key={index}
        />
      );
    }
    return (
      <DisplayShipRow
        ship={ship}
        fleetIndex={fleetIndex}
        shipIndex={index}
        type={fleetType}
        key={index}
      />
    );
  });

  const title = type === "main" ? "主力部队" : "增援部队";

  return (
    <table className="w-[545px] text-sm">
      <ShipTableHeader
        titles={[title, showControl ? "人口" : "", "数量", "总人口"]}
      />
      <tbody>
        {rows}
        <ShipTableFooter fleetIndex={fleetIndex} type={type} />
      </tbody>
    </table>
  );
}

function DisplayShipRow(props: {
  ship: ShipInFleet;
  fleetIndex: number;
  shipIndex: number;
  type: FleetType;
}): React.JSX.Element {
  const { ship, fleetIndex, shipIndex, type } = props;
  const { shipId, count, variant, leveled, adjusted } = ship;
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccount.id;
  const fleetPlannerState = state.fleetPlanner[accountId];
  const techPointLookupTable = {}; // TODO: Implement tech point lookup from context

  const shipData = lookUpShipById(shipId);

  if (!shipData) return <></>;

  const { name } = shipData;
  let totalPopulation = 0;
  if (isShipData(shipData)) {
    totalPopulation = shipData.pop[variant] * count;
  } else if (isSuperCap(shipData)) {
    totalPopulation = shipData.pop * count;
  }

  function handleLeveled() {
    dispatch({
      type: "FLEET_PLANNER_FLIP_LEVELED_FLAG",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  function handleAdjusted() {
    dispatch({
      type: "FLEET_PLANNER_FLIP_ADJUSTED_FLAG",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  const tagCell: React.JSX.Element = (
    <td className="w-[88px]">
      <button
        className={`p-1 rounded-full ${leveled ? "text-amber-500" : "text-gray-500"}`}
        onClick={handleLeveled}
      >
        <MilitaryTechIcon className="text-sm" />
      </button>
      <button
        className={`p-1 rounded-full ${adjusted ? "text-blue-500" : "text-gray-500"}`}
        onClick={handleAdjusted}
      >
        <ScienceIcon className="text-sm" />
      </button>
    </td>
  );

  let addOn = "";
  if (isShipData(shipData) && shipData.variants[0] !== "")
    addOn = ` - ${shipData.variants[variant]}`;

  const techDisplayData = techPointLookupTable[shipId] || {
    text: "V1.00",
    type: "tech-normal",
  };

  return (
    <tr>
      {tagCell}
      <td>{`${name}${addOn}`}</td>
      <td>
        <div className={techDisplayData.type}>{techDisplayData.text}</div>
      </td>
      <td className="text-center">{count}</td>
      <td className="text-right">{totalPopulation}</td>
    </tr>
  );
}

function EditShipRow(props: {
  ship: ShipInFleet;
  fleetIndex: number;
  shipIndex: number;
  type: FleetType;
}): React.JSX.Element | null {
  const { state, dispatch } = useAppContext();
  const accountId = state.selectedAccount.id;

  const { ship, fleetIndex, shipIndex, type } = props;
  const { shipId, count, variant } = ship;

  function handleRemoveShip() {
    dispatch({
      type: "FLEET_PLANNER_REMOVE_SHIP_OR_AIRCRAFT",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  function handleIncreaseCount() {
    dispatch({
      type: "FLEET_PLANNER_INCREASE_SHIP_COUNT",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  function handleDecreaseCount() {
    dispatch({
      type: "FLEET_PLANNER_DECREASE_SHIP_COUNT",
      payload: { accountId, shipIndex, fleetIndex, type },
    });
  }

  const data = lookUpShipById(shipId);
  let population = 0;
  if (data === undefined) {
    // do nothing
  } else if (isShipData(data)) {
    population = data.pop[variant];
  } else if (isSuperCap(data)) {
    population = data.pop;
  }

  if (!data) return null;
  let addOn = "";
  if (isShipData(data) && data.variants[0] !== "")
    addOn = ` - ${data.variants[variant]}`;
  const controlCell: React.JSX.Element = (
    <td className="w-[150px]">
      <button
        className={`p-1 rounded-full text-green-600 ${count >= data.limit ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"}`}
        onClick={handleIncreaseCount}
        disabled={count >= data.limit}
      >
        <AddIcon />
      </button>
      <button
        className={`p-1 rounded-full text-red-600 ${count <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100"}`}
        onClick={handleDecreaseCount}
        disabled={count <= 0}
      >
        <RemoveIcon />
      </button>
      <button
        className="p-1 rounded-full text-amber-600 hover:bg-amber-100"
        onClick={handleRemoveShip}
      >
        <DeleteOutlineIcon />
      </button>
    </td>
  );

  return (
    <tr>
      {controlCell}
      <td>{`${data.name}${addOn}`}</td>
      <td className="text-center">{population}</td>
      <td className="text-center">{count}</td>
      <td className="text-right">{population * count}</td>
    </tr>
  );
}

function ShipTableHeader(props: { titles: string[] }) {
  const { titles } = props;
  return (
    <thead>
      <tr>
        <th colSpan={2} className="text-center">
          {titles[0]}
        </th>
        <th className="w-16 text-center">{titles[1]}</th>
        <th className="w-16 text-center">{titles[2]}</th>
        <th className="w-[75px] text-center">{titles[3]}</th>
      </tr>
    </thead>
  );
}

function ShipTableFooter(props: {
  fleetIndex: number;
  type: "main" | "reinforce";
}) {
  const { fleetIndex, type } = props;
  const { state } = useAppContext();
  const accountId = state.selectedAccount.id;
  const fleetPlannerState = state.fleetPlanner[accountId];

  // 计算舰队总数据
  const fleet = fleetPlannerState.fleets[fleetIndex];
  const ships = type === "main" ? fleet.mainFleet : fleet.reinforcement;

  let totalCount = 0;
  let totalPopulation = 0;

  ships.forEach((ship) => {
    totalCount += ship.count;
    const shipData = lookUpShipById(ship.shipId);
    if (shipData) {
      if (isShipData(shipData)) {
        totalPopulation += shipData.pop[ship.variant] * ship.count;
      } else if (isSuperCap(shipData)) {
        totalPopulation += shipData.pop * ship.count;
      }
    }
  });

  return (
    <tr>
      <td colSpan={2} className="no-border"></td>
      <td>合计</td>
      <td className="text-center">{totalCount}</td>
      <td className="text-right">{totalPopulation}</td>
    </tr>
  );
}
