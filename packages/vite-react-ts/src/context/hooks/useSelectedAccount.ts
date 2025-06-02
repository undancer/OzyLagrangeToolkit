// 选中账户相关的自定义Hooks
import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { GameAccount } from '../types';

export const useSelectedAccount = () => {
    const { state, dispatch } = useAppContext();

    // 获取当前选中的账户ID
    const selectedAccountId = state.selectedAccountId;
    console.log('useSelectedAccount - selectedAccountId:', selectedAccountId);

    // 获取当前选中的账户信息
    const selectedAccount = useCallback((): GameAccount | undefined => {
        if (!selectedAccountId) return undefined;
        return state.gameAccounts.find(account => account.id === selectedAccountId);
    }, [state.gameAccounts, selectedAccountId]);

    // 设置选中的账户
    const setSelectedAccount = useCallback((accountId: string) => {
        console.log('setSelectedAccount called with accountId:', accountId);
        dispatch({
            type: 'SELECTED_ACCOUNT/SET',
            payload: { accountId },
        });
    }, [dispatch]);

    // 清除选中的账户
    const clearSelectedAccount = useCallback(() => {
        console.log('clearSelectedAccount called');
        dispatch({
            type: 'SELECTED_ACCOUNT/SET',
            payload: { accountId: '' },
        });
    }, [dispatch]);

    // 检查是否有选中的账户
    const hasSelectedAccount = useCallback((): boolean => {
        const result = !!selectedAccountId && state.gameAccounts.some(account => account.id === selectedAccountId);
        console.log('hasSelectedAccount result:', result);
        return result;
    }, [selectedAccountId, state.gameAccounts]);

    return {
        selectedAccountId,
        selectedAccount: selectedAccount(),
        setSelectedAccount,
        clearSelectedAccount,
        hasSelectedAccount,
    };
};