import axios from "axios";

export const BASE_URL = "https://easternbaysolar.com/onstores_apis";
// export  const BASE_URL = "https://ON STOREapis.vercel.app";

// 🔹 API client (for all /api routes)
const httpClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});


export default httpClient;
export const BASE_IMAGE_URL =
  "https://easternbaysolar.com/onstores_apis/api/";