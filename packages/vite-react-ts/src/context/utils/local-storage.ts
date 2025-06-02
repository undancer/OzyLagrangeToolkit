// 本地存储工具函数
import { AppState } from '../types';

const STATE_KEY = 'app-state';
const VERSION_KEY = 'state-version';
const CURRENT_VERSION = '7'; // Context版本

export const saveState = (state: AppState): void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STATE_KEY, serializedState);
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    } catch (error) {
        console.warn('保存状态时出错:', error);
    }
};

export const loadState = (): AppState | undefined => {
    try {
        const serializedState = localStorage.getItem(STATE_KEY);
        const version = localStorage.getItem(VERSION_KEY);
        
        if (serializedState === null) {
            return undefined;
        }
        
        const parsedState = JSON.parse(serializedState);
        
        // 版本检查和迁移逻辑
        if (version !== CURRENT_VERSION) {
            console.log(`状态版本从 ${version} 迁移到 ${CURRENT_VERSION}`);
            // 这里可以添加状态迁移逻辑
            return migrateState(parsedState, version);
        }
        
        return parsedState;
    } catch (error) {
        console.warn('加载状态时出错:', error);
        return undefined;
    }
};

export const clearState = (): void => {
    try {
        localStorage.removeItem(STATE_KEY);
        localStorage.removeItem(VERSION_KEY);
    } catch (error) {
        console.warn('清除状态时出错:', error);
    }
};

// 状态迁移函数
const migrateState = (state: any, fromVersion: string | null): AppState | undefined => {
    // 从Redux状态迁移到Context状态
    if (!fromVersion || fromVersion === '6') {
        // 假设版本6是Redux版本，需要迁移到Context格式
        return state; // 暂时直接返回，实际项目中可能需要格式转换
    }
    
    return state;
};

// 导出状态到JSON文件
export const exportStateToFile = (state: AppState, filename: string = 'app-state-export.json'): void => {
    try {
        const dataStr = JSON.stringify(state, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('导出状态时出错:', error);
    }
};

// 从JSON文件导入状态
export const importStateFromFile = (file: File): Promise<AppState> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    const state = JSON.parse(result);
                    resolve(state);
                } else {
                    reject(new Error('文件读取失败'));
                }
            } catch (error) {
                reject(new Error('JSON解析失败'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('文件读取出错'));
        };
        
        reader.readAsText(file);
    });
};