import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { sourceLabels } from "../utils/leadOptions";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
};

const LeadTable = ({ leads, onDelete, canDelete = false }) => {
  const handleDelete = (lead) => {
    if (window.confirm(`Delete ${lead.firstName} ${lead.lastName}?`)) {
      onDelete(lead.id);
    }
  };

  return (
    <div className="table-responsive table-surface">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Status</th>
            <th>Source</th>
            <th>Assigned To</th>
            <th>Created</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4 muted">
                No leads found.
              </td>
            </tr>
          )}
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div className="fw-semibold">
                  {lead.firstName} {lead.lastName}
                </div>
                <div className="small muted">{lead.email}</div>
              </td>
              <td>{lead.company || "-"}</td>
              <td>
                <StatusBadge status={lead.status} />
              </td>
              <td>{sourceLabels[lead.source] || lead.source}</td>
              <td>{lead.assignedTo?.name || "Unassigned"}</td>
              <td>{formatDate(lead.createdAt)}</td>
              <td className="text-end">
                <div className="btn-group btn-group-sm" role="group" aria-label="Lead actions">
                  <Link className="btn btn-outline-primary" to={`/leads/${lead.id}`}>
                    View
                  </Link>
                  <Link className="btn btn-outline-secondary" to={`/leads/${lead.id}/edit`}>
                    Edit
                  </Link>
                  {canDelete && onDelete && (
                    <button className="btn btn-outline-danger" type="button" onClick={() => handleDelete(lead)}>
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;

