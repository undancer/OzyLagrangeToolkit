import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Tracker from "./components/tracker";
import BluePrint from "./components/blue-print";
import InDevelopment from "./components/in-development";
import { store } from "./redux/core/store";
import { NavigationBar } from "./components/navigation-bar";

ReactDOM.render(
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
    document.getElementById("root"),
);
