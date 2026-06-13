import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles = [] }) => {
  const location = useLocation();
  const { bootstrapping, isAuthenticated, user } = useAuth();

  if (bootstrapping) {
    return <Loading label="Starting session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="page-wrap">
          <div className="alert alert-warning">You do not have permission to open this page.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;

