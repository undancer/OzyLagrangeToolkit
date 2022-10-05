import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Tracker from "./components/tracker";
import BluePrint from "./components/blue-print";
import { store } from "./redux/core/store";
import { Provider } from "react-redux";
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
              <Route path="/fleetbuilder" element={<Tracker />} />
            </Routes>
          </div>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
