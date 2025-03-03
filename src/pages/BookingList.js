import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { fetchAllBookings, approveBooking } from '../api/bookingApi';

const BookingList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // โหลดข้อมูลการจองทั้งหมด
  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setSnackbar({
        open: true,
        message: 'ไม่สามารถโหลดข้อมูลการจองได้',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // จัดการการเปลี่ยนหน้า
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // จัดการการเปลี่ยนจำนวนแถวต่อหน้า
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // จัดการการอนุมัติการจอง
  const handleApprove = async (bookingId, status) => {
    try {
      await approveBooking(bookingId, status);
      setSnackbar({
        open: true,
        message: 'อนุมัติการจองเรียบร้อยแล้ว',
        severity: 'success'
      });
      loadBookings(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error('Error approving booking:', error);
      setSnackbar({
        open: true,
        message: 'ไม่สามารถอนุมัติการจองได้',
        severity: 'error'
      });
    }
  };

  // จัดการการแก้ไขการจอง
  const handleEdit = (bookingId) => {
    navigate(`/bookings/edit/${bookingId}`);
  };

  // แสดง Loading
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        รายการจองทั้งหมด
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>วันที่จอง</TableCell>
              <TableCell>เวลา</TableCell>
              <TableCell>ผู้จอง</TableCell>
              <TableCell>ห้อง</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>อุปกรณ์</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : bookings
            ).map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{new Date(booking.date).toLocaleDateString('th-TH')}</TableCell>
                <TableCell>{`${booking.start_time} - ${booking.end_time}`}</TableCell>
                <TableCell>
                  <div>{booking.fullName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'gray' }}>{booking.phone}</div>
                </TableCell>
                <TableCell>{booking.room_name}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      booking.status === 1 ? 'อนุมัติแล้ว' :
                        booking.status === 99 ? 'ยกเลิก' :
                          'รอการอนุมัติ'
                    }
                    color={
                      booking.status === 1 ? 'success' :
                        booking.status === 99 ? 'error' :
                          'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {booking.equipment_names.map((equipment, index) => (
                      <Chip key={index} label={equipment} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(booking.id)}
                    title="แก้ไข"
                  >
                    <EditIcon />
                  </IconButton>
                  {booking.status == 0 && (
                    <IconButton
                      color="success"
                      onClick={() => handleApprove(booking.id, 1)}
                      title="อนุมัติ"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  {booking.status == 0 && (
                    <IconButton
                      color="error"
                      onClick={() => handleApprove(booking.id, 99)}
                      title="ยกเลิก"
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="แถวต่อหน้า"
        />
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookingList;
