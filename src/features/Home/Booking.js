import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Box,
  MenuItem,
} from "@mui/material"; // Grid อยู่ใน @mui/material แล้ว
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import { fetchRoomByIdApi } from "../../api/roomApi";
import { fetchEquipments } from "../../api/equipmentsApi";
import { createBookingApi } from "../../api/bookingApi";
import Alert from "../../components/Alert";

function Booking() {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    fullName: "",
    phone: "",
    email: "",
    equipment: "",
  });

  useEffect(() => {
    getRoomDetails();
    const fetchEquipment = async () => {
      try {
        const equipmentData = await fetchEquipments();
        setEquipment(equipmentData);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };
    fetchEquipment();
  }, [roomId]);

  const getRoomDetails = async () => {
    try {
      const roomData = await fetchRoomByIdApi(roomId);
      setRoomDetails(roomData);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const bookingData = { ...formData, roomId };
      await createBookingApi(bookingData);

      await Alert({
        title: "Booking successful!",
        text: "Your booking has been confirmed.",
        icon: "success",
      });

      // Reset ฟอร์มหลังจากจองเสร็จ
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        date: "",
        equipment: "",
      });
    } catch (error) {
      await Alert({
        title: "Booking failed",
        text: error.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  if (!roomDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card sx={{ margin: "20px auto" }}>
      <CardContent>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={6}>
              <Typography variant="h4" gutterBottom>
                Booking Room {roomDetails.roomName}
              </Typography>
              <img
                src={roomDetails.imageUrl}
                alt={roomDetails.roomName}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Grid>
            <Grid size={6}>
              <Box sx={{ padding: 2, marginTop: 5 }}>
                <TextField
                  label="วันที่จอง"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
                <TextField
                  label="ชื่อ-นามสกุล"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="เบอร์โทร"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="อีเมล"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  select
                  label="อุปกรณ์เสริม"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  {equipment.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" fullWidth onClick={handleSubmit}>
                  ยืนยันการจอง
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Booking;
