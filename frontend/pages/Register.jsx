import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
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
      await register(values);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <h1 className="h3 mb-1">Create Account</h1>
        <p className="muted mb-4">Start a Lead Manager session.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input className="form-control" id="name" name="name" value={values.name} onChange={updateField} required />
        </div>
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
            minLength="8"
            value={values.password}
            onChange={updateField}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <div className="text-center mt-3">
          <Link to="/login">Back to login</Link>
        </div>
      </form>
    </main>
  );
};

export default Register;

