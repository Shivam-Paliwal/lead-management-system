import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(values);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <h1 className="h3 mb-1">Lead Manager</h1>
        <p className="muted mb-4">Sign in to your workspace.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input className="form-control" id="email" name="email" type="email" value={values.email} onChange={updateField} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-control"
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={updateField}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="text-center mt-3">
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </main>
  );
};

export default Login;

