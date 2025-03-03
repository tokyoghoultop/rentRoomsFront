import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Box } from "@mui/material";
import { NavigateSetter } from "./hooks/useGlobalNavigate";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./features/Home/Booking";
import Login from "./pages/Login";
import CustomRoom from "./pages/CustomRoom";
import AddEditRoom from "./features/CustomRoom/AddEditRoom";
import Calendar from "./pages/Calendar";
import EquipmentStats from "./pages/EquipmentStats";
import BookingList from "./pages/BookingList";
import EditBooking from "./pages/EditBooking";
import EquipmentManagement from "./pages/EquipmentManagement";
import MyBookings from "./pages/MyBookings";

function AppLayout({ children }) {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login"; // ตรวจสอบว่าหน้าปัจจุบันคือ Login หรือไม่

  return (
    <Box sx={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />} {/* ซ่อน Sidebar เมื่ออยู่ที่หน้า Login */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <NavigateSetter />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customroom" element={<CustomRoom />} />
          <Route path="/customroom/addEditRoom" element={<AddEditRoom />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar/:roomId" element={<Calendar />} />
          <Route path="/home/booking/:roomId" element={<Booking />} />
          <Route path="/equipmentstats" element={<EquipmentStats />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/edit/:id" element={<EditBooking />} />
          <Route path="/equipment" element={<EquipmentManagement />} />
          <Route path="/mybookings" element={<MyBookings />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
