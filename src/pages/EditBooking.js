import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, updateBooking } from '../api/bookingApi';
import { fetchRoomsApi } from '../api/roomApi';
import { fetchEquipments } from '../api/equipmentsApi';

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    roomId: '',
    fullName: '',
    phone: '',
    email: '',
    date: '',
    startTime: '',
    endTime: '',
    equipments: [],
    status: 0
  });

  // โหลดข้อมูลการจองและข้อมูลที่เกี่ยวข้อง
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingData, roomsData, equipmentsData] = await Promise.all([
          getBookingById(id),
          fetchRoomsApi(),
          fetchEquipments()
        ]);
        const { booking } = bookingData;
        console.log(booking);
        setRooms(roomsData);
        setEquipments(equipmentsData);

        // แปลงข้อมูลวันที่ให้อยู่ในรูปแบบที่ถูกต้อง
        const bookingDate = booking.date ? new Date(booking.date).toISOString().split('T')[0] : '';
        setFormData({
          roomId: booking.roomid,
          fullName: booking.fullname,
          phone: booking.phone,
          email: booking.email,
          date: bookingDate,
          startTime: booking.start_time,
          endTime: booking.end_time,
          equipments: booking.equipment_ids || [],
          status: booking.status || 0
        });
      } catch (error) {
        console.error('Error loading booking data:', error);
        setSnackbar({
          open: true,
          message: 'ไม่สามารถโหลดข้อมูลการจองได้',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // จัดการการเปลี่ยนแปลงอุปกรณ์ที่เลือก
  const handleEquipmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      equipments: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // บันทึกการแก้ไข
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await updateBooking(id, formData);
      setSnackbar({
        open: true,
        message: 'บันทึกการแก้ไขเรียบร้อยแล้ว',
        severity: 'success'
      });
      navigate('/bookings');
    } catch (error) {
      console.error('Error updating booking:', error);
      setSnackbar({
        open: true,
        message: 'ไม่สามารถบันทึกการแก้ไขได้',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  console.log(formData);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        แก้ไขข้อมูลการจอง
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ชื่อ-นามสกุล"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="อีเมล"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="ห้อง"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
                disabled={saving}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.roomName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="วันที่"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                disabled={saving}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="เวลาเริ่มต้น"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    disabled={saving}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="เวลาสิ้นสุด"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    disabled={saving}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={saving}>
                <InputLabel id="equipments-label">อุปกรณ์</InputLabel>
                <Select
                  labelId="equipments-label"
                  multiple
                  value={formData.equipments}
                  onChange={handleEquipmentChange}
                  input={<OutlinedInput label="อุปกรณ์" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const equipment = equipments.find(e => e.id === value);
                        return <Chip key={value} label={equipment ? equipment.name : value} />;
                      })}
                    </Box>
                  )}
                >
                  {equipments.map((equipment) => (
                    <MenuItem key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mr: 2 }}
                disabled={saving}
                startIcon={saving && <CircularProgress size={20} color="inherit" />}
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => navigate('/bookings')}
                disabled={saving}
              >
                ยกเลิก
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditBooking;
