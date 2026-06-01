import { Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import { ProductsList } from "../pages/products";
import { SaleForm } from "../pages/sales";
import InvoicesList from "../pages/sales/InvoicesList";
import DailySalesList from "../pages/sales/DailySalesList";
import { ProfilePage } from "../pages/profile";
import RegisterForm from "../pages/users/RegisterForm";

interface AppRoutesProps {
  token: string | null;
  onLogin: (token: string | null) => void;
}

export default function AppRoutes({ token, onLogin }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Login onLogin={onLogin} />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Login onLogin={onLogin} />} />
      <Route path="/products" element={token ? <ProductsList /> : <Login onLogin={onLogin} />} />
      <Route path="/sales" element={token ? <SaleForm /> : <Login onLogin={onLogin} />} />
      <Route path="/sales/daily" element={token ? <DailySalesList /> : <Login onLogin={onLogin} />} />
      <Route path="/invoices" element={token ? <InvoicesList /> : <Login onLogin={onLogin} />} />
      <Route path="/invoices/history" element={token ? <InvoicesList /> : <Login onLogin={onLogin} />} />
      <Route path="/profile" element={token ? <ProfilePage /> : <Login onLogin={onLogin} />} />
      <Route path="/register" element={token ? <Dashboard /> : <RegisterForm />} />
    </Routes>
  );
}
