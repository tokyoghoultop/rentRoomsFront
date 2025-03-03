import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// ตรวจสอบช่วงเวลาที่ถูกจองไปแล้วสำหรับวันที่และห้องที่ระบุ
export const checkTimeSlotsApi = async (date, roomId) => {
  try {
    const response = await axios.get(`${API_URL}/availability/time-slots`, {
      params: { date, roomId }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking time slots:', error);
    throw error;
  }
};

// ตรวจสอบวันที่ในเดือนที่ห้องถูกจองเต็มทั้งหมด
export const checkMonthAvailabilityApi = async (month, year, roomId = null) => {
  try {
    const params = { month, year };
    if (roomId) {
      params.roomId = roomId;
    }
    
    const response = await axios.get(`${API_URL}/availability/month`, { params });
    return response.data;
  } catch (error) {
    console.error('Error checking month availability:', error);
    throw error;
  }
};
