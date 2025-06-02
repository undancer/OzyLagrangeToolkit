import {
  IconButton,
  Input,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import BrushIcon from "@mui/icons-material/Brush";
import "./css/fleet-plan.css";
import { FleetPlanShipTable } from "./fleet-plan-ship-table";
import { FleetPlanAircraftTable } from "./fleet-plan-aircraft-table";
import { useAppContext , Fleet } from "../context";
import { ShipTypes } from "./data/ship-data-types";

export function FleetPlan(): React.JSX.Element {
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
    return (
      <div className="fleet-manager-container">
        <Typography>加载中...</Typography>
      </div>
    );
  }

  const fleets = state.fleetPlanner[accountId].fleets;

  if (!fleets || fleets.length === 0) {
    return (
      <div className="fleet-manager-container">
        <Typography>没有舰队，请添加一个舰队。</Typography>
      </div>
    );
  }

  const fleetControls: React.JSX.Element[] = fleets.map((fleet, index) => {
    return (
      <IndividualFleetPlanner fleet={fleet} fleetIndex={index} key={index} />
    );
  });

  return <div className="fleet-manager-container">{fleetControls}</div>;
}

function IndividualFleetPlanner(props: {
  fleet: Fleet;
  fleetIndex: number;
}): React.JSX.Element {
  const { state, dispatch } = useAppContext();
  const accountId =
    state.selectedAccount.id || state.selectedAccount.accountId || "";
  const showControl = state.displayControl;
  const [changingName, setChangingName] = useState(false);
  const [name, setName] = useState("");
  const { fleet, fleetIndex } = props;

  function handleRemoveFleet() {
    dispatch({
      type: "FLEET_PLANNER_REMOVE_FLEET",
      payload: { accountId, index: fleetIndex },
    });
  }

  function handleNameChange() {
    if (name !== "") {
      dispatch({
        type: "FLEET_PLANNER_CHANGE_FLEET_NAME",
        payload: { accountId, fleetIndex, name },
      });
      setChangingName(false);
    }
  }

  function handleNameChangeCancel() {
    setChangingName(false);
  }

  return (
    <div className="fleet-planner-fleet-container">
      <div className="fleet-planner-fleet-header">
        {changingName ? (
          <div className="fleet-planner-fleet-name-change">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fleet-planner-fleet-name-input"
            />
            <IconButton onClick={handleNameChange}>
              <DoneIcon />
            </IconButton>
            <IconButton onClick={handleNameChangeCancel}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        ) : (
          <div className="fleet-planner-fleet-name">
            <Typography variant="h6">{fleet.name}</Typography>
            <IconButton onClick={() => setChangingName(true)}>
              <BrushIcon />
            </IconButton>
          </div>
        )}
        <IconButton onClick={handleRemoveFleet}>
          <HighlightOffIcon />
        </IconButton>
      </div>
      <div className="fleet-planner-fleet-content">
        <Paper className="fleet-planner-fleet-table-container">
          <TableContainer>
            <FleetPlanShipTable fleet={fleet} fleetIndex={fleetIndex} />
          </TableContainer>
        </Paper>
        <Paper className="fleet-planner-fleet-table-container">
          <TableContainer>
            <FleetPlanAircraftTable fleet={fleet} fleetIndex={fleetIndex} />
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
