// 示例组件：展示如何使用Context系统
import React, { useState } from 'react';
import {
    useGameAccount,
    useSelectedAccount,
    useTimerGroup,
    useTaskTimeStamp,
    useStateImportExport,
} from '../hooks';

const ExampleComponent: React.FC = () => {
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountId, setNewAccountId] = useState('');

    // 使用游戏账户Hook
    const {
        getAllAccounts,
        addAccount,
        removeAccount,
        changeAccountName,
        getAccountCount,
    } = useGameAccount();

    // 使用选中账户Hook
    const {
        selectedAccount,
        setSelectedAccount,
        hasSelectedAccount,
    } = useSelectedAccount();

    // 使用计时器组Hook
    const {
        createTimerGroup,
        addTimerToCategory,
    } = useTimerGroup();

    // 使用任务时间戳Hook
    const {
        addTaskTimeStamp,
        getActiveTasks,
        clearCompletedTasks,
    } = useTaskTimeStamp();

    // 使用状态导入导出Hook
    const {
        exportState,
        resetState,
        createBackup,
    } = useStateImportExport();

    const accounts = getAllAccounts();
    const activeTasks = getActiveTasks();

    const handleAddAccount = () => {
        if (newAccountId && newAccountName) {
            addAccount(newAccountId, newAccountName);
            setNewAccountId('');
            setNewAccountName('');
        }
    };

    const handleAddTask = () => {
        const taskId = `task-${Date.now()}`;
        const duration = 60000; // 1分钟
        const startTime = Date.now();
        addTaskTimeStamp(taskId, duration, startTime);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Context系统示例</h1>
            
            {/* 账户管理部分 */}
            <section style={{ marginBottom: '30px' }}>
                <h2>账户管理</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="账户ID"
                        value={newAccountId}
                        onChange={(e) => setNewAccountId(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <input
                        type="text"
                        placeholder="账户名称"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={handleAddAccount} style={{ padding: '5px 10px' }}>
                        添加账户
                    </button>
                </div>
                
                <p>总账户数: {getAccountCount()}</p>
                
                <div>
                    <h3>账户列表:</h3>
                    {accounts.map(account => (
                        <div key={account.id} style={{ margin: '5px 0', padding: '10px', border: '1px solid #ccc' }}>
                            <span>{account.name} (ID: {account.id})</span>
                            <button 
                                onClick={() => setSelectedAccount(account.id)}
                                style={{ marginLeft: '10px', padding: '2px 8px' }}
                            >
                                选择
                            </button>
                            <button 
                                onClick={() => removeAccount(account.id)}
                                style={{ marginLeft: '5px', padding: '2px 8px', backgroundColor: '#ff6b6b', color: 'white' }}
                            >
                                删除
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 选中账户信息 */}
            <section style={{ marginBottom: '30px' }}>
                <h2>当前选中账户</h2>
                {hasSelectedAccount() ? (
                    <div style={{ padding: '10px', backgroundColor: '#e8f5e8' }}>
                        <p>账户名: {selectedAccount?.name}</p>
                        <p>账户ID: {selectedAccount?.id}</p>
                        <button 
                            onClick={() => selectedAccount && createTimerGroup(selectedAccount.id)}
                            style={{ padding: '5px 10px' }}
                        >
                            创建计时器组
                        </button>
                    </div>
                ) : (
                    <p>未选择账户</p>
                )}
            </section>

            {/* 任务管理 */}
            <section style={{ marginBottom: '30px' }}>
                <h2>任务管理</h2>
                <button onClick={handleAddTask} style={{ padding: '5px 10px', marginRight: '10px' }}>
                    添加测试任务
                </button>
                <button onClick={clearCompletedTasks} style={{ padding: '5px 10px' }}>
                    清理已完成任务
                </button>
                
                <div style={{ marginTop: '10px' }}>
                    <h3>活跃任务数: {activeTasks.length}</h3>
                    {activeTasks.map(task => (
                        <div key={task.id} style={{ margin: '5px 0', padding: '5px', backgroundColor: '#f0f0f0' }}>
                            任务 {task.id} - 持续时间: {task.duration}ms
                        </div>
                    ))}
                </div>
            </section>

            {/* 状态管理 */}
            <section>
                <h2>状态管理</h2>
                <button 
                    onClick={() => exportState()}
                    style={{ padding: '5px 10px', marginRight: '10px' }}
                >
                    导出状态
                </button>
                <button 
                    onClick={() => createBackup()}
                    style={{ padding: '5px 10px', marginRight: '10px' }}
                >
                    创建备份
                </button>
                <button 
                    onClick={resetState}
                    style={{ padding: '5px 10px', backgroundColor: '#ff6b6b', color: 'white' }}
                >
                    重置状态
                </button>
            </section>
        </div>
    );
};

export default ExampleComponent;