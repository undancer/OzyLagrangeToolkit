import React from 'react';
import { createRoot } from 'react-dom/client';

// 选择使用哪个版本的App
// 1. 使用Redux版本（原有的）
// import App from './index-redux';

// 2. 使用Context版本（新的）
import App from './AppWithContext';

// 3. 使用简单的Vite默认App
// import App from './App';

// import './index.css'

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
