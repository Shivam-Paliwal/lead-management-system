import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LeadTable from "../components/LeadTable";
import Loading from "../components/Loading";
import leadService from "../services/leadService";
import { sourceLabels } from "../utils/leadOptions";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await leadService.list({
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "DESC"
        });
        setLeads(data.leads);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    return leads.reduce(
      (summary, lead) => {
        summary.total += 1;
        summary.byStatus[lead.status] = (summary.byStatus[lead.status] || 0) + 1;
        summary.bySource[lead.source] = (summary.bySource[lead.source] || 0) + 1;
        return summary;
      },
      {
        total: 0,
        byStatus: {},
        bySource: {}
      }
    );
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Dashboard</h1>
          <div className="muted">Sales pipeline snapshot</div>
        </div>
        <Link className="btn btn-primary" to="/leads/new">
          Create Lead
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Loading label="Loading dashboard" />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="metric">
                <div className="metric-label">Total Leads</div>
                <div className="metric-value">{stats.total}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="metric">
                <div className="metric-label">New</div>
                <div className="metric-value">{stats.byStatus.NEW || 0}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="metric">
                <div className="metric-label">Won</div>
                <div className="metric-value text-success">{stats.byStatus.WON || 0}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="metric">
                <div className="metric-label">Lost</div>
                <div className="metric-value text-danger">{stats.byStatus.LOST || 0}</div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-lg-8">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h2 className="h5 mb-0">Recent Leads</h2>
                <Link to="/leads">View all</Link>
              </div>
              <LeadTable leads={recentLeads} />
            </div>
            <div className="col-lg-4">
              <div className="surface h-100">
                <h2 className="h5 mb-3">Lead Sources</h2>
                {Object.keys(stats.bySource).length === 0 && <div className="muted">No source data yet.</div>}
                {Object.entries(stats.bySource).map(([source, count]) => (
                  <div className="mb-3" key={source}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{sourceLabels[source] || source}</span>
                      <span>{count}</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${Math.max((count / Math.max(stats.total, 1)) * 100, 5)}%` }}
                        aria-valuenow={count}
                        aria-valuemin="0"
                        aria-valuemax={stats.total}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;

