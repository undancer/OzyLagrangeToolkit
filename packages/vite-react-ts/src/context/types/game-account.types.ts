// 游戏账户相关类型定义
export interface GameAccount {
    id: string;
    name: string;
}

export interface GameAccountState {
    [index: string]: GameAccount;
}

export interface AccountNameChangeAction {
    id: string;
    name: string;
}

export interface AddAccountAction {
    id: string;
    name: string;
}

export interface RemoveAccountAction {
    id: string;
}