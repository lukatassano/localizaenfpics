import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../pages/home";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="pmapa" element={<Home />} />
      </Routes>
    </Router>
  );
}
