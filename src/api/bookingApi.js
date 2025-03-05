import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// สร้างการจองใหม่
export const createBookingApi = async (bookingData) => {
    const response = await axios.post(`${API_BASE_URL}/bookings/create`, bookingData);
    return response.data;
};

// ดึงข้อมูลการจองทั้งหมด
export const fetchAllBookings = async () => {
    const response = await axios.get(`${API_BASE_URL}/bookings`);
    return response.data;
};

// ดึงข้อมูลการจองตาม ID
export const getBookingById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}`);
    return response.data;
};

// อัพเดทข้อมูลการจอง
export const updateBooking = async (id, bookingData) => {
    const response = await axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData);
    return response.data;
};

// อนุมัติการจอง
export const approveBooking = async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/bookings/${id}/status`, { status });
    return response.data;
};

// ค้นหาการจองด้วยเบอร์โทรศัพท์
export const searchBookingsByPhone = async (phone) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/search/phone/${phone}`);
    return response.data;
};
