import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { Form } from "../pages/form";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Form />} />
      </Routes>
    </Router>
  );
}
