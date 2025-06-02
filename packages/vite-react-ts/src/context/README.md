# Context状态管理系统

这个目录包含了基于React Context的状态管理系统，用于替代Redux。

## 目录结构

```
src/context/
├── types/                    # 类型定义
│   ├── game-account.types.ts
│   ├── timer-group.types.ts
│   ├── fleet-planner.types.ts
│   ├── acquired-blue-print.types.ts
│   ├── selected-account.types.ts
│   ├── task-time-stamp.types.ts
│   ├── angulum-city-data.types.ts
│   ├── app-state.types.ts
│   └── index.ts
├── hooks/                    # 自定义Hooks
│   ├── useGameAccount.ts
│   ├── useSelectedAccount.ts
│   ├── useTimerGroup.ts
│   ├── useTaskTimeStamp.ts
│   ├── useStateImportExport.ts
│   └── index.ts
├── reducers/                 # Reducer函数
│   └── app-reducer.ts
├── utils/                    # 工具函数
│   └── local-storage.ts
├── examples/                 # 示例组件
│   └── ExampleComponent.tsx
├── AppContext.tsx           # 主Context定义
├── index.ts                 # 主导出文件
└── README.md               # 本文件
```

## 主要特性

### 1. 类型安全
- 完整的TypeScript类型定义
- 强类型的状态和Action
- 编译时类型检查

### 2. 自动持久化
- 状态变化时自动保存到localStorage
- 应用启动时自动加载保存的状态
- 版本管理和状态迁移支持

### 3. 模块化设计
- 每个功能模块都有专门的Hook
- 清晰的关注点分离
- 易于测试和维护

### 4. 丰富的工具函数
- 状态导入/导出
- 状态备份和恢复
- 状态验证

## 使用方法

### 1. 基本设置

在应用的根组件中使用`AppProvider`：

```tsx
import { AppProvider } from './context';

function App() {
    return (
        <AppProvider>
            {/* 你的应用组件 */}
        </AppProvider>
    );
}
```

### 2. 使用状态

在组件中使用相应的Hook：

```tsx
import { useGameAccount, useSelectedAccount } from './context/hooks';

function MyComponent() {
    const { getAllAccounts, addAccount } = useGameAccount();
    const { selectedAccount, setSelectedAccount } = useSelectedAccount();
    
    // 使用状态和方法
    const accounts = getAllAccounts();
    
    return (
        <div>
            {/* 组件内容 */}
        </div>
    );
}
```

### 3. 可用的Hooks

#### `useGameAccount`
- `getAllAccounts()`: 获取所有账户
- `getAccountById(id)`: 根据ID获取账户
- `addAccount(id, name)`: 添加账户
- `removeAccount(id)`: 删除账户
- `changeAccountName(id, name)`: 修改账户名称
- `accountExists(id)`: 检查账户是否存在
- `getAccountCount()`: 获取账户数量

#### `useSelectedAccount`
- `selectedAccount`: 当前选中的账户
- `selectedAccountId`: 当前选中的账户ID
- `setSelectedAccount(id)`: 设置选中的账户
- `clearSelectedAccount()`: 清除选中的账户
- `hasSelectedAccount()`: 检查是否有选中的账户

#### `useTimerGroup`
- `getTimerGroupByAccountId(accountId)`: 获取指定账户的计时器组
- `updateTimerGroup(accountId, timerGroup)`: 更新计时器组
- `createTimerGroup(accountId)`: 创建新的计时器组
- `addTimerToCategory(accountId, category, timerId)`: 添加计时器到类别
- `removeTimerFromCategory(accountId, category, timerId)`: 从类别移除计时器
- `getTimersByCategory(accountId, category)`: 获取指定类别的计时器
- `clearTimersInCategory(accountId, category)`: 清空指定类别的计时器

#### `useTaskTimeStamp`
- `getAllTaskTimeStamps()`: 获取所有任务时间戳
- `getTaskTimeStampById(id)`: 根据ID获取任务时间戳
- `addTaskTimeStamp(id, duration, startTime)`: 添加任务时间戳
- `removeTaskTimeStamp(id)`: 删除任务时间戳
- `getRemainingTime(id)`: 获取任务剩余时间
- `isTaskCompleted(id)`: 检查任务是否已完成
- `getTaskProgress(id)`: 获取任务进度百分比
- `getActiveTasks()`: 获取所有活跃任务
- `getCompletedTasks()`: 获取所有已完成任务
- `clearCompletedTasks()`: 清理所有已完成任务

#### `useStateImportExport`
- `exportState(filename?)`: 导出状态到文件
- `importState(file)`: 从文件导入状态
- `resetState()`: 重置状态到初始值
- `clearLocalStorage()`: 清除本地存储
- `loadState(newState)`: 加载指定状态
- `getStateAsJson()`: 获取状态的JSON字符串
- `loadStateFromJson(jsonString)`: 从JSON字符串加载状态
- `createBackup(backupName?)`: 创建状态备份
- `validateState(state)`: 验证状态格式

## 从Redux迁移

### 1. 替换Provider

将Redux的`Provider`替换为`AppProvider`：

```tsx
// 之前 (Redux)
import { Provider } from 'react-redux';
import { store } from './redux/core/store';

<Provider store={store}>
    <App />
</Provider>

// 现在 (Context)
import { AppProvider } from './context';

<AppProvider>
    <App />
</AppProvider>
```

### 2. 替换useSelector和useDispatch

```tsx
// 之前 (Redux)
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAccounts } from './redux/game-account';
import { addAccount } from './redux/actions/game-account';

const accounts = useSelector(selectAllAccounts);
const dispatch = useDispatch();
const handleAddAccount = () => dispatch(addAccount(id, name));

// 现在 (Context)
import { useGameAccount } from './context/hooks';

const { getAllAccounts, addAccount } = useGameAccount();
const accounts = getAllAccounts();
const handleAddAccount = () => addAccount(id, name);
```

### 3. 状态结构保持一致

Context系统保持了与Redux相同的状态结构，因此大部分业务逻辑可以直接迁移。

## 性能考虑

1. **Context分割**: 如果应用变得很大，可以考虑将Context分割成多个小的Context
2. **Memoization**: 使用`useMemo`和`useCallback`来优化性能
3. **选择性订阅**: 只订阅需要的状态部分

## 测试

可以通过访问`/context-example`路由来查看Context系统的示例用法。

## 注意事项

1. 确保所有使用Context的组件都在`AppProvider`内部
2. 状态更新是异步的，如果需要立即获取更新后的状态，使用Hook返回的方法
3. 本地存储的状态会在每次状态变化时自动保存
4. 如果需要禁用自动保存，可以修改`AppContext.tsx`中的`useEffect`