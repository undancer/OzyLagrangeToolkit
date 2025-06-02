// 获得蓝图相关类型定义
export interface AcquiredBluePrintState {
    [index: string]: AcquiredBluePrint;
}

export interface AcquiredBluePrint {
    accountId: string;
    ships: Record<string, AcquiredShip>;
    superCaps: Record<string, AcquiredSuperCap>;
    displayMode: BPDisplayMode;
}

export enum BPDisplayMode {
    All,
    Owned,
    NotOwned,
}

export interface AcquiredSuperCap {
    id: string;
    techPoint: number;
    modules: string[];
}

export interface AcquiredShip {
    id: string;
    techPoint: number;
    variants: number[];
    partialComplete: Record<number, number>;
}

export interface AddRemoveShipAction {
    accountId: string;
    shipId: string;
    variant: number;
}

export interface AddRemoveSuperCapAction {
    accountId: string;
    superCapId: string;
}

export interface AddRemoveModel {
    accountId: string;
    superCapId: string;
    moduleId: string;
}