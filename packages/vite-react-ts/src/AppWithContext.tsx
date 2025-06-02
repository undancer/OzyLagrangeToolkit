// 使用Context系统的新App组件
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const AppWithContext: React.FC = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <ThemeProvider theme={darkTheme}>
                    <div className="App">
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
                </ThemeProvider>
            </BrowserRouter>
        </AppProvider>
    );
};

export default AppWithContext;