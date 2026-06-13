import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import Loading from "../components/Loading";
import leadService from "../services/leadService";

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLead = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await leadService.getById(id);
        setLead(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load lead.");
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id]);

  const updateLead = async (payload) => {
    const updatedLead = await leadService.update(id, payload);
    navigate(`/leads/${updatedLead.id}`);
  };

  return (
    <main className="page-wrap">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Edit Lead</h1>
          <div className="muted">Update contact and pipeline details</div>
        </div>
        <Link className="btn btn-outline-secondary" to={`/leads/${id}`}>
          Back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <Loading label="Loading lead" />}
      {!loading && lead && <LeadForm initialValues={lead} onSubmit={updateLead} submitLabel="Update Lead" showRandomButton={false} />}
    </main>
  );
};

export default EditLead;

