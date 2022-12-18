import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Tracker from "./components/tracker";
import BluePrint from "./components/blue-print";
import DevelopmentDebug from "./components/debug";
import { store } from "./redux/core/store";
import { NavigationBar } from "./components/navigation-bar";
import BluePrintReport from "./components/blue-print-report";
import FleetBuilder from "./components/fleet-planner";

const container = document.getElementById("root");
// This line is suggested by officla React Website
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={darkTheme}>
                <NavigationBar />
                <div className="game-body">
                    <Routes>
                        <Route path="/" element={<BluePrint />} />
                        <Route path="/blueprint" element={<BluePrint />} />
                        <Route path="/blueprintreport" element={<BluePrintReport />} />
                        <Route path="/tracker" element={<Tracker />} />
                        <Route path="/fleetbuilder" element={<FleetBuilder />} />
                        <Route path="/localStorageDebug" element={<DevelopmentDebug />} />
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
);
