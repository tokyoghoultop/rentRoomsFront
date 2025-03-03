import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchBookingsByPhone } from '../api/bookingApi';

const MyBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ค้นหาการจอง
  const handleSearch = async (event) => {
    event.preventDefault();
    
    if (!searchTerm) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกเบอร์โทรศัพท์',
        severity: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const data = await searchBookingsByPhone(searchTerm);
      setBookings(data.bookings);
      setSearched(true);
    } catch (error) {
      console.error('Error searching bookings:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'ไม่สามารถค้นหาข้อมูลการจองได้',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        ค้นหาการจองของฉัน
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                helperText="เช่น 0812345678"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
              >
                ค้นหา
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : searched && (
        <>
          {bookings.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่จอง</TableCell>
                    <TableCell>เวลา</TableCell>
                    <TableCell>ห้อง</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>อุปกรณ์</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {new Date(booking.date).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>{`${booking.start_time} - ${booking.end_time}`}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                ไม่พบข้อมูลการจองสำหรับเบอร์โทรศัพท์นี้
              </Typography>
            </Paper>
          )}
        </>
      )}

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

export default MyBookings;
