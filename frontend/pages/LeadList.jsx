import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeadTable from "../components/LeadTable";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import leadService from "../services/leadService";
import { LEAD_SOURCES, LEAD_STATUSES, sourceLabels, statusLabels } from "../utils/leadOptions";

const LeadList = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    source: "",
    sortBy: "createdAt",
    sortOrder: "DESC"
  });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await leadService.list(filters);
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load leads.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 1
    }));
  };

  const deleteLead = async (id) => {
    setError("");

    try {
      await leadService.remove(id);
      await loadLeads();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete lead.");
    }
  };

  const canDelete = user?.role === "Admin" || user?.role === "Manager";

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Leads</h1>
          <div className="muted">Search, filter, sort, and manage the pipeline</div>
        </div>
        <Link className="btn btn-primary" to="/leads/new">
          Create Lead
        </Link>
      </div>

      <div className="surface mb-3">
        <div className="row g-3">
          <div className="col-lg-4">
            <label className="form-label" htmlFor="search">
              Search
            </label>
            <input
              className="form-control"
              id="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Name, email, company, phone"
            />
          </div>
          <div className="col-sm-6 col-lg-2">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <select className="form-select" id="status" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="">All</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-6 col-lg-2">
            <label className="form-label" htmlFor="source">
              Source
            </label>
            <select className="form-select" id="source" value={filters.source} onChange={(event) => updateFilter("source", event.target.value)}>
              <option value="">All</option>
              {LEAD_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {sourceLabels[source]}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-6 col-lg-2">
            <label className="form-label" htmlFor="sortBy">
              Sort By
            </label>
            <select className="form-select" id="sortBy" value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value)}>
              <option value="createdAt">Created</option>
              <option value="updatedAt">Updated</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="status">Status</option>
              <option value="source">Source</option>
            </select>
          </div>
          <div className="col-sm-6 col-lg-2">
            <label className="form-label" htmlFor="sortOrder">
              Direction
            </label>
            <select className="form-select" id="sortOrder" value={filters.sortOrder} onChange={(event) => updateFilter("sortOrder", event.target.value)}>
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <Loading label="Loading leads" /> : <LeadTable leads={leads} onDelete={deleteLead} canDelete={canDelete} />}
      <Pagination pagination={pagination} onPageChange={(page) => updateFilter("page", page)} />
    </main>
  );
};

export default LeadList;

