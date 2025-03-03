import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchEquipments, createEquipment, updateEquipment, deleteEquipment } from '../api/equipmentsApi';

const EquipmentManagement = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ฟอร์มสำหรับเพิ่ม/แก้ไขอุปกรณ์
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1
  });

  // โหลดข้อมูลอุปกรณ์
  const loadEquipments = async () => {
    try {
      setLoading(true);
      const data = await fetchEquipments();
      setEquipments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching equipments:', err);
      setError('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  // จัดการการเปิด Dialog
  const handleOpenDialog = (equipment = null) => {
    if (equipment) {
      setSelectedEquipment(equipment);
      setFormData({
        name: equipment.name,
        description: equipment.description || '',
        quantity: equipment.quantity
      });
    } else {
      setSelectedEquipment(null);
      setFormData({
        name: '',
        description: '',
        quantity: 1
      });
    }
    setOpenDialog(true);
  };

  // จัดการการปิด Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEquipment(null);
    setFormData({
      name: '',
      description: '',
      quantity: 1
    });
  };

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  // บันทึกข้อมูล
  const handleSave = async () => {
    try {
      if (selectedEquipment) {
        await updateEquipment(selectedEquipment.id, formData);
        setSnackbar({ open: true, message: 'อัพเดทข้อมูลอุปกรณ์สำเร็จ', severity: 'success' });
      } else {
        await createEquipment(formData);
        setSnackbar({ open: true, message: 'เพิ่มอุปกรณ์ใหม่สำเร็จ', severity: 'success' });
      }
      handleCloseDialog();
      loadEquipments();
    } catch (err) {
      console.error('Error saving equipment:', err);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', severity: 'error' });
    }
  };

  // ลบอุปกรณ์
  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์นี้?')) {
      try {
        await deleteEquipment(id);
        setSnackbar({ open: true, message: 'ลบอุปกรณ์สำเร็จ', severity: 'success' });
        loadEquipments();
      } catch (err) {
        console.error('Error deleting equipment:', err);
        setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการลบข้อมูล', severity: 'error' });
      }
    }
  };

  // จัดการการเปลี่ยนหน้า
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // จัดการการเปลี่ยนจำนวนแถวต่อหน้า
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          จัดการข้อมูลอุปกรณ์
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          เพิ่มอุปกรณ์ใหม่
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>ชื่ออุปกรณ์</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? equipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : equipments
            ).map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell>{equipment.id}</TableCell>
                <TableCell>{equipment.name}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(equipment)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(equipment.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={equipments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="แถวต่อหน้า"
        />
      </TableContainer>

      {/* Dialog สำหรับเพิ่ม/แก้ไขอุปกรณ์ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEquipment ? 'แก้ไขข้อมูลอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ชื่ออุปกรณ์"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            ยกเลิก
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={!formData.name || formData.quantity < 1}
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar สำหรับแสดงผลการทำงาน */}
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

export default EquipmentManagement;
