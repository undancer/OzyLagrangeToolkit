// 游戏账户相关的自定义Hooks
import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { GameAccount } from '../types';

export const useGameAccount = () => {
    const { state, dispatch } = useAppContext();

    // 获取所有账户
    const getAllAccounts = useCallback((): GameAccount[] => {
        return Object.values(state.gameAccount);
    }, [state.gameAccount]);

    // 根据ID获取账户
    const getAccountById = useCallback((id: string): GameAccount | undefined => {
        return state.gameAccount[id];
    }, [state.gameAccount]);

    // 添加账户
    const addAccount = useCallback((id: string, name: string) => {
        dispatch({
            type: 'GAME_ACCOUNT/ADD',
            payload: { id, name },
        });
    }, [dispatch]);

    // 删除账户
    const removeAccount = useCallback((id: string) => {
        dispatch({
            type: 'GAME_ACCOUNT/REMOVE',
            payload: { id },
        });
    }, [dispatch]);

    // 修改账户名称
    const changeAccountName = useCallback((id: string, name: string) => {
        dispatch({
            type: 'GAME_ACCOUNT/CHANGE_NAME',
            payload: { id, name },
        });
    }, [dispatch]);

    // 检查账户是否存在
    const accountExists = useCallback((id: string): boolean => {
        return id in state.gameAccount;
    }, [state.gameAccount]);

    // 获取账户数量
    const getAccountCount = useCallback((): number => {
        return Object.keys(state.gameAccount).length;
    }, [state.gameAccount]);

    return {
        accounts: state.gameAccount,
        getAllAccounts,
        getAccountById,
        addAccount,
        removeAccount,
        changeAccountName,
        accountExists,
        getAccountCount,
    };
};