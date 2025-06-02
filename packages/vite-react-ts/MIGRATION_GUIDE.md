# 从Redux到Context的迁移指南

本指南将帮助你将现有的Redux代码迁移到新的Context状态管理系统。

## 概述

我们已经创建了一个完整的Context状态管理系统来替代Redux，主要优势包括：

- 🚀 **更简单的API**: 不需要actions、reducers的复杂设置
- 📦 **更小的包体积**: 移除了Redux相关依赖
- 🔧 **更好的TypeScript支持**: 完全类型安全的API
- 🎯 **更直观的使用方式**: 直接调用方法而不是dispatch actions
- 💾 **自动持久化**: 状态自动保存到localStorage

## 文件结构对比

### Redux版本 (保留在src/redux/)
```
src/redux/
├── core/store.ts
├── actions/
├── types/
├── selectors/
└── [各种reducer文件]
```

### Context版本 (新增在src/context/)
```
src/context/
├── AppContext.tsx
├── types/
├── hooks/
├── reducers/
├── utils/
└── examples/
```

## 主要变化

### 1. Provider设置

**之前 (Redux):**
```tsx
import { Provider } from 'react-redux';
import { store } from './redux/core/store';

<Provider store={store}>
    <App />
</Provider>
```

**现在 (Context):**
```tsx
import { AppProvider } from './context';

<AppProvider>
    <App />
</AppProvider>
```

### 2. 状态访问

**之前 (Redux):**
```tsx
import { useSelector } from 'react-redux';
import { selectAllAccounts } from './redux/game-account';

const accounts = useSelector(selectAllAccounts);
```

**现在 (Context):**
```tsx
import { useGameAccount } from './context/hooks';

const { getAllAccounts } = useGameAccount();
const accounts = getAllAccounts();
```

### 3. 状态更新

**之前 (Redux):**
```tsx
import { useDispatch } from 'react-redux';
import { addAccount } from './redux/actions/game-account';

const dispatch = useDispatch();
const handleAddAccount = () => {
    dispatch(addAccount(id, name));
};
```

**现在 (Context):**
```tsx
import { useGameAccount } from './context/hooks';

const { addAccount } = useGameAccount();
const handleAddAccount = () => {
    addAccount(id, name);
};
```

## 迁移步骤

### 第一阶段：设置Context系统 ✅

- [x] 创建Context类型定义
- [x] 创建Context Provider
- [x] 创建自定义Hooks
- [x] 创建示例组件
- [x] 更新main.tsx以使用Context版本

### 第二阶段：组件迁移 (待进行)

按以下顺序迁移组件：

1. **简单组件优先**
   - `navigation-bar.tsx`
   - `setting.tsx`
   - `debug.tsx`

2. **核心功能组件**
   - `tracker.tsx`
   - `timer-adder.tsx`
   - `individual-timer.tsx`

3. **复杂功能组件**
   - `blue-print.tsx`
   - `fleet-planner.tsx`
   - `angulum-system-map.tsx`

### 第三阶段：清理 (最后进行)

- 移除Redux相关依赖
- 删除src/redux目录
- 更新package.json

## 组件迁移模板

### 迁移一个使用Redux的组件

**之前:**
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/core/store';
import { selectAllAccounts } from '../redux/game-account';
import { addAccount } from '../redux/actions/game-account';

const MyComponent = () => {
    const accounts = useSelector(selectAllAccounts);
    const dispatch = useDispatch();
    
    const handleAdd = () => {
        dispatch(addAccount(id, name));
    };
    
    return (
        <div>
            {accounts.map(account => (
                <div key={account.id}>{account.name}</div>
            ))}
            <button onClick={handleAdd}>Add Account</button>
        </div>
    );
};
```

**之后:**
```tsx
import { useGameAccount } from '../context/hooks';

const MyComponent = () => {
    const { getAllAccounts, addAccount } = useGameAccount();
    const accounts = getAllAccounts();
    
    const handleAdd = () => {
        addAccount(id, name);
    };
    
    return (
        <div>
            {accounts.map(account => (
                <div key={account.id}>{account.name}</div>
            ))}
            <button onClick={handleAdd}>Add Account</button>
        </div>
    );
};
```

## Hook映射表

| Redux Selector/Action | Context Hook | 方法 |
|----------------------|--------------|------|
| `selectAllAccounts` | `useGameAccount` | `getAllAccounts()` |
| `selectAccount` | `useGameAccount` | `getAccountById(id)` |
| `addAccount` action | `useGameAccount` | `addAccount(id, name)` |
| `removeAccount` action | `useGameAccount` | `removeAccount(id)` |
| `changeAccountName` action | `useGameAccount` | `changeAccountName(id, name)` |
| `selectedAccount` state | `useSelectedAccount` | `selectedAccount` |
| `setSelectedAccount` action | `useSelectedAccount` | `setSelectedAccount(id)` |
| Timer group selectors | `useTimerGroup` | 各种timer相关方法 |
| Task timestamp selectors | `useTaskTimeStamp` | 各种task相关方法 |

## 测试新系统

1. **启动应用**
   ```bash
   npm run dev
   ```

2. **访问示例页面**
   - 打开浏览器访问 `http://localhost:5173/context-example`
   - 测试各种功能：添加账户、选择账户、创建任务等

3. **验证持久化**
   - 添加一些数据
   - 刷新页面
   - 确认数据仍然存在

## 切换版本

在`src/main.tsx`中可以轻松切换版本：

```tsx
// 使用Redux版本
// import App from './index-redux';

// 使用Context版本
import App from './AppWithContext';

// 使用简单的Vite默认App
// import App from './App';
```

## 常见问题

### Q: 如何处理异步操作？
A: 在Hook中使用async/await，或者在组件中处理异步逻辑。

### Q: 性能如何？
A: Context系统对于中等规模的应用性能很好。如果需要优化，可以使用React.memo和useMemo。

### Q: 如何调试状态？
A: 可以使用React DevTools，或者在Hook中添加console.log。

### Q: 可以回滚到Redux吗？
A: 是的，Redux代码完全保留在src/redux目录中，随时可以切换回去。

## 下一步

1. 测试Context示例页面
2. 选择一个简单的组件开始迁移
3. 逐步迁移其他组件
4. 在所有组件迁移完成后，考虑移除Redux依赖

## 需要帮助？

- 查看 `src/context/README.md` 了解详细的API文档
- 查看 `src/context/examples/ExampleComponent.tsx` 了解使用示例
- 如果遇到问题，可以随时切换回Redux版本