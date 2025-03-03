import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// ดึงข้อมูลอุปกรณ์ทั้งหมด
export const fetchEquipments = async () => {
    const response = await axios.get(`${API_BASE_URL}/equipments`);
    return response.data;
};

// ดึงข้อมูลสถิติการใช้งานอุปกรณ์
export const fetchEquipmentStatsApi = async () => {
    const response = await axios.get(`${API_BASE_URL}/equipments/stats`);
    return response.data;
};

// เพิ่มอุปกรณ์ใหม่
export const createEquipment = async (equipmentData) => {
    const response = await axios.post(`${API_BASE_URL}/equipments`, equipmentData);
    return response.data;
};

// อัพเดทข้อมูลอุปกรณ์
export const updateEquipment = async (id, equipmentData) => {
    const response = await axios.put(`${API_BASE_URL}/equipments/${id}`, equipmentData);
    return response.data;
};

// ลบข้อมูลอุปกรณ์
export const deleteEquipment = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/equipments/${id}`);
    return response.data;
};
