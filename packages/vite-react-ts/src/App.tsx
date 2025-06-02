
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// 使用Context系统的新App组件
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from './context';
import ExampleComponent from './context/examples/ExampleComponent';

// 导入现有组件（这些组件需要逐步迁移到使用Context）
import Tracker from "./components/tracker";
import BluePrint from "./components/blue-print";
import DevelopmentDebug from "./components/debug";
import Setting from "./components/setting";
import AngulumMap from "./components/angulum-system-map";
import { NavigationBar } from "./components/navigation-bar";
import BluePrintReport from "./components/blue-print-report";
import FleetBuilder from "./components/fleet-planner";
import "./components/css/index.css";

const AppWithContext: React.FC = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <div className="App bg-background-color text-text-color min-h-screen">
                    <NavigationBar />
                    <Routes>
                        <Route path="/" element={<Tracker />} />
                        <Route path="/blueprint" element={<BluePrint />} />
                        <Route path="/blueprint-report" element={<BluePrintReport />} />
                        <Route path="/fleet-builder" element={<FleetBuilder />} />
                        <Route path="/angulum-map" element={<AngulumMap />} />
                        <Route path="/setting" element={<Setting />} />
                        <Route path="/debug" element={<DevelopmentDebug />} />
                        {/* 新增Context示例页面 */}
                        <Route path="/context-example" element={<ExampleComponent />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AppProvider>
    );
};

export default AppWithContext;
