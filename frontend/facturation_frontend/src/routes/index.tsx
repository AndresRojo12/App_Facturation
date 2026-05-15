import { Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import { ProductsList } from "../pages/products";
import { SaleForm } from "../pages/sales";
import InvoicesList from "../pages/sales/InvoicesList";
import DailySalesList from "../pages/sales/DailySalesList";
import { ProfilePage } from "../pages/profile";
import RegisterForm from "../pages/users/RegisterForm";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
      <Route path="/products" element={token ? <ProductsList /> : <Login />} />
      <Route path="/sales" element={token ? <SaleForm /> : <Login />} />
      <Route path="/sales/daily" element={token ? <DailySalesList /> : <Login />} />
      <Route path="/invoices" element={token ? <InvoicesList /> : <Login />} />
      <Route path="/invoices/history" element={token ? <InvoicesList /> : <Login />} />
      <Route path="/profile" element={token ? <ProfilePage /> : <Login />} />
      <Route path="/register" element={token ? <Dashboard /> : <RegisterForm />} />
    </Routes>
  );
}
