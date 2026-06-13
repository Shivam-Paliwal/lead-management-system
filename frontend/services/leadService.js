import api from "./api";

const leadService = {
  async list(params) {
    const response = await api.get("/leads", { params });
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/leads/${id}`);
    return response.data.data.lead;
  },

  async create(payload) {
    const response = await api.post("/leads", payload);
    return response.data.data.lead;
  },

  async update(id, payload) {
    const response = await api.put(`/leads/${id}`, payload);
    return response.data.data.lead;
  },

  async remove(id) {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  async activity(id) {
    const response = await api.get(`/leads/${id}/activity`);
    return response.data.data.logs;
  },

  async randomLead() {
    const response = await api.get("/utils/random-lead");
    return response.data.data.lead;
  }
};

export default leadService;

