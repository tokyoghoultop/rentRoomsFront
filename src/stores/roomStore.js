import { create } from "zustand";
import { fetchRoomsApi } from "../api/roomApi";

const useRoomStore = create((set) => ({
  rooms: [],
  loading: false,
  error: null,

  // ฟังก์ชันดึงข้อมูลจาก API
  fetchRooms: async () => {
    set({ loading: true, error: null }); // เริ่มโหลดข้อมูล
    try {
      const rooms = await fetchRoomsApi(); // เรียก API ที่แยกไว้ใน roomApi.js
      set({ rooms, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch rooms", loading: false });
    }
  },
}));

export default useRoomStore;
