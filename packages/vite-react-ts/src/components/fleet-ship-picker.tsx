import React, { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { ShipData, ShipTypes } from "./data/ship-data-types";
import { lookUpShipById } from "./data/ship-data";
import { TechIcon } from "./svg/tech-icon";

export function FleetShipPicker(): React.JSX.Element {
  const { state, dispatch } = useAppContext();
  const accountId =
    state.selectedAccount.id || state.selectedAccount.accountId || "";

  // 使用useEffect初始化fleetPlanner数据
  useEffect(() => {
    if (accountId && !state.fleetPlanner[accountId]) {
      dispatch({
        type: "FLEET_PLANNER/UPDATE",
        payload: {
          [accountId]: {
            accountId,
            availableShipTypes: [
              ShipTypes.cruiser,
              ShipTypes.destroyer,
              ShipTypes.frigate,
            ],
            shipIgnoreList: [],
            maxPopulation: 120,
            onlyDisplayOwned: false,
            displayControl: true,
            mainModuleFirst: false,
            selectedFleet: { index: -1, type: "main" },
            fleetLimit: 3,
            fleets: [],
          },
        },
      });
    }
  }, [accountId, state.fleetPlanner, dispatch]);

  // 检查accountId和fleetPlanner[accountId]是否存在
  if (!accountId || !state.fleetPlanner[accountId]) {
    return <div className="fleet-planner-ship-type-container"></div>;
  }

  const selectedTypes = state.fleetPlanner[accountId].availableShipTypes;
  const showControl =
    state.displayControl || state.fleetPlanner[accountId].displayControl;

  if (!showControl)
    return <div className="fleet-planner-ship-type-container"></div>;

  // 导入舰船数据库
  const UNIT_DATA_BASE = {
    cruisers: { type: ShipTypes.cruiser, list: [] },
    destroyers: { type: ShipTypes.destroyer, list: [] },
    frigates: { type: ShipTypes.frigate, list: [] },
    corvettes: { type: ShipTypes.corvette, list: [] },
    aircrafts: { type: ShipTypes.aircraft, list: [] },
    bombers: { type: ShipTypes.bomber, list: [] },
    battleCruisers: { type: ShipTypes.battleCruiser, list: [] },
    carriers: { type: ShipTypes.carrier, list: [] },
  };

  // 填充舰船数据
  // TODO: 从实际数据源获取舰船数据

  let resultCards: React.JSX.Element[] = [];
  selectedTypes.forEach((type) => {
    switch (type) {
      case ShipTypes.cruiser:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.cruisers }),
        );
        break;
      case ShipTypes.destroyer:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.destroyers }),
        );
        break;
      case ShipTypes.frigate:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.frigates }),
        );
        break;
      case ShipTypes.corvette:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.corvettes }),
        );
        break;
      case ShipTypes.aircraft:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.aircrafts }),
        );
        break;
      case ShipTypes.bomber:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.bombers }),
        );
        break;
      case ShipTypes.battleCruiser:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.battleCruisers }),
        );
        break;
      case ShipTypes.carrier:
        resultCards = resultCards.concat(
          shipCardsByType({ data: UNIT_DATA_BASE.carriers }),
        );
        break;
    }
  });

  return <div className="fleet-planner-ship-type-container">{resultCards}</div>;
}

interface ShipCardsByTypeProps {
  data: {
    type: ShipTypes;
    list: ShipData[];
  };
}

function shipCardsByType(props: ShipCardsByTypeProps): React.JSX.Element[] {
  const { state, dispatch } = useAppContext();
  const accountId =
    state.selectedAccount.id || state.selectedAccount.accountId || "";

  // 检查accountId和fleetPlanner[accountId]是否存在
  if (!accountId || !state.fleetPlanner[accountId]) {
    return [];
  }

  const selectedFleet = state.fleetPlanner[accountId].selectedFleet;
  const fleetIndex = selectedFleet.index;
  const fleetType = selectedFleet.type;

  if (fleetIndex === -1) {
    return [];
  }

  const { type, list } = props.data;

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddShip = (shipId: string, variant: number) => {
    if (type === ShipTypes.aircraft || type === ShipTypes.bomber) {
      dispatch({
        type: "FLEET_PLANNER_ADD_AIRCRAFT",
        payload: {
          accountId,
          shipId,
          variant,
        },
      });
    } else {
      dispatch({
        type: "FLEET_PLANNER_ADD_SHIP",
        payload: {
          accountId,
          shipId,
          variant,
        },
      });
    }
  };

  const shipCards = list.map((ship) => {
    const shipData = lookUpShipById(ship.id);
    if (!shipData) return null;

    const variants = shipData.variants.map((variant, index) => {
      return (
        <div key={index} className="ship-variant">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-2"
            onClick={() => handleAddShip(ship.id, index)}
          >
            <TechIcon />
            {variant.name}
          </button>
        </div>
      );
    });

    return (
      <div
        key={ship.id}
        className="ship-card bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden"
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{shipData.name}</h2>
          <div className="border-b border-gray-300 dark:border-gray-700">
            <div className="flex">
              <button
                className={`px-4 py-2 ${tabValue === 0 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 dark:text-gray-400"}`}
                onClick={(e) => handleTabChange(e, 0)}
                aria-label="ship variants"
              >
                变体
              </button>
              <button
                className={`px-4 py-2 ${tabValue === 1 ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 dark:text-gray-400"}`}
                onClick={(e) => handleTabChange(e, 1)}
                aria-label="ship info"
              >
                信息
              </button>
            </div>
          </div>
          <div className="p-2">
            {tabValue === 0 && (
              <div className="ship-variants-container">{variants}</div>
            )}
            {tabValue === 1 && (
              <div className="ship-info">
                <p className="text-sm">{shipData.description}</p>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 flex justify-end">
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            查看详情
          </button>
        </div>
      </div>
    );
  });

  return shipCards.filter((card) => card !== null) as React.JSX.Element[];
}
