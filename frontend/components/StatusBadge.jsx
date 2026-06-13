import { statusLabels } from "../utils/leadOptions";

const statusClasses = {
  NEW: "bg-secondary-subtle text-secondary-emphasis",
  CONTACTED: "bg-primary-subtle text-primary-emphasis",
  QUALIFIED: "bg-info-subtle text-info-emphasis",
  PROPOSAL: "bg-warning-subtle text-warning-emphasis",
  WON: "bg-success-subtle text-success-emphasis",
  LOST: "bg-danger-subtle text-danger-emphasis"
};

const StatusBadge = ({ status }) => {
  return <span className={`badge badge-status ${statusClasses[status] || "bg-light text-dark"}`}>{statusLabels[status] || status}</span>;
};

export default StatusBadge;

