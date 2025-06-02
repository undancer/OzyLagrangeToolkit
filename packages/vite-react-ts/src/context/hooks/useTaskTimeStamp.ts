// 任务时间戳相关的自定义Hooks
import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { TaskTimeStamp } from '../types';

export const useTaskTimeStamp = () => {
    const { state, dispatch } = useAppContext();

    // 获取所有任务时间戳
    const getAllTaskTimeStamps = useCallback((): TaskTimeStamp[] => {
        return Object.values(state.taskTimeStamp);
    }, [state.taskTimeStamp]);

    // 根据ID获取任务时间戳
    const getTaskTimeStampById = useCallback((id: string): TaskTimeStamp | undefined => {
        return state.taskTimeStamp[id];
    }, [state.taskTimeStamp]);

    // 添加任务时间戳
    const addTaskTimeStamp = useCallback((id: string, duration: number, startTime: number) => {
        dispatch({
            type: 'TASK_TIME_STAMP/ADD',
            payload: { id, duration, startTime },
        });
    }, [dispatch]);

    // 删除任务时间戳
    const removeTaskTimeStamp = useCallback((id: string) => {
        dispatch({
            type: 'TASK_TIME_STAMP/REMOVE',
            payload: { id },
        });
    }, [dispatch]);

    // 检查任务是否存在
    const taskExists = useCallback((id: string): boolean => {
        return id in state.taskTimeStamp;
    }, [state.taskTimeStamp]);

    // 获取任务剩余时间
    const getRemainingTime = useCallback((id: string): number => {
        const task = getTaskTimeStampById(id);
        if (!task) return 0;
        
        const currentTime = Date.now();
        const endTime = task.startTime + task.duration;
        const remaining = Math.max(0, endTime - currentTime);
        
        return remaining;
    }, [getTaskTimeStampById]);

    // 检查任务是否已完成
    const isTaskCompleted = useCallback((id: string): boolean => {
        return getRemainingTime(id) === 0;
    }, [getRemainingTime]);

    // 获取任务进度百分比
    const getTaskProgress = useCallback((id: string): number => {
        const task = getTaskTimeStampById(id);
        if (!task) return 0;
        
        const currentTime = Date.now();
        const elapsed = currentTime - task.startTime;
        const progress = Math.min(100, Math.max(0, (elapsed / task.duration) * 100));
        
        return progress;
    }, [getTaskTimeStampById]);

    // 获取所有活跃的任务（未完成的）
    const getActiveTasks = useCallback((): TaskTimeStamp[] => {
        return getAllTaskTimeStamps().filter(task => !isTaskCompleted(task.id));
    }, [getAllTaskTimeStamps, isTaskCompleted]);

    // 获取所有已完成的任务
    const getCompletedTasks = useCallback((): TaskTimeStamp[] => {
        return getAllTaskTimeStamps().filter(task => isTaskCompleted(task.id));
    }, [getAllTaskTimeStamps, isTaskCompleted]);

    // 清理所有已完成的任务
    const clearCompletedTasks = useCallback(() => {
        const completedTasks = getCompletedTasks();
        completedTasks.forEach(task => removeTaskTimeStamp(task.id));
    }, [getCompletedTasks, removeTaskTimeStamp]);

    return {
        taskTimeStamps: state.taskTimeStamp,
        getAllTaskTimeStamps,
        getTaskTimeStampById,
        addTaskTimeStamp,
        removeTaskTimeStamp,
        taskExists,
        getRemainingTime,
        isTaskCompleted,
        getTaskProgress,
        getActiveTasks,
        getCompletedTasks,
        clearCompletedTasks,
    };
};