// 状态导入导出相关的自定义Hooks
import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { exportStateToFile, importStateFromFile, clearState } from '../utils/local-storage';
import { AppState } from '../types';

export const useStateImportExport = () => {
    const { state, dispatch } = useAppContext();

    // 导出当前状态到文件
    const exportState = useCallback((filename?: string) => {
        exportStateToFile(state, filename);
    }, [state]);

    // 从文件导入状态
    const importState = useCallback(async (file: File): Promise<void> => {
        try {
            const importedState = await importStateFromFile(file);
            dispatch({
                type: 'LOAD_STATE',
                payload: importedState,
            });
        } catch (error) {
            console.error('导入状态失败:', error);
            throw error;
        }
    }, [dispatch]);

    // 重置状态到初始值
    const resetState = useCallback(() => {
        dispatch({ type: 'RESET_STATE' });
    }, [dispatch]);

    // 清除本地存储的状态
    const clearLocalStorage = useCallback(() => {
        clearState();
    }, []);

    // 加载指定的状态
    const loadState = useCallback((newState: Partial<AppState>) => {
        dispatch({
            type: 'LOAD_STATE',
            payload: newState,
        });
    }, [dispatch]);

    // 获取状态的JSON字符串表示
    const getStateAsJson = useCallback((): string => {
        return JSON.stringify(state, null, 2);
    }, [state]);

    // 从JSON字符串加载状态
    const loadStateFromJson = useCallback((jsonString: string) => {
        try {
            const parsedState = JSON.parse(jsonString);
            loadState(parsedState);
        } catch (error) {
            console.error('JSON解析失败:', error);
            throw new Error('无效的JSON格式');
        }
    }, [loadState]);

    // 创建状态备份
    const createBackup = useCallback((backupName?: string) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = backupName || `app-state-backup-${timestamp}.json`;
        exportStateToFile(state, filename);
    }, [state]);

    // 验证状态格式是否正确
    const validateState = useCallback((stateToValidate: any): boolean => {
        try {
            // 基本结构验证
            const requiredKeys = [
                'gameAccount',
                'timerGroup',
                'taskTimeStamp',
                'acquiredBluePrint',
                'selectedAccount',
                'fleetPlanner',
                'angulumCityData'
            ];
            
            return requiredKeys.every(key => key in stateToValidate);
        } catch {
            return false;
        }
    }, []);

    return {
        exportState,
        importState,
        resetState,
        clearLocalStorage,
        loadState,
        getStateAsJson,
        loadStateFromJson,
        createBackup,
        validateState,
    };
};