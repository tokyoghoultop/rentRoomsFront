import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchRoomsApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/rooms`);
  return response.data;
};

export const fetchRoomByIdApi = async (roomId) => {
  const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
  return response.data;
};

export const createRoomApi = async (roomData) => {
  const response = await axios.post(`${API_BASE_URL}/rooms/create`, roomData);
  return response.data;
};

export const updateRoomApi = async (roomData, roomId) => {
    const response = await axios.put(`${API_BASE_URL}/rooms/update/${roomId}`, roomData);
    return response.data;
};

export const deleteRoomApi = async (roomId) => {
    const response = await axios.delete(`${API_BASE_URL}/rooms/delete/${roomId}`);
    return response.data;
}