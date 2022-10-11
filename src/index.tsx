import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Tracker from "./components/tracker";
import BluePrint from "./components/blue-print";
import InDevelopment from "./components/in-development";
import { store } from "./redux/core/store";
import { NavigationBar } from "./components/navigation-bar";

const container = document.getElementById("root");
// This line is suggested by officla React Website
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <NavigationBar />
                <div className="game-body">
                    <Routes>
                        <Route path="/" element={<Tracker />} />
                        <Route path="/tracker" element={<Tracker />} />
                        <Route path="/blueprint" element={<BluePrint />} />
                        <Route path="/fleetbuilder" element={<InDevelopment />} />
                        <Route path="/research" element={<InDevelopment />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    </Provider>,
);
