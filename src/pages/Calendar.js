import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
  IconButton,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  TextField,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';
import { createBookingApi } from '../api/bookingApi';
import { fetchEquipments } from '../api/equipmentsApi';
import { checkTimeSlotsApi, checkMonthAvailabilityApi } from '../api/availabilityApi';

function Calendar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openTimeDialog, setOpenTimeDialog] = useState(false);
  const [bookings, setBookings] = useState([]); // This will store the booked time slots
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [disabledDates, setDisabledDates] = useState({});
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบ YYYY-MM-DD เพื่อแก้ไขปัญหา timezone
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate calendar data
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Time slots from 8:00 to 19:00
  const timeSlots = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Check if a time slot is booked
  const isTimeSlotBooked = (date, time) => {
    return bookings.some(booking =>
      booking.date === date.toDateString() &&
      booking.time === time
    );
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (date) {
      if (disabledDates[date.toDateString()]) {
        // ถ้าวันนี้ถูก disable (จองเต็มแล้ว) ไม่ต้องทำอะไร
        return;
      }
      console.log(formatDate(date));
      setSelectedDate(date);
      setOpenTimeDialog(true);

      // เมื่อเลือกวันที่ จะเรียก API เพื่อดึงข้อมูลช่วงเวลาที่ถูกจองไปแล้ว
      const fetchTimeSlots = async () => {
        try {
          const formattedDate = formatDate(date);
          const response = await checkTimeSlotsApi(formattedDate, roomId);

          // แปลงข้อมูลให้อยู่ในรูปแบบที่ใช้ในแอพ
          const bookedSlots = response?.bookedTimeSlots?.map(timeSlot => ({
            date: date?.toDateString(),
            time: timeSlot
          }));

          setBookings(bookedSlots);
        } catch (error) {
          console.error('Error fetching time slots:', error);
          setSnackbar({
            open: true,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลช่วงเวลา',
            severity: 'error'
          });
        }
      };

      fetchTimeSlots();
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    if (!selectedStartTime) {
      // First selection sets both start and end time to the same value
      setSelectedStartTime(time);
      setSelectedEndTime(time);
    } else {
      const startIndex = timeSlots.indexOf(selectedStartTime);
      const endIndex = timeSlots.indexOf(time);

      // Allow selecting end time before or after start time
      const [minTime, maxTime] = startIndex < endIndex
        ? [startIndex, endIndex]
        : [endIndex, startIndex];

      // Check if any time slot in the range is booked
      const isRangeAvailable = timeSlots
        .slice(minTime, maxTime + 1)
        .every(slot => !isTimeSlotBooked(selectedDate, slot));

      if (isRangeAvailable) {
        if (time === selectedStartTime) {
          // If clicking the same time, keep it as a single time slot
          setSelectedEndTime(time);
        } else {
          // If selecting backwards, swap the times
          if (startIndex > endIndex) {
            setSelectedEndTime(selectedStartTime);
            setSelectedStartTime(time);
          } else {
            setSelectedEndTime(time);
          }
        }
      } else {
        setSnackbar({
          open: true,
          message: 'มีช่วงเวลาที่ถูกจองแล้วในช่วงที่คุณเลือก',
          severity: 'error'
        });
        setSelectedStartTime(null);
        setSelectedEndTime(null);
      }
    }
  };

  // Clear time selection
  const handleClearTimeSelection = () => {
    setSelectedStartTime(null);
    setSelectedEndTime(null);
  };

  // Handle user details change
  const handleUserDetailsChange = (field) => (event) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!userDetails.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ';
    }

    if (!userDetails.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userDetails.email)) {
      newErrors.email = 'อีเมลไม่ถูกต้อง';
    }

    if (!userDetails.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{10}$/.test(userDetails.phone)) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load equipments
  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await fetchEquipments();
        setEquipments(data);
      } catch (error) {
        console.error('Error loading equipments:', error);
        setSnackbar({
          open: true,
          message: 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้',
          severity: 'error'
        });
      }
    };
    loadEquipments();
  }, []);

  // Handle equipment selection
  const handleEquipmentChange = (equipmentId) => {
    setSelectedEquipments(prev => {
      if (prev.includes(equipmentId)) {
        return prev.filter(id => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  // Handle booking confirmation
  const handleConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    if (selectedDate && selectedStartTime && selectedEndTime) {
      try {
        setLoading(true);

        const bookingData = {
          roomId,
          date: formatDate(selectedDate),
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          status: 'pending',
          fullName: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          equipments: selectedEquipments
        };

        await createBookingApi(bookingData);

        setSnackbar({
          open: true,
          message: 'จองห้องประชุมสำเร็จ',
          severity: 'success'
        });

        // Close dialog and reset selection
        setOpenTimeDialog(false);
        setSelectedDate(null);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setUserDetails({ name: '', email: '', phone: '' });
        setSelectedEquipments([]);

        // Navigate back to home after successful booking
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error) {
        console.error('Booking error:', error);
        setSnackbar({
          open: true,
          message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Navigation between months
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    // fetchMonthAvailability will be called automatically via useEffect when currentDate changes
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    // fetchMonthAvailability will be called automatically via useEffect when currentDate changes
  };

  // ดึงข้อมูลความพร้อมใช้งานของห้องในเดือนปัจจุบัน
  const fetchMonthAvailability = async () => {
    if (!roomId) return;

    const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const year = currentDate.getFullYear();

    const response = await checkMonthAvailabilityApi(month, year, roomId);

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ใช้ในแอพ
    const disabledDatesMap = {};

    // response.availability เป็น object ที่มี key เป็นวันที่ในรูปแบบ YYYY-MM-DD
    Object.entries(response?.fullyBookedDates).forEach(([dateStr, dayInfo]) => {
      if (dayInfo.isFullyBooked) {
        // สร้าง Date object จาก string ในรูปแบบ YYYY-MM-DD
        const date = new Date(dateStr + 'T00:00:00');
        disabledDatesMap[date.toDateString()] = true;
      }
    });

    setDisabledDates(disabledDatesMap);
  };

  const fetchMonthAvailabilityMemoized = useCallback(fetchMonthAvailability, [currentDate, roomId]);

  useEffect(() => {
    fetchMonthAvailabilityMemoized();
  }, [fetchMonthAvailabilityMemoized]);

  const weekDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  console.log(selectedEquipments);

  return (
    <>
      <Card
        sx={{
          maxWidth: 900,
          margin: '20px auto',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Calendar Header */}
          <Box
            sx={{
              background: theme.palette.primary.main,
              color: 'white',
              p: 3,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              {monthNames[currentDate.getMonth()]}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              {currentDate.getFullYear()}
            </Typography>
            <ButtonGroup
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <IconButton onClick={handlePrevMonth} sx={{ color: 'white' }}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={handleNextMonth} sx={{ color: 'white' }}>
                <ChevronRightIcon />
              </IconButton>
            </ButtonGroup>
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={1}>
              {weekDays.map(day => (
                <Grid item xs={12 / 7} key={day}>
                  <Typography
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.secondary,
                      mb: 2
                    }}
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}

              {getDaysInMonth(currentDate).map((date, index) => (
                <Grid item xs={12 / 7} key={index}>
                  {date && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderRadius: 2,
                        position: 'relative',
                        bgcolor: date.toDateString() === selectedDate?.toDateString()
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'background.paper',
                        border: isToday(date)
                          ? `2px solid ${theme.palette.primary.main}`
                          : '1px solid',
                        borderColor: isToday(date)
                          ? theme.palette.primary.main
                          : alpha(theme.palette.divider, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        },
                        opacity: disabledDates[date.toDateString()] ? 0.5 : 1,
                        pointerEvents: disabledDates[date.toDateString()] ? 'none' : 'auto'
                      }}
                      onClick={() => handleDateClick(date)}
                    >
                      <Typography
                        align="center"
                        sx={{
                          fontWeight: isToday(date) ? 'bold' : 'normal',
                          color: isToday(date)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Time Selection Dialog */}
          <Dialog
            open={openTimeDialog}
            onClose={() => !loading && setOpenTimeDialog(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 400
              }
            }}
          >
            <DialogTitle sx={{
              textAlign: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                เลือกเวลา
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedDate ? `วัน${new Date(selectedDate).toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}` : ''}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={1.5}>
                {timeSlots.map((time) => {
                  const isStart = time === selectedStartTime;
                  const isEnd = time === selectedEndTime;
                  const startIndex = timeSlots.indexOf(selectedStartTime);
                  const currentIndex = timeSlots.indexOf(time);
                  const endIndex = selectedEndTime ? timeSlots.indexOf(selectedEndTime) : -1;

                  const isInRange = selectedStartTime && selectedEndTime && (
                    (startIndex < endIndex && currentIndex > startIndex && currentIndex < endIndex) ||
                    (startIndex > endIndex && currentIndex < startIndex && currentIndex > endIndex)
                  );

                  return (
                    <Grid item xs={4} key={time}>
                      <Button
                        variant={isStart || isEnd || isInRange ? "contained" : "outlined"}
                        color={isStart || isEnd ? "primary" : isInRange ? "secondary" : "inherit"}
                        disabled={selectedDate && isTimeSlotBooked(selectedDate, time)}
                        onClick={() => handleTimeSelect(time)}
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          py: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          '&.Mui-disabled': {
                            bgcolor: alpha(theme.palette.action.disabled, 0.1)
                          }
                        }}
                      >
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                          {time}
                        </Typography>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>

              {(selectedStartTime || selectedEndTime) && (
                <Box
                  mt={3}
                  mb={2}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    p: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon
                      color="primary"
                      sx={{ mr: 1, fontSize: '1.2rem' }}
                    />
                    <Typography variant="subtitle2" color="primary" fontWeight="medium">
                      เวลาที่เลือก
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 3.5 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        เริ่มต้น:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedStartTime}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        สิ้นสุด:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedEndTime}
                      </Typography>
                    </Box>

                    {selectedStartTime === selectedEndTime && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        (จองเวลาเดียว)
                      </Typography>
                    )}
                  </Box>

                  <Button
                    onClick={handleClearTimeSelection}
                    size="small"
                    startIcon={<ClearIcon />}
                    sx={{
                      mt: 2,
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                        color: theme.palette.error.main
                      }
                    }}
                  >
                    ล้างการเลือก
                  </Button>
                </Box>
              )}

              {selectedStartTime && selectedEndTime && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    ข้อมูลผู้จอง
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="ชื่อ-นามสกุล"
                        variant="outlined"
                        value={userDetails.name}
                        onChange={handleUserDetailsChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="อีเมล"
                        type="email"
                        variant="outlined"
                        value={userDetails.email}
                        onChange={handleUserDetailsChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="เบอร์โทรศัพท์"
                        variant="outlined"
                        value={userDetails.phone}
                        onChange={handleUserDetailsChange('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        disabled={loading}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        อุปกรณ์เสริม
                      </Typography>
                      <FormGroup>
                        {equipments.map((equipment) => (
                          <FormControlLabel
                            key={equipment.id}
                            control={
                              <Checkbox
                                checked={selectedEquipments.includes(equipment.id)}
                                onChange={() => handleEquipmentChange(equipment.id)}
                                disabled={loading}
                              />
                            }
                            label={equipment.name}
                          />
                        ))}
                      </FormGroup>
                    </Grid>
                  </Grid>
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button
                onClick={() => setOpenTimeDialog(false)}
                variant="outlined"
                sx={{ borderRadius: 2, px: 3 }}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={!selectedStartTime || !selectedEndTime || loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark
                  }
                }}
              >
                {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการจอง'}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Calendar;
