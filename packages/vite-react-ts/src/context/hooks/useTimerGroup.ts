// 计时器组相关的自定义Hooks
import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { TimerGroup } from '../types';

export const useTimerGroup = () => {
    const { state, dispatch } = useAppContext();

    // 根据账户ID获取计时器组
    const getTimerGroupByAccountId = useCallback((accountId: string): TimerGroup | undefined => {
        return state.timerGroup[accountId];
    }, [state.timerGroup]);

    // 更新计时器组
    const updateTimerGroup = useCallback((accountId: string, timerGroup: TimerGroup) => {
        dispatch({
            type: 'TIMER_GROUP/UPDATE',
            payload: { accountId, timerGroup },
        });
    }, [dispatch]);

    // 创建新的计时器组
    const createTimerGroup = useCallback((accountId: string) => {
        const newTimerGroup: TimerGroup = {
            accountId,
            construction: [],
            baseUpgrade: [],
            ship: [],
            miner: [],
            capitalShip: [],
            research: [],
            agreement: [],
        };
        updateTimerGroup(accountId, newTimerGroup);
    }, [updateTimerGroup]);

    // 添加计时器到指定类别
    const addTimerToCategory = useCallback((
        accountId: string,
        category: keyof Omit<TimerGroup, 'accountId'>,
        timerId: string
    ) => {
        const currentTimerGroup = getTimerGroupByAccountId(accountId);
        if (!currentTimerGroup) {
            createTimerGroup(accountId);
            return;
        }

        const updatedTimerGroup = {
            ...currentTimerGroup,
            [category]: [...currentTimerGroup[category], timerId],
        };
        updateTimerGroup(accountId, updatedTimerGroup);
    }, [getTimerGroupByAccountId, createTimerGroup, updateTimerGroup]);

    // 从指定类别移除计时器
    const removeTimerFromCategory = useCallback((
        accountId: string,
        category: keyof Omit<TimerGroup, 'accountId'>,
        timerId: string
    ) => {
        const currentTimerGroup = getTimerGroupByAccountId(accountId);
        if (!currentTimerGroup) return;

        const updatedTimerGroup = {
            ...currentTimerGroup,
            [category]: currentTimerGroup[category].filter(id => id !== timerId),
        };
        updateTimerGroup(accountId, updatedTimerGroup);
    }, [getTimerGroupByAccountId, updateTimerGroup]);

    // 获取指定类别的计时器列表
    const getTimersByCategory = useCallback((
        accountId: string,
        category: keyof Omit<TimerGroup, 'accountId'>
    ): string[] => {
        const timerGroup = getTimerGroupByAccountId(accountId);
        return timerGroup ? timerGroup[category] : [];
    }, [getTimerGroupByAccountId]);

    // 清空指定类别的计时器
    const clearTimersInCategory = useCallback((
        accountId: string,
        category: keyof Omit<TimerGroup, 'accountId'>
    ) => {
        const currentTimerGroup = getTimerGroupByAccountId(accountId);
        if (!currentTimerGroup) return;

        const updatedTimerGroup = {
            ...currentTimerGroup,
            [category]: [],
        };
        updateTimerGroup(accountId, updatedTimerGroup);
    }, [getTimerGroupByAccountId, updateTimerGroup]);

    return {
        timerGroups: state.timerGroup,
        getTimerGroupByAccountId,
        updateTimerGroup,
        createTimerGroup,
        addTimerToCategory,
        removeTimerFromCategory,
        getTimersByCategory,
        clearTimersInCategory,
    };
};