import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;

export const uploadImageApi = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};
