import { Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import { ProductsList } from "../pages/products";
import { SaleForm } from "../pages/sales";
import InvoicesList from "../pages/sales/InvoicesList";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
      <Route path="/products" element={token ? <ProductsList /> : <Login />} />
      <Route path="/sales" element={token ? <SaleForm /> : <Login />} />
      <Route path="/invoices" element={token ? <InvoicesList /> : <Login />} />
      <Route path="/invoices/history" element={token ? <InvoicesList /> : <Login />} />
    </Routes>
  );
}
