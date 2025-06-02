// React Context和Provider组件
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction } from './types';
import { appReducer, initialState } from './reducers/app-reducer';
import { saveState, loadState } from './utils/local-storage';

// Context类型定义
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

// 创建Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件属性
interface AppProviderProps {
    children: ReactNode;
}

// Provider组件
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // 初始化状态，尝试从本地存储加载
    const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
        const savedState = loadState();
        return savedState || initial;
    });

    // 状态变化时自动保存到本地存储
    useEffect(() => {
        saveState(state);
    }, [state]);

    const contextValue: AppContextType = {
        state,
        dispatch,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// 自定义Hook用于使用Context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext必须在AppProvider内部使用');
    }
    return context;
};

// 便捷的状态选择器Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAppState = () => {
    const { state } = useAppContext();
    return state;
};

// 便捷的dispatch Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAppDispatch = () => {
    const { dispatch } = useAppContext();
    return dispatch;
};