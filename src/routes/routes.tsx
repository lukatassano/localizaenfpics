import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { Form } from "../pages/form/form";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="pmapa" element={<Home />}>
          <Route path="cadastro" element={<Form />} />
        </Route>
      </Routes>
    </Router>
  );
}
