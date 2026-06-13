import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import leadService from "../services/leadService";
import { sourceLabels } from "../utils/leadOptions";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
};

const actionLabels = {
  LEAD_CREATED: "Lead Created",
  LEAD_UPDATED: "Lead Updated",
  LEAD_ASSIGNED: "Lead Assigned",
  STATUS_CHANGED: "Status Changed"
};

const Detail = ({ label, children }) => (
  <div>
    <span className="field-label">{label}</span>
    <div>{children || "-"}</div>
  </div>
);

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLead = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [leadData, activityData] = await Promise.all([leadService.getById(id), leadService.activity(id)]);
      setLead(leadData);
      setLogs(activityData);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load lead details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Lead Details</h1>
          <div className="muted">Contact profile and activity history</div>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/leads">
            Back
          </Link>
          <Link className="btn btn-primary" to={`/leads/${id}/edit`}>
            Edit
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <Loading label="Loading lead details" />}
      {!loading && lead && (
        <div className="row g-3">
          <div className="col-lg-7">
            <section className="surface">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <div>
                  <h2 className="h4 mb-1">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <div className="muted">{lead.company || "No company"}</div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <div className="details-grid">
                <Detail label="Email">{lead.email}</Detail>
                <Detail label="Phone">{lead.phone}</Detail>
                <Detail label="Source">{sourceLabels[lead.source] || lead.source}</Detail>
                <Detail label="Assigned To">{lead.assignedTo?.name || "Unassigned"}</Detail>
                <Detail label="Created By">{lead.createdBy?.name}</Detail>
                <Detail label="Updated By">{lead.updatedBy?.name}</Detail>
                <Detail label="Created">{formatDateTime(lead.createdAt)}</Detail>
                <Detail label="Updated">{formatDateTime(lead.updatedAt)}</Detail>
              </div>
              <div className="mt-4">
                <span className="field-label">Notes</span>
                <div className="border rounded p-3 bg-light">{lead.notes || "No notes recorded."}</div>
              </div>
            </section>
          </div>
          <div className="col-lg-5">
            <section className="surface h-100">
              <h2 className="h5 mb-3">Activity</h2>
              {logs.length === 0 && <div className="muted">No activity recorded.</div>}
              <div className="d-grid gap-3">
                {logs.map((log) => (
                  <div className="activity-line" key={log.id}>
                    <div className="fw-semibold">{actionLabels[log.action] || log.action}</div>
                    <div>{log.message}</div>
                    <div className="small muted">
                      {log.actor?.name || "System"} · {formatDateTime(log.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
};

export default LeadDetails;

