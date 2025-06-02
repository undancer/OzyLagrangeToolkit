// 应用状态reducer
import { AppState, AppAction } from '../types';
import { Fleet, FleetType } from '../types/fleet-planner.types';
import { ShipTypes } from '../../components/data/ship-data-types';
import { lookUpShipById } from '../../components/data/ship-data';

// 初始状态
export const initialState: AppState = {
    gameAccounts: {},
    selectedAccountId: null,
    timerGroups: {},
    tasks: {},
    acquiredBlueprints: [],
    fleetPlanner: {},
    angulumCityData: {
        requestState: 'idle',
        cities: [],
        error: undefined,
        selectedIndex: undefined,
    },
};

// 创建空的账户数据
function createEmptyFleetPlannerAccount(accountId: string) {
    return {
        accountId,
        availableShipTypes: [ShipTypes.cruiser, ShipTypes.destroyer, ShipTypes.frigate],
        shipIgnoreList: [],
        maxPopulation: 120,
        onlyDisplayOwned: false,
        displayControl: true,
        mainModuleFirst: false,
        selectedFleet: { index: -1, type: FleetType.main },
        fleetLimit: 3,
        fleets: []
    };
}

// 主reducer函数
export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'LOAD_STATE':
            return {
                ...state,
                ...action.payload,
            };
            
        case 'RESET_STATE':
            return initialState;
            
        // 游戏账户相关actions
        case 'GAME_ACCOUNT/ADD':
            return {
                ...state,
                gameAccount: {
                    ...state.gameAccount,
                    [action.payload.id]: {
                        id: action.payload.id,
                        name: action.payload.name,
                    },
                },
            };
            
        case 'GAME_ACCOUNT/REMOVE':
            const { [action.payload.id]: removed, ...remainingAccounts } = state.gameAccount;
            return {
                ...state,
                gameAccount: remainingAccounts,
            };
            
        case 'GAME_ACCOUNT/CHANGE_NAME':
            return {
                ...state,
                gameAccount: {
                    ...state.gameAccount,
                    [action.payload.id]: {
                        ...state.gameAccount[action.payload.id],
                        name: action.payload.name,
                    },
                },
            };
            
        // 选中账户相关actions
        case 'SELECTED_ACCOUNT/SET':
            return {
                ...state,
                selectedAccount: {
                    accountId: action.payload.accountId,
                },
            };
            
        // 计时器组相关actions
        case 'TIMER_GROUP/UPDATE':
            return {
                ...state,
                timerGroup: {
                    ...state.timerGroup,
                    [action.payload.accountId]: action.payload.timerGroup,
                },
            };
            
        // 任务时间戳相关actions
        case 'TASK_TIME_STAMP/ADD':
            return {
                ...state,
                taskTimeStamp: {
                    ...state.taskTimeStamp,
                    [action.payload.id]: {
                        id: action.payload.id,
                        duration: action.payload.duration,
                        startTime: action.payload.startTime,
                    },
                },
            };
            
        case 'TASK_TIME_STAMP/REMOVE':
            const { [action.payload.id]: removedTask, ...remainingTasks } = state.taskTimeStamp;
            return {
                ...state,
                taskTimeStamp: remainingTasks,
            };
            
        // 获得蓝图相关actions
        case 'ACQUIRED_BLUE_PRINT/UPDATE':
            return {
                ...state,
                acquiredBluePrint: {
                    ...state.acquiredBluePrint,
                    ...action.payload,
                },
            };
            
        // 舰队规划相关actions
        case 'FLEET_PLANNER/UPDATE':
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    ...action.payload,
                },
            };

        // 舰队规划 - 添加舰队
        case 'FLEET_PLANNER_ADD_FLEET':
            const { accountId: addFleetAccountId, name } = action.payload;
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [addFleetAccountId]: {
                        ...state.fleetPlanner[addFleetAccountId] || createEmptyFleetPlannerAccount(addFleetAccountId),
                        fleets: [
                            ...(state.fleetPlanner[addFleetAccountId]?.fleets || []),
                            { name, mainFleet: [], reinforcement: [], aircraft: [] }
                        ],
                        selectedFleet: {
                            index: state.fleetPlanner[addFleetAccountId]?.selectedFleet?.index === -1 ? 0 : state.fleetPlanner[addFleetAccountId]?.selectedFleet?.index || 0,
                            type: state.fleetPlanner[addFleetAccountId]?.selectedFleet?.type || FleetType.main
                        }
                    }
                }
            };

        // 舰队规划 - 移除舰队
        case 'FLEET_PLANNER_REMOVE_FLEET':
            const { accountId: removeFleetAccountId, index } = action.payload;
            if (!state.fleetPlanner[removeFleetAccountId]) return state;
            
            const updatedFleets = [...state.fleetPlanner[removeFleetAccountId].fleets];
            updatedFleets.splice(index, 1);
            
            let selectedFleetIndex = state.fleetPlanner[removeFleetAccountId].selectedFleet.index;
            if (updatedFleets.length < 1) {
                selectedFleetIndex = -1;
            } else if (selectedFleetIndex >= updatedFleets.length) {
                selectedFleetIndex = updatedFleets.length - 1;
            }
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [removeFleetAccountId]: {
                        ...state.fleetPlanner[removeFleetAccountId],
                        fleets: updatedFleets,
                        selectedFleet: {
                            ...state.fleetPlanner[removeFleetAccountId].selectedFleet,
                            index: selectedFleetIndex
                        }
                    }
                }
            };

        // 舰队规划 - 更改舰队名称
        case 'FLEET_PLANNER_CHANGE_FLEET_NAME':
            const { accountId: changeNameAccountId, fleetIndex, name: newName } = action.payload;
            if (!state.fleetPlanner[changeNameAccountId] || !state.fleetPlanner[changeNameAccountId].fleets[fleetIndex]) return state;
            
            const updatedFleetsWithNewName = [...state.fleetPlanner[changeNameAccountId].fleets];
            updatedFleetsWithNewName[fleetIndex] = {
                ...updatedFleetsWithNewName[fleetIndex],
                name: newName
            };
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [changeNameAccountId]: {
                        ...state.fleetPlanner[changeNameAccountId],
                        fleets: updatedFleetsWithNewName
                    }
                }
            };

        // 舰队规划 - 更改选中的舰队
        case 'FLEET_PLANNER_CHANGE_SELECTED_FLEET':
            const { accountId: changeSelectedAccountId, index: newIndex, type: newType } = action.payload;
            if (!state.fleetPlanner[changeSelectedAccountId]) return state;
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [changeSelectedAccountId]: {
                        ...state.fleetPlanner[changeSelectedAccountId],
                        selectedFleet: {
                            index: newIndex,
                            type: newType
                        }
                    }
                }
            };

        // 舰队规划 - 添加舰船
        case 'FLEET_PLANNER_ADD_SHIP':
            const { accountId: addShipAccountId, shipId, variant } = action.payload;
            if (!state.fleetPlanner[addShipAccountId]) return state;
            
            const shipData = lookUpShipById(shipId);
            if (!shipData) return state;
            
            const selectedFleetForAddShip = state.fleetPlanner[addShipAccountId].selectedFleet;
            if (selectedFleetForAddShip.index === -1) return state;
            
            const fleetToAddShip = state.fleetPlanner[addShipAccountId].fleets[selectedFleetForAddShip.index];
            let updatedFleetWithNewShip = {...fleetToAddShip};
            
            if (selectedFleetForAddShip.type === FleetType.main) {
                const existingShipIndex = updatedFleetWithNewShip.mainFleet.findIndex(ship => ship.shipId === shipId && ship.variant === variant);
                if (existingShipIndex === -1) {
                    updatedFleetWithNewShip.mainFleet = [
                        ...updatedFleetWithNewShip.mainFleet,
                        { shipId, variant, count: 1, adjusted: false, leveled: false }
                    ];
                }
            } else if (selectedFleetForAddShip.type === FleetType.reinforcement) {
                const existingShipIndex = updatedFleetWithNewShip.reinforcement.findIndex(ship => ship.shipId === shipId && ship.variant === variant);
                if (existingShipIndex === -1) {
                    updatedFleetWithNewShip.reinforcement = [
                        ...updatedFleetWithNewShip.reinforcement,
                        { shipId, variant, count: 1, adjusted: false, leveled: false }
                    ];
                }
            }
            
            const updatedFleetsWithNewShip = [...state.fleetPlanner[addShipAccountId].fleets];
            updatedFleetsWithNewShip[selectedFleetForAddShip.index] = updatedFleetWithNewShip;
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [addShipAccountId]: {
                        ...state.fleetPlanner[addShipAccountId],
                        fleets: updatedFleetsWithNewShip
                    }
                }
            };

        // 舰队规划 - 添加飞机
        case 'FLEET_PLANNER_ADD_AIRCRAFT':
            const { accountId: addAircraftAccountId, shipId: aircraftId, variant: aircraftVariant } = action.payload;
            if (!state.fleetPlanner[addAircraftAccountId]) return state;
            
            const aircraftData = lookUpShipById(aircraftId);
            if (!aircraftData) return state;
            
            const selectedFleetForAddAircraft = state.fleetPlanner[addAircraftAccountId].selectedFleet;
            if (selectedFleetForAddAircraft.index === -1) return state;
            
            const fleetToAddAircraft = state.fleetPlanner[addAircraftAccountId].fleets[selectedFleetForAddAircraft.index];
            const existingAircraftIndex = fleetToAddAircraft.aircraft.findIndex(aircraft => aircraft.shipId === aircraftId && aircraft.variant === aircraftVariant);
            
            if (existingAircraftIndex === -1) {
                const updatedAircraft = [
                    ...fleetToAddAircraft.aircraft,
                    { shipId: aircraftId, variant: aircraftVariant, count: 1, adjusted: false, leveled: false }
                ];
                
                const updatedFleetsWithNewAircraft = [...state.fleetPlanner[addAircraftAccountId].fleets];
                updatedFleetsWithNewAircraft[selectedFleetForAddAircraft.index] = {
                    ...fleetToAddAircraft,
                    aircraft: updatedAircraft
                };
                
                return {
                    ...state,
                    fleetPlanner: {
                        ...state.fleetPlanner,
                        [addAircraftAccountId]: {
                            ...state.fleetPlanner[addAircraftAccountId],
                            fleets: updatedFleetsWithNewAircraft
                        }
                    }
                };
            }
            return state;

        // 舰队规划 - 减少舰船/飞机数量
        case 'FLEET_PLANNER_DECREASE_SHIP_COUNT':
            const { accountId: decreaseCountAccountId, fleetIndex: decreaseFleetIndex, shipIndex, type: decreaseType } = action.payload;
            if (!state.fleetPlanner[decreaseCountAccountId] || !state.fleetPlanner[decreaseCountAccountId].fleets[decreaseFleetIndex]) return state;
            
            const fleetToDecrease = state.fleetPlanner[decreaseCountAccountId].fleets[decreaseFleetIndex];
            let updatedFleetAfterDecrease = {...fleetToDecrease};
            
            if (decreaseType === FleetType.main && shipIndex < fleetToDecrease.mainFleet.length) {
                const updatedMainFleet = [...fleetToDecrease.mainFleet];
                updatedMainFleet[shipIndex] = {
                    ...updatedMainFleet[shipIndex],
                    count: Math.max(0, updatedMainFleet[shipIndex].count - 1)
                };
                updatedFleetAfterDecrease.mainFleet = updatedMainFleet;
            } else if (decreaseType === FleetType.reinforcement && shipIndex < fleetToDecrease.reinforcement.length) {
                const updatedReinforcement = [...fleetToDecrease.reinforcement];
                updatedReinforcement[shipIndex] = {
                    ...updatedReinforcement[shipIndex],
                    count: Math.max(0, updatedReinforcement[shipIndex].count - 1)
                };
                updatedFleetAfterDecrease.reinforcement = updatedReinforcement;
            } else if (decreaseType === FleetType.aircraft && shipIndex < fleetToDecrease.aircraft.length) {
                const updatedAircraft = [...fleetToDecrease.aircraft];
                updatedAircraft[shipIndex] = {
                    ...updatedAircraft[shipIndex],
                    count: Math.max(0, updatedAircraft[shipIndex].count - 1)
                };
                updatedFleetAfterDecrease.aircraft = updatedAircraft;
            }
            
            const updatedFleetsAfterDecrease = [...state.fleetPlanner[decreaseCountAccountId].fleets];
            updatedFleetsAfterDecrease[decreaseFleetIndex] = updatedFleetAfterDecrease;
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [decreaseCountAccountId]: {
                        ...state.fleetPlanner[decreaseCountAccountId],
                        fleets: updatedFleetsAfterDecrease
                    }
                }
            };
            
        // 舰队规划 - 更新可用舰船类型
        case 'FLEET_PLANNER_UPDATE_AVAILABLE_SHIP_TYPES':
            const { accountId: updateTypesAccountId, types } = action.payload;
            if (!state.fleetPlanner[updateTypesAccountId]) return state;
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [updateTypesAccountId]: {
                        ...state.fleetPlanner[updateTypesAccountId],
                        availableShipTypes: types
                    }
                }
            };
            
        // 舰队规划 - 更新设置
        case 'FLEET_PLANNER_UPDATE_SETTINGS':
            const { accountId: updateSettingsAccountId, onlyDisplayOwned, displayControl, mainModuleFirst } = action.payload;
            if (!state.fleetPlanner[updateSettingsAccountId]) return state;
            
            return {
                ...state,
                fleetPlanner: {
                    ...state.fleetPlanner,
                    [updateSettingsAccountId]: {
                        ...state.fleetPlanner[updateSettingsAccountId],
                        onlyDisplayOwned,
                        displayControl,
                        mainModuleFirst
                    }
                }
            };

        // 蓝图相关actions
        case 'UPDATE_BLUEPRINT_SETTING':
            console.log('UPDATE_BLUEPRINT_SETTING action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        return {
                            ...blueprint,
                            displayMode: action.payload.setting.displayMode !== undefined ? action.payload.setting.displayMode : blueprint.displayMode,
                            editLock: action.payload.setting.editLock !== undefined ? action.payload.setting.editLock : blueprint.editLock,
                            showZeroPercentBluePrint: action.payload.setting.showZeroPercent !== undefined ? action.payload.setting.showZeroPercent : blueprint.showZeroPercentBluePrint
                        };
                    }
                    return blueprint;
                }) || []
            };

        case 'CREATE_ACQUIRED_BLUEPRINT':
            console.log('CREATE_ACQUIRED_BLUEPRINT action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: [...(state.acquiredBlueprints || []), action.payload]
            };

        case 'ADD_SHIP_VARIANT':
            console.log('ADD_SHIP_VARIANT action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否已存在该舰船
                        const existingShipIndex = blueprint.ships.findIndex(ship => ship.id === action.payload.shipId);
                        
                        if (existingShipIndex === -1) {
                            // 如果舰船不存在，添加新舰船
                            return {
                                ...blueprint,
                                ships: [...blueprint.ships, {
                                    id: action.payload.shipId,
                                    techPoint: action.payload.techPoint,
                                    variants: action.payload.variant >= 0 ? [action.payload.variant] : [],
                                    partialComplete: {}
                                }]
                            };
                        } else {
                            // 如果舰船已存在
                            const updatedShips = [...blueprint.ships];
                            
                            if (action.payload.variant >= 0) {
                                // 如果是添加变体
                                if (!updatedShips[existingShipIndex].variants.includes(action.payload.variant)) {
                                    updatedShips[existingShipIndex] = {
                                        ...updatedShips[existingShipIndex],
                                        variants: [...updatedShips[existingShipIndex].variants, action.payload.variant]
                                    };
                                }
                            }
                            
                            // 更新科技点
                            if (action.payload.techPoint > 0) {
                                updatedShips[existingShipIndex] = {
                                    ...updatedShips[existingShipIndex],
                                    techPoint: action.payload.techPoint
                                };
                            }
                            
                            return {
                                ...blueprint,
                                ships: updatedShips
                            };
                        }
                    }
                    return blueprint;
                }) || []
            };

        case 'REMOVE_SHIP_VARIANT':
            console.log('REMOVE_SHIP_VARIANT action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否已存在该舰船
                        const existingShipIndex = blueprint.ships.findIndex(ship => ship.id === action.payload.shipId);
                        
                        if (existingShipIndex !== -1) {
                            // 如果舰船存在
                            const updatedShips = [...blueprint.ships];
                            
                            // 移除变体
                            if (action.payload.variant >= 0) {
                                const updatedVariants = updatedShips[existingShipIndex].variants.filter(v => v !== action.payload.variant);
                                
                                // 更新变体列表
                                updatedShips[existingShipIndex] = {
                                    ...updatedShips[existingShipIndex],
                                    variants: updatedVariants
                                };
                            }
                            
                            return {
                                ...blueprint,
                                ships: updatedShips
                            };
                        }
                    }
                    return blueprint;
                }) || []
            };

        case 'UPDATE_SHIP_VARIANT_PROGRESS':
            console.log('UPDATE_SHIP_VARIANT_PROGRESS action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否已存在该舰船
                        const existingShipIndex = blueprint.ships.findIndex(ship => ship.id === action.payload.shipId);
                        
                        if (existingShipIndex !== -1) {
                            // 如果舰船存在
                            const updatedShips = [...blueprint.ships];
                            const ship = updatedShips[existingShipIndex];
                            
                            // 更新变体进度
                            updatedShips[existingShipIndex] = {
                                ...ship,
                                partialComplete: {
                                    ...ship.partialComplete,
                                    [action.payload.variant]: action.payload.progress
                                }
                            };
                            
                            return {
                                ...blueprint,
                                ships: updatedShips
                            };
                        }
                    }
                    return blueprint;
                }) || []
            };

        case 'ADD_SUPER_CAP':
            console.log('ADD_SUPER_CAP action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否已存在该超级舰船
                        const existingSuperCapIndex = blueprint.superCapitals.findIndex(sc => sc.id === action.payload.superCapId);
                        
                        if (existingSuperCapIndex === -1) {
                            // 如果超级舰船不存在，添加新超级舰船
                            return {
                                ...blueprint,
                                superCapitals: [...blueprint.superCapitals, {
                                    id: action.payload.superCapId,
                                    techPoint: action.payload.techPoint,
                                    modules: []
                                }]
                            };
                        } else {
                            // 如果超级舰船已存在，更新科技点
                            const updatedSuperCaps = [...blueprint.superCapitals];
                            
                            if (action.payload.techPoint > 0) {
                                updatedSuperCaps[existingSuperCapIndex] = {
                                    ...updatedSuperCaps[existingSuperCapIndex],
                                    techPoint: action.payload.techPoint
                                };
                            }
                            
                            return {
                                ...blueprint,
                                superCapitals: updatedSuperCaps
                            };
                        }
                    }
                    return blueprint;
                }) || []
            };

        case 'REMOVE_SUPER_CAP':
            console.log('REMOVE_SUPER_CAP action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否存在该超级舰船
                        const existingSuperCapIndex = blueprint.superCapitals.findIndex(sc => sc.id === action.payload.superCapId);
                        
                        if (existingSuperCapIndex !== -1) {
                            // 移除超级舰船
                            const updatedSuperCaps = [...blueprint.superCapitals];
                            updatedSuperCaps.splice(existingSuperCapIndex, 1);
                            
                            return {
                                ...blueprint,
                                superCapitals: updatedSuperCaps
                            };
                        }
                    }
                    return blueprint;
                }) || []
            };

        case 'ADD_MODULE':
            console.log('ADD_MODULE action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否存在该超级舰船
                        const existingSuperCapIndex = blueprint.superCapitals.findIndex(sc => sc.id === action.payload.superCapId);
                        
                        if (existingSuperCapIndex !== -1) {
                            // 如果超级舰船存在
                            const updatedSuperCaps = [...blueprint.superCapitals];
                            const superCap = updatedSuperCaps[existingSuperCapIndex];
                            
                            // 检查模块是否已存在
                            if (!superCap.modules.includes(action.payload.moduleId)) {
                                updatedSuperCaps[existingSuperCapIndex] = {
                                    ...superCap,
                                    modules: [...superCap.modules, action.payload.moduleId]
                                };
                                
                                return {
                                    ...blueprint,
                                    superCapitals: updatedSuperCaps
                                };
                            }
                        }
                    }
                    return blueprint;
                }) || []
            };

        case 'REMOVE_MODULE':
            console.log('REMOVE_MODULE action received:', action.payload);
            return {
                ...state,
                acquiredBlueprints: state.acquiredBlueprints?.map(blueprint => {
                    if (blueprint.accountId === action.payload.accountId) {
                        // 查找是否存在该超级舰船
                        const existingSuperCapIndex = blueprint.superCapitals.findIndex(sc => sc.id === action.payload.superCapId);
                        
                        if (existingSuperCapIndex !== -1) {
                            // 如果超级舰船存在
                            const updatedSuperCaps = [...blueprint.superCapitals];
                            const superCap = updatedSuperCaps[existingSuperCapIndex];
                            
                            // 检查模块是否存在
                            const moduleIndex = superCap.modules.indexOf(action.payload.moduleId);
                            if (moduleIndex !== -1) {
                                // 移除模块
                                const updatedModules = [...superCap.modules];
                                updatedModules.splice(moduleIndex, 1);
                                
                                updatedSuperCaps[existingSuperCapIndex] = {
                                    ...superCap,
                                    modules: updatedModules
                                };
                                
                                return {
                                    ...blueprint,
                                    superCapitals: updatedSuperCaps
                                };
                            }
                        }
                    }
                    return blueprint;
                }) || []
            };
            
        // 安古鲁姆城市数据相关actions
        case 'ANGULUM_CITY_DATA/UPDATE':
            return {
                ...state,
                angulumCityData: {
                    ...state.angulumCityData,
                    ...action.payload,
                },
            };
            
        case 'ANGULUM_FETCH_CITIES_REQUEST':
            return {
                ...state,
                angulumCityData: {
                    ...state.angulumCityData,
                    requestState: 'loading',
                    error: undefined,
                },
            };
            
        case 'ANGULUM_FETCH_CITIES_SUCCESS':
            return {
                ...state,
                angulumCityData: {
                    ...state.angulumCityData,
                    requestState: 'success',
                    cities: action.payload,
                    error: undefined,
                },
            };
            
        case 'ANGULUM_FETCH_CITIES_FAILURE':
            return {
                ...state,
                angulumCityData: {
                    ...state.angulumCityData,
                    requestState: 'failed',
                    error: action.payload,
                },
            };
            
        case 'ANGULUM_SELECT_CITY':
        case 'ANGULUM_CITY_DATA/SELECT_CITY':
            return {
                ...state,
                angulumCityData: {
                    ...state.angulumCityData,
                    selectedIndex: action.payload,
                },
            };
            
        case 'UPDATE_SELECTED_ACCOUNT_ID':
            console.log('UPDATE_SELECTED_ACCOUNT_ID action received:', action.payload);
            return {
                ...state,
                selectedAccountId: action.payload,
            };
            
        default:
            return state;
    }
};