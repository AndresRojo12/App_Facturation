import { Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
    </Routes>
  );
}
