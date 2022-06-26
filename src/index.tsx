import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InfiniteLagrangeTracker from "./components/tracker";
import { store } from "./redux/core/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InfiniteLagrangeTracker />} />
        {/* <Route path="game" element={<InfiniteLagrangeTracker />} /> */}
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
