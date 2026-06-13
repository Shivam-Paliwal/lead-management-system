import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          Lead Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/" end>
              Dashboard
            </NavLink>
            <NavLink className="nav-link" to="/leads">
              Leads
            </NavLink>
            <NavLink className="nav-link" to="/leads/new">
              Create Lead
            </NavLink>
          </div>
          {user && (
            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-sm-block">
                <div className="fw-semibold">{user.name}</div>
                <div className="small muted">{user.role}</div>
              </div>
              <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
