import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CreateLead from "../pages/CreateLead";
import Dashboard from "../pages/Dashboard";
import EditLead from "../pages/EditLead";
import LeadDetails from "../pages/LeadDetails";
import LeadList from "../pages/LeadList";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/new" element={<CreateLead />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/leads/:id/edit" element={<EditLead />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;

