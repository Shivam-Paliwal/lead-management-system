import { useNavigate } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import leadService from "../services/leadService";

const CreateLead = () => {
  const navigate = useNavigate();

  const createLead = async (payload) => {
    const lead = await leadService.create(payload);
    navigate(`/leads/${lead.id}`);
  };

  return (
    <main className="page-wrap">
      <div className="mb-4">
        <h1 className="h3 mb-1">Create Lead</h1>
        <div className="muted">Add a new contact to the pipeline</div>
      </div>
      <LeadForm onSubmit={createLead} submitLabel="Create Lead" />
    </main>
  );
};

export default CreateLead;

