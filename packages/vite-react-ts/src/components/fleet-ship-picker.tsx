import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { ShipData, ShipTypes } from "./data/ship-data-types";
import { lookUpShipById } from "./data/ship-data";
import { TechIcon } from "./Icons/tech";

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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddShip(ship.id, index)}
            startIcon={<TechIcon />}
          >
            {variant.name}
          </Button>
        </div>
      );
    });

    return (
      <Card key={ship.id} className="ship-card">
        <CardContent>
          <Typography variant="h6">{shipData.name}</Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="ship variants"
            >
              <Tab label="变体" />
              <Tab label="信息" />
            </Tabs>
          </Box>
          <Box sx={{ p: 2 }}>
            {tabValue === 0 && (
              <div className="ship-variants-container">{variants}</div>
            )}
            {tabValue === 1 && (
              <div className="ship-info">
                <Typography variant="body2">{shipData.description}</Typography>
              </div>
            )}
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small">查看详情</Button>
        </CardActions>
      </Card>
    );
  });

  return shipCards.filter((card) => card !== null) as React.JSX.Element[];
}
