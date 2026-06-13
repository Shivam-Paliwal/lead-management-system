import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="page-wrap">
      <div className="surface text-center py-5">
        <h1 className="h3">Page Not Found</h1>
        <p className="muted">The route you opened is not available.</p>
        <Link className="btn btn-primary" to="/">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFound;

