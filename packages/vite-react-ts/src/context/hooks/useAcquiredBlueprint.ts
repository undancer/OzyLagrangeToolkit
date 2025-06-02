import { useAppContext } from "../AppContext";
import { v4 as uuidv4 } from "uuid";
import { ShipTypes } from "../../components/data/ship-data-types";
import { UNIT_DATA_BASE } from "../../components/data/ship-data";
import { useRef, useEffect } from "react";

export interface BluePrintReport {
  totalTechPoint: number;
  acquiredBluePrint: number;
  totalBluePrint: number;
}

export interface BluePrintSetting {
  displayMode: "percent" | "count";
  editLock: boolean;
  showZeroPercent: boolean;
}

export interface AcquiredShip {
  id: string;
  techPoint: number;
  variants: number[];
  partialComplete?: { [variant: number]: number };
}

export interface AcquiredSuperCap {
  id: string;
  techPoint: number;
  modules: string[];
}

export interface AcquiredBluePrint {
  id: string;
  accountId: string;
  displayMode: "percent" | "count";
  editLock: boolean;
  showZeroPercentBluePrint: boolean;
  ships: AcquiredShip[];
  superCapitals: AcquiredSuperCap[];
}

export function useAcquiredBlueprint() {
  const { state, dispatch } = useAppContext();
  // 添加缓存机制，避免重复获取同一个accountId的蓝图
  const blueprintCache = useRef<{[accountId: string]: AcquiredBluePrint | undefined | null}>({});
  const selectedAccountId = state.selectedAccountId;

  // 如果选择的账户ID变化，清空缓存
  if (selectedAccountId && blueprintCache.current._lastAccountId !== selectedAccountId) {
    blueprintCache.current = { _lastAccountId: selectedAccountId };
  }

  // 每次state更新时，清除当前账户的缓存，确保获取最新数据
  useEffect(() => {
    if (selectedAccountId) {
      // 只清除当前选中账户的缓存，保留_lastAccountId
      const { _lastAccountId } = blueprintCache.current;
      blueprintCache.current = { _lastAccountId };
    }
  }, [state.acquiredBlueprints, selectedAccountId]);

  const getAcquiredBlueprintByAccountId = (
    accountId: string,
  ): AcquiredBluePrint | undefined => {
    // 如果缓存中有该accountId的蓝图，直接返回
    if (blueprintCache.current[accountId] !== undefined) {
      return blueprintCache.current[accountId];
    }

    const blueprint = state.acquiredBlueprints?.find((bp) => bp.accountId === accountId);
    
    // 如果没有找到蓝图，自动创建一个新的蓝图
    if (!blueprint && accountId) {
      // 创建新蓝图但不缓存，等待下一次渲染时从state中获取
      createAcquiredBlueprint(accountId);
      // 不将null存入缓存，这样下次调用时会再次尝试从state中获取
    } else {
      // 将找到的蓝图存入缓存
      blueprintCache.current[accountId] = blueprint;
    }
    
    return blueprint;
  };

  const getAllAcquiredBlueprints = (): AcquiredBluePrint[] => {
    return state.acquiredBlueprints || [];
  };

  const getBlueprintSettingForSelectedAccount = (): BluePrintSetting => {
    if (!selectedAccountId) {
      return {
        displayMode: "percent",
        editLock: false,
        showZeroPercent: false,
      };
    }

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) {
      return {
        displayMode: "percent",
        editLock: false,
        showZeroPercent: false,
      };
    }

    return {
      displayMode: blueprint.displayMode,
      editLock: blueprint.editLock,
      showZeroPercent: blueprint.showZeroPercentBluePrint,
    };
  };

  const hasShipVariant = (shipId: string, variant: number): boolean => {
    if (!selectedAccountId) return false;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return false;

    const ship = blueprint.ships.find((s) => s.id === shipId);
    if (!ship) return false;

    return ship.variants.includes(variant);
  };

  const hasSuperCap = (superCapId: string): boolean => {
    if (!selectedAccountId) return false;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return false;

    return blueprint.superCapitals.some((sc) => sc.id === superCapId);
  };

  const hasModule = (superCapId: string, moduleId: string): boolean => {
    if (!selectedAccountId) return false;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return false;

    const superCap = blueprint.superCapitals.find((sc) => sc.id === superCapId);
    if (!superCap) return false;

    return superCap.modules.includes(moduleId);
  };

  const getShipVariantProgress = (shipId: string, variant: number): number => {
    if (!selectedAccountId) return 0;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return 0;

    const ship = blueprint.ships.find((s) => s.id === shipId);
    if (!ship || !ship.partialComplete) return 0;

    return ship.partialComplete[variant] || 0;
  };

  const techPointByShipType = (type: ShipTypes): BluePrintReport => {
    const result = {
      totalTechPoint: 0,
      acquiredBluePrint: 0,
      totalBluePrint: 0,
    };

    if (!selectedAccountId) return result;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return result;

    const shipIds: string[] = [];

    // Calculate total blueprints based on ship type
    switch (type) {
      case ShipTypes.cruiser:
        UNIT_DATA_BASE.cruisers.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += ship.variants.length;
        });
        break;
      case ShipTypes.destroyer:
        UNIT_DATA_BASE.destroyers.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += ship.variants.length;
        });
        break;
      case ShipTypes.frigate:
        UNIT_DATA_BASE.frigates.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += ship.variants.length;
        });
        break;
      case ShipTypes.corvette:
        UNIT_DATA_BASE.corvettes.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += ship.variants.length;
        });
        break;
      case ShipTypes.aircraft:
        UNIT_DATA_BASE.aircrafts.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += ship.variants.length;
        });
        break;
      case ShipTypes.bomber:
        UNIT_DATA_BASE.bombers.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += ship.variants.length;
        });
        break;
      case ShipTypes.battleCruiser:
        UNIT_DATA_BASE.battleCruisers.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += 1; // Super caps don't have variants
        });
        break;
      case ShipTypes.carrier:
        UNIT_DATA_BASE.carriers.list.forEach((ship) => {
          shipIds.push(ship.id);
          result.totalBluePrint += 1; // Super caps don't have variants
        });
        break;
      default:
      // Do nothing
    }

    // Calculate acquired blueprints and tech points
    blueprint.ships.forEach((ship) => {
      if (shipIds.includes(ship.id)) {
        result.totalTechPoint += ship.techPoint;
        result.acquiredBluePrint += ship.variants.length;
      }
    });

    // For super caps
    if (
      type === ShipTypes.battleCruiser ||
      type === ShipTypes.carrier
    ) {
      blueprint.superCapitals.forEach((superCap) => {
        if (shipIds.includes(superCap.id)) {
          result.totalTechPoint += superCap.techPoint;
          result.acquiredBluePrint += 1; // Super caps count as 1 blueprint
        }
      });
    }

    return result;
  };

  const getReportForSelectedAccount = (): BluePrintReport => {
    const result = {
      totalTechPoint: 0,
      acquiredBluePrint: 0,
      totalBluePrint: 0,
    };

    if (!selectedAccountId) return result;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return result;

    // Calculate total blueprints
    UNIT_DATA_BASE.cruisers.list.forEach((ship) => {
      result.totalBluePrint += ship.variants.length;
    });
    UNIT_DATA_BASE.destroyers.list.forEach((ship) => {
      result.totalBluePrint += ship.variants.length;
    });
    UNIT_DATA_BASE.frigates.list.forEach((ship) => {
      result.totalBluePrint += ship.variants.length;
    });
    UNIT_DATA_BASE.corvettes.list.forEach((ship) => {
      result.totalBluePrint += ship.variants.length;
    });
    UNIT_DATA_BASE.aircrafts.list.forEach((ship) => {
      result.totalBluePrint += ship.variants.length;
    });
    UNIT_DATA_BASE.bombers.list.forEach((ship) => {
      result.totalBluePrint += ship.variants.length;
    });
    UNIT_DATA_BASE.battleCruisers.list.forEach(() => {
      result.totalBluePrint += 1; // Super caps count as 1 blueprint
    });
    UNIT_DATA_BASE.carriers.list.forEach(() => {
      result.totalBluePrint += 1; // Super caps count as 1 blueprint
    });

    // Calculate acquired blueprints and tech points
    blueprint.ships.forEach((ship) => {
      result.totalTechPoint += ship.techPoint;
      result.acquiredBluePrint += ship.variants.length;
    });

    blueprint.superCapitals.forEach((superCap) => {
      result.totalTechPoint += superCap.techPoint;
      result.acquiredBluePrint += 1; // Super caps count as 1 blueprint
    });

    return result;
  };

  const techPointsByShip = (type: ShipTypes, shipId: string): number => {
    if (!selectedAccountId) return -1;

    const blueprint = getAcquiredBlueprintByAccountId(selectedAccountId);
    if (!blueprint) return -1;

    switch (type) {
      case ShipTypes.cruiser:
      case ShipTypes.destroyer:
      case ShipTypes.frigate:
      case ShipTypes.corvette:
      case ShipTypes.aircraft:
      case ShipTypes.bomber: {
        const ship = blueprint.ships.find((s) => s.id === shipId);
        return ship ? ship.techPoint : -1;
      }
      case ShipTypes.battleCruiser:
      case ShipTypes.carrier: {
        const superCap = blueprint.superCapitals.find((sc) => sc.id === shipId);
        return superCap ? superCap.techPoint : 0;
      }
      default:
        return 0;
    }
  };

  const createAcquiredBlueprint = (accountId: string): void => {
    const newBlueprint: AcquiredBluePrint = {
      id: uuidv4(),
      accountId,
      displayMode: "percent",
      editLock: false,
      showZeroPercentBluePrint: false,
      ships: [],
      superCapitals: [],
    };

    dispatch({
      type: "CREATE_ACQUIRED_BLUEPRINT",
      payload: newBlueprint,
    });
  };

  const updateBlueprintSetting = (
    accountId: string,
    setting: Partial<BluePrintSetting>,
  ): void => {
    dispatch({
      type: "UPDATE_BLUEPRINT_SETTING",
      payload: {
        accountId,
        setting,
      },
    });
  };

  const addShipVariant = (
    accountId: string,
    shipId: string,
    variant: number,
    techPoint?: number,
  ): void => {
    dispatch({
      type: "ADD_SHIP_VARIANT",
      payload: {
        accountId,
        shipId,
        variant,
        techPoint,
      },
    });
  };

  const removeShipVariant = (
    accountId: string,
    shipId: string,
    variant: number,
  ): void => {
    dispatch({
      type: "REMOVE_SHIP_VARIANT",
      payload: {
        accountId,
        shipId,
        variant,
      },
    });
  };

  const addSuperCap = (accountId: string, superCapId: string, techPoint?: number): void => {
    dispatch({
      type: "ADD_SUPER_CAP",
      payload: {
        accountId,
        superCapId,
        techPoint,
      },
    });
  };

  const removeSuperCap = (accountId: string, superCapId: string): void => {
    dispatch({
      type: "REMOVE_SUPER_CAP",
      payload: {
        accountId,
        superCapId,
      },
    });
  };

  const addModule = (
    accountId: string,
    superCapId: string,
    moduleId: string,
  ): void => {
    dispatch({
      type: "ADD_MODULE",
      payload: {
        accountId,
        superCapId,
        moduleId,
      },
    });
  };

  const removeModule = (
    accountId: string,
    superCapId: string,
    moduleId: string,
  ): void => {
    dispatch({
      type: "REMOVE_MODULE",
      payload: {
        accountId,
        superCapId,
        moduleId,
      },
    });
  };

  const updateShipVariantProgress = (
    accountId: string,
    shipId: string,
    variant: number,
    progress: number,
  ): void => {
    dispatch({
      type: "UPDATE_SHIP_VARIANT_PROGRESS",
      payload: {
        accountId,
        shipId,
        variant,
        progress,
      },
    });
  };

  return {
    getAcquiredBlueprintByAccountId,
    getAllAcquiredBlueprints,
    getBlueprintSettingForSelectedAccount,
    hasShipVariant,
    hasSuperCap,
    hasModule,
    getShipVariantProgress,
    techPointByShipType,
    getReportForSelectedAccount,
    techPointsByShip,
    createAcquiredBlueprint,
    updateBlueprintSetting,
    addShipVariant,
    removeShipVariant,
    addSuperCap,
    removeSuperCap,
    addModule,
    removeModule,
    updateShipVariantProgress,
  };
}
