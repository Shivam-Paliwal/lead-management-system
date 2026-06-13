import api from "./api";

const authService = {
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data.data;
  },

  async login(payload) {
    const response = await api.post("/auth/login", payload);
    return response.data.data;
  },

  async me() {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  async logout() {
    await api.post("/auth/logout");
  }
};

export default authService;

