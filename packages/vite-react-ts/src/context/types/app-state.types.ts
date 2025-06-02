// 应用总体状态类型定义
// import {
//     GameAccountState,
//     TimerGroupState,
//     TaskTimeStampState,
//     AcquiredBluePrintState,
//     SelectedAccountState,
//     FleetPlannerState,
//     AngulumCityDataState,
// } from './index';

import { AcquiredBluePrintState } from "./acquired-blue-print.types";
import { AngulumCityDataState } from "./angulum-city-data.types";
import { FleetPlannerState } from "./fleet-planner.types";
import { GameAccountState } from "./game-account.types";
import { SelectedAccountState } from "./selected-account.types";
import { TaskTimeStampState } from "./task-time-stamp.types";
import { TimerGroupState } from "./timer-group.types";
import { AcquiredBluePrint } from "../hooks/useAcquiredBlueprint";

export interface AppState {
    gameAccounts: GameAccountState['accounts'];
    selectedAccountId: string | null;
    timerGroups: TimerGroupState['timerGroups'];
    tasks: TaskTimeStampState['tasks'];
    acquiredBlueprints: AcquiredBluePrint[];
    fleetPlanner: FleetPlannerState;
    angulumCityData: AngulumCityDataState;
}

// Action 类型定义
export type AppAction = 
    | { type: 'LOAD_STATE'; payload: Partial<AppState> }
    | { type: 'RESET_STATE' }
    | { type: 'GAME_ACCOUNT/ADD'; payload: { id: string; name: string } }
    | { type: 'GAME_ACCOUNT/REMOVE'; payload: { id: string } }
    | { type: 'GAME_ACCOUNT/CHANGE_NAME'; payload: { id: string; name: string } }
    | { type: 'SELECTED_ACCOUNT/SET'; payload: { accountId: string } }
    | { type: 'TIMER_GROUP/UPDATE'; payload: { accountId: string; timerGroup: any } }
    | { type: 'TASK_TIME_STAMP/ADD'; payload: { id: string; duration: number; startTime: number } }
    | { type: 'TASK_TIME_STAMP/REMOVE'; payload: { id: string } }
    | { type: 'CREATE_ACQUIRED_BLUEPRINT'; payload: AcquiredBluePrint }
    | { type: 'UPDATE_BLUEPRINT_SETTING'; payload: { accountId: string; setting: any } }
    | { type: 'ADD_SHIP_VARIANT'; payload: { accountId: string; shipId: string; variant: number; techPoint: number } }
    | { type: 'REMOVE_SHIP_VARIANT'; payload: { accountId: string; shipId: string; variant: number } }
    | { type: 'ADD_SUPER_CAP'; payload: { accountId: string; superCapId: string; techPoint: number } }
    | { type: 'REMOVE_SUPER_CAP'; payload: { accountId: string; superCapId: string } }
    | { type: 'ADD_MODULE'; payload: { accountId: string; superCapId: string; moduleId: string } }
    | { type: 'REMOVE_MODULE'; payload: { accountId: string; superCapId: string; moduleId: string } }
    | { type: 'UPDATE_SHIP_VARIANT_PROGRESS'; payload: { accountId: string; shipId: string; variant: number; progress: number } }
    | { type: 'FLEET_PLANNER/UPDATE'; payload: any }
    | { type: 'ANGULUM_CITY_DATA/UPDATE'; payload: Partial<AngulumCityDataState> }
    | { type: 'UPDATE_SELECTED_ACCOUNT_ID'; payload: string }
    // Angulum相关action类型
    | { type: 'ANGULUM_FETCH_CITIES_REQUEST' }
    | { type: 'ANGULUM_FETCH_CITIES_SUCCESS'; payload: any }
    | { type: 'ANGULUM_FETCH_CITIES_FAILURE'; payload: string }
    | { type: 'ANGULUM_SELECT_CITY'; payload: number }
    | { type: 'ANGULUM_CITY_DATA/SELECT_CITY'; payload: number }
    // Fleet Planner相关action类型
    | { type: 'FLEET_PLANNER_ADD_FLEET'; payload: { accountId: string; name: string } }
    | { type: 'FLEET_PLANNER_REMOVE_FLEET'; payload: any }
    | { type: 'FLEET_PLANNER_CHANGE_FLEET_NAME'; payload: any }
    | { type: 'FLEET_PLANNER_CHANGE_SELECTED_FLEET'; payload: { accountId: string; index: number; type: any } }
    | { type: 'FLEET_PLANNER_UPDATE_AVAILABLE_SHIP_TYPES'; payload: any }
    | { type: 'FLEET_PLANNER_UPDATE_SETTINGS'; payload: { accountId: string; onlyDisplayOwned: boolean; displayControl: boolean; mainModuleFirst: boolean } }
    | { type: 'FLEET_PLANNER_ADD_SHIP'; payload: any }
    | { type: 'FLEET_PLANNER_ADD_AIRCRAFT'; payload: any }
    | { type: 'FLEET_PLANNER_REMOVE_SHIP_OR_AIRCRAFT'; payload: any }
    | { type: 'FLEET_PLANNER_INCREASE_SHIP_COUNT'; payload: any }
    | { type: 'FLEET_PLANNER_DECREASE_SHIP_COUNT'; payload: { accountId: string; fleetIndex: number; shipIndex: number; type: any } }
    | { type: 'FLEET_PLANNER_FLIP_LEVELED_FLAG'; payload: any }
    | { type: 'FLEET_PLANNER_FLIP_ADJUSTED_FLAG'; payload: any };