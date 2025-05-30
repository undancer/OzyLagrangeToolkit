export interface AccountNameChangeAction {
    id: string;
    name: string;
}
export interface GameAccountState {
    [index: string]: GameAccount;
}

interface GameAccount {
    id: string;
    name: string;
}
