import { create } from "zustand";

const useAuthStore = create((set) => ({
    token: localStorage.getItem('authToken') || null,

    setToken: (newToken) => {
        localStorage.setItem('authToken', newToken);  // บันทึกลง localStorage
        set({ token: newToken });
    },

    clearToken: () => {
        localStorage.removeItem('authToken');  // ลบ token ออกจาก localStorage
        set({ token: null });
        window.location.href = '/'
    },
}));

export default useAuthStore;
