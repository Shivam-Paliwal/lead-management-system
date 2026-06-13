import { useEffect, useState } from "react";
import leadService from "../services/leadService";
import { LEAD_SOURCES, LEAD_STATUSES, sourceLabels, statusLabels } from "../utils/leadOptions";

const emptyLead = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  source: "OTHER",
  status: "NEW",
  notes: ""
};

const LeadForm = ({ initialValues, onSubmit, submitLabel = "Save Lead", showRandomButton = true }) => {
  const [values, setValues] = useState(emptyLead);
  const [saving, setSaving] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValues({
      ...emptyLead,
      ...initialValues
    });
  }, [initialValues]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSubmit(values);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save lead.");
    } finally {
      setSaving(false);
    }
  };

  const loadRandomLead = async () => {
    setLoadingRandom(true);
    setError("");

    try {
      const randomLead = await leadService.randomLead();
      setValues((current) => ({
        ...current,
        ...randomLead
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load random lead.");
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <form className="surface" onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="firstName">
            First Name
          </label>
          <input className="form-control" id="firstName" name="firstName" value={values.firstName} onChange={updateField} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="lastName">
            Last Name
          </label>
          <input className="form-control" id="lastName" name="lastName" value={values.lastName} onChange={updateField} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input className="form-control" id="email" name="email" type="email" value={values.email} onChange={updateField} required />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="phone">
            Phone
          </label>
          <input className="form-control" id="phone" name="phone" value={values.phone || ""} onChange={updateField} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="company">
            Company
          </label>
          <input className="form-control" id="company" name="company" value={values.company || ""} onChange={updateField} />
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="source">
            Source
          </label>
          <select className="form-select" id="source" name="source" value={values.source} onChange={updateField}>
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {sourceLabels[source]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="status">
            Status
          </label>
          <select className="form-select" id="status" name="status" value={values.status} onChange={updateField}>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="notes">
            Notes
          </label>
          <textarea className="form-control" id="notes" name="notes" rows="4" value={values.notes || ""} onChange={updateField} />
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-end mt-4">
        {showRandomButton && (
          <button className="btn btn-outline-secondary" type="button" onClick={loadRandomLead} disabled={loadingRandom || saving}>
            {loadingRandom ? "Loading..." : "Random Lead"}
          </button>
        )}
        <button className="btn btn-primary" type="submit" disabled={saving || loadingRandom}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;

